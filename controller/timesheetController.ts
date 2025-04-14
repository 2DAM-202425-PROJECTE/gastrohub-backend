import { NextFunction, Request, Response } from "express";
import Timesheet from "../models/timesheet";

export const getTimesheets = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { user } = req.body;
  const { id_user } = user;

  try {
    const timesheets = await Timesheet.findAll({
      where: {
        id_user: id,
      },
    });

    res.json(timesheets);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};

export const createTimesheet = async (req: Request, res: Response) => {
  const { user } = req.body;
  const { id_user } = user;

  try {
    const timesheet = await Timesheet.create(req.body);
    res.json(timesheet);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};

export const updateTimesheet = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id } = req.params;
  const { user } = req.body;
  const { id_user } = user;

  try {
    const timesheet = await Timesheet.findByPk(id);
    if (!timesheet) {
      return res.status(404).json({
        msg: `There is no timesheet with the id ${id}`,
      });
    } else {
      await timesheet.update(req.body);

      res.json(timesheet);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};

export const getActiveTimesheet = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { user } = req.body;
  const { id_user } = user;

  try {
    const timesheet = await Timesheet.findOne({
      where: {
        id_user: id,
        end_date: null,
      },
    });

    if (timesheet) {
      res.json(timesheet);
    } else {
      res.json({
        no_found: "No active timesheet found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};
