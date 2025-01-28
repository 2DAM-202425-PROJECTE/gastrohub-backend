import { NextFunction, Request, Response } from "express";
import License from "../models/license";

export const getLicense = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const license = await License.findByPk(id);
    if (license) {
      res.json(license);
    } else {
      res.status(404).json({
        msg: `There is no license with the id ${id}`,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};

export const createLicence = async (req: Request, res: Response) => {
  const { body } = req;

  try {
    const license = await License.create(body);
    res.json(license);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};

export const updateLicense = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id } = req.params;
  const { body } = req;

  try {
    const license = await License.findByPk(id);
    if (!license) {
      return res.status(404).json({
        msg: `There is no license with the id ${id}`,
      });
    } else {
      await license.update(body);

      res.json(license);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};

export const deleteLicense = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id } = req.params;

  try {
    const license = await License.findByPk(id);
    if (!license) {
      return res.status(404).json({
        msg: `There is no license with the id ${id}`,
      });
    } else {
      await license.destroy();

      res.json(license);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};
