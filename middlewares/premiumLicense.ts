import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import License from "../models/license";
import Restaurant from "../models/restaurant";

export const premiumLicense = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user } = req.body;
  const { id_user } = user;

  try {
    const user: any = await User.findByPk(id_user);
    const restaurant: any = await Restaurant.findByPk(user.id_restaurant);
    if (!restaurant) {
      res.sendStatus(407);
      return;
    }
    const license: any = await License.findByPk(restaurant.id_license);
    if (!license) {
      res.sendStatus(408);
      return;
    }
    if (license.license_type !== 2) {
      res.sendStatus(410);
      return;
    }

    next();
  } catch (err) {
    res.sendStatus(500);
    return;
  }
};
