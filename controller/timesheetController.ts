import { NextFunction, Request, Response } from "express";
import Timesheet from "../models/timesheet";

export const getTimesheets = async (req: Request, res: Response) => {
  const { id } = req.params;

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

export const getTimesheet = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const timesheet = await Timesheet.findByPk(id);
    if (timesheet) {
      res.json(timesheet);
    } else {
      res.status(404).json({
        msg: `There is no timesheet with the id ${id}`,
      });
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
      res.status(404).json({
        msg: `There is no active timesheet for the user with the id ${id}`,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};

export const createTimesheet = async (req: Request, res: Response) => {
  const { body } = req;

  try {
    const timesheet = await Timesheet.create(body);
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
  const { body } = req;

  try {
    const timesheet = await Timesheet.findByPk(id);
    if (!timesheet) {
      return res.status(404).json({
        msg: `There is no timesheet with the id ${id}`,
      });
    } else {
      await timesheet.update(body);

      res.json(timesheet);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};

export const deleteTimesheet = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id } = req.params;

  try {
    const timesheet = await Timesheet.findByPk(id);
    if (!timesheet) {
      return res.status(404).json({
        msg: `There is no timesheet with the id ${id}`,
      });
    } else {
      await timesheet.destroy();

      res.json(timesheet);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};
