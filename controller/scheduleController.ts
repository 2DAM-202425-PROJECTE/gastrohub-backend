import { NextFunction, Request, Response } from "express";
import Schedule from "../models/schedule";
import { getUsers } from "./userController";
import User from "../models/user";
import admin from "../services/firebase_service";

export const getUserSchedules = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { user } = req.body;
  const { id_user } = user;

  try {
    const schedules = await Schedule.findAll({
      where: {
        id_user: id,
      },
    });

    res.json(schedules);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};

export const createSchedule = async (req: Request, res: Response) => {
  const { body } = req;
  const { user } = req.body;
  const { id_user } = user;

  try {
    const schedule = await Schedule.create(body);
    const user: any = await User.findByPk(body.id_user);
    if (user.notificationToken != null) {
      let title = "";
      let body = "";
      if (user.language == "CA") {
        title = "🛎️ Nou horari";
        body = `Se t'ha assignat un nou horari!`;
      } else if (user.language == "ES") {
        title = "🛎️ Nuevo horario";
        body = `Se te ha asignado nuevo horario!`;
      } else {
        title = "🛎️ New schedule";
        body = `You have been assigned a new schedule!`;
      }
      const message = {
        notification: {
          title: title,
          body: body,
        },
        tokens: [user.notificationToken],
      };

      const response = await admin.messaging().sendEachForMulticast(message);
    }
    res.json(schedule);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};

export const deleteSchedule = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id } = req.params;
  const { user } = req.body;
  const { id_user } = user;

  try {
    const schedule = await Schedule.findByPk(id);
    if (!schedule) {
      res.sendStatus(404);
    } else {
      await schedule.destroy();

      res.json(schedule);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};

export const createMultipleSchedules = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { body } = req;
  const {
    start_date,
    end_date,
    monday,
    tuesday,
    wednesday,
    thursday,
    friday,
    saturday,
    sunday,
    selected_users,
  } = body;
  const { user } = req.body;
  const { id_user } = user;

  const dayMap: Record<number, string> = {
    0: "sunday",
    1: "monday",
    2: "tuesday",
    3: "wednesday",
    4: "thursday",
    5: "friday",
    6: "saturday",
  };

  const schedules: any[] = [];
  const dailySchedules: Record<string, string[]> = {
    monday,
    tuesday,
    wednesday,
    thursday,
    friday,
    saturday,
    sunday,
  };

  let currentDate = new Date(start_date);
  const finalDate = new Date(end_date);

  try {
    while (currentDate <= finalDate) {
      const dayOfWeek = currentDate.getDay();
      const dayName = dayMap[dayOfWeek];
      const timeslots = dailySchedules[dayName];

      if (timeslots && timeslots.length > 0) {
        for (const userId of selected_users) {
          for (const timeslot of timeslots) {
            const [startHour, endHour] = timeslot.split(" - ");

            const startTime = new Date(currentDate);
            const [startH, startM] = startHour.split(":");
            startTime.setHours(Number(startH), Number(startM), 0, 0);

            const endTime = new Date(currentDate);
            const [endH, endM] = endHour.split(":");
            endTime.setHours(Number(endH), Number(endM), 0, 0);

            if (endTime <= startTime) {
              endTime.setDate(endTime.getDate() + 1);
            }

            schedules.push({
              id_user: userId,
              start_time: startTime,
              end_time: endTime,
            });
          }
        }
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    const created = await Schedule.bulkCreate(schedules);

    const workers = await User.findAll({
      where: {
        id_user: selected_users,
      },
    });

    // Agrupar tokens por idioma
    const tokensByLanguage: Record<string, string[]> = {};

    workers.forEach((worker: any) => {
      if (worker.notificationToken) {
        const lang = worker.language || "EN";
        if (!tokensByLanguage[lang]) {
          tokensByLanguage[lang] = [];
        }
        tokensByLanguage[lang].push(worker.notificationToken);
      }
    });

    // Mensajes por idioma
    const messages: Record<string, { title: string; body: string }> = {
      CA: {
        title: "🛎️ Nou horari",
        body: "Se t'ha assignat un nou horari!",
      },
      ES: {
        title: "🛎️ Nuevo horario",
        body: "Se te ha asignado nuevo horario!",
      },
      EN: {
        title: "🛎️ New schedule",
        body: "You have been assigned a new schedule!",
      },
    };

    for (const lang in tokensByLanguage) {
      const tokens = tokensByLanguage[lang];
      const { title, body } = messages[lang] || messages.EN;

      const message = {
        notification: {
          title,
          body,
        },
        tokens,
      };

      const response = await admin.messaging().sendEachForMulticast(message);
    }
    res.status(200).json({
      msg: "Schedules created successfully",
      count: created.length,
      data: created,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};

export const deleteSoonSchedulesWorker = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const { id } = req.params;
  const { user } = req.body;
  const { id_user } = user;

  try {
    const schedules = await Schedule.findAll({
      where: {
        id_user: id,
      },
    });

    if (schedules) {
      for (const schedule of schedules) {
        const currentDate = new Date();
        const startTime = new Date((schedule as any).start_time);

        if (startTime <= currentDate) {
          await schedule.destroy();
        }
      }
    }

    res.json({
      msg: "Schedules deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};

export const getRestaurantSchedules = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { user } = req.body;
  const { id_user } = user;

  try {
    const user: any = await User.findByPk(id_user);
    const users = await User.findAll({
      where: {
        id_restaurant: user!.id_restaurant,
      },
    });

    const userIds = users.map((user) => user.get("id_user"));
    const schedules = await Schedule.findAll({
      where: {
        id_user: userIds,
      },
    });
    res.json(schedules);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};
