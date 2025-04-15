import { NextFunction, Request, Response } from "express";
import License from "../models/license";
import User from "../models/user";
import Restaurant from "../models/restaurant";

export const getLicense = async (req: Request, res: Response) => {
  const { user } = req.body;
  const { id_user } = user;

  try {
    const user: any = await User.findByPk(id_user);
    const restaurant: any = await Restaurant.findByPk(user.id_restaurant);
    const license = await License.findByPk(restaurant.id_license);
    if (license) {
      res.json(license);
    } else {
      res.status(404).json({
        msg: `There is no license with the id ${restaurant.id_license}`,
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
  const { user } = req.body;
  const { id_user } = user;

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
  const { user } = req.body;
  const { id_user } = user;

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
  const { user } = req.body;
  const { id_user } = user;

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

export const licenseIsPremium = async (req: Request, res: Response) => {
  const { user } = req.body;
  const { id_user } = user;

  try {
    const user: any = await User.findByPk(id_user);
    const restaurant: any = await Restaurant.findByPk(user.id_restaurant);
    const license: any = await License.findByPk(restaurant.id_license);
    if (license) {
      if (license.license_type == 2) {
        res.json({ isPremium: true });
      } else {
        res.json({ isPremium: false });
      }
    } else {
      res.status(404).json({
        msg: `There is no license with the id ${restaurant.id_license}`,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};
