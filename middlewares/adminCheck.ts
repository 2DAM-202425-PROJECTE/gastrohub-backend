import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import Restaurant from "../models/restaurant";

export const adminCheck = async (
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
    if (!user.admin) {
      res.sendStatus(406);
      return;
    }
    next();
  } catch (err) {
    res.sendStatus(500);
    return;
  }
};
