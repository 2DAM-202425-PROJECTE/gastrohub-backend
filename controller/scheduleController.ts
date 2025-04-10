import { NextFunction, Request, Response } from "express";
import Schedule from "../models/schedule";

export const getSchedules = async (req: Request, res: Response) => {
  const { id } = req.params;

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

  try {
    const schedule = await Schedule.create(body);
    res.json(schedule);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};

export const updateSchedule = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id } = req.params;
  const { body } = req;

  try {
    const schedule = await Schedule.findByPk(id);
    if (!schedule) {
      return res.status(404).json({
        msg: `There is no schedule with the id ${id}`,
      });
    } else {
      await schedule.update(body);

      res.json(schedule);
    }
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

  try {
    const schedule = await Schedule.findByPk(id);
    if (!schedule) {
      return res.status(404).json({
        msg: `There is no schedule with the id ${id}`,
      });
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
    res.status(201).json({
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
