import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import License from "../models/license";
import Restaurant from "../models/restaurant";

export const restaurantLicense = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user } = req.body;
  const { id_user } = user;

  try {
    const user: any = await User.findByPk(id_user);
    if (user.id_restaurant === null) {
      res.sendStatus(418);
      return;
    }
    const restaurant: any = await Restaurant.findByPk(user.id_restaurant);
    if (!restaurant) {
      if (!user.admin) {
        await User.update(
          { id_restaurant: null, tag: null, pin: null },
          {
            where: {
              id_user: user.id_user,
            },
          }
        );
      }

      res.sendStatus(407);
      return;
    }
    const license: any = await License.findByPk(restaurant.id_license);
    if (!license) {
      if (!user.admin) {
        await User.update(
          { id_restaurant: null, tag: null, pin: null },
          {
            where: {
              id_user: user.id_user,
            },
          }
        );
      }
      res.sendStatus(408);
      return;
    }
    const currentDate = new Date();
    const expirationDate = new Date(license.end_date);
    if (currentDate > expirationDate) {
      await User.update(
        { id_restaurant: null, tag: null, pin: null },
        {
          where: {
            id_restaurant: user.id_restaurant,
            admin: false,
          },
        }
      );
      if (user.admin) {
        res.sendStatus(420);
        return;
      } else {
        res.sendStatus(409);
        return;
      }
    }
    next();
  } catch (err) {
    res.sendStatus(500);
    return;
  }
};
