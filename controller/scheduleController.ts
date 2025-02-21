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
