import { NextFunction, Request, Response } from "express";
import Restaurant from "../models/restaurant";
import User from "../models/user";

export const getRestaurant = async (req: Request, res: Response) => {
  const { user } = req.body;
  const { id_user } = user;

  try {
    const user: any = await User.findByPk(id_user);
    const restaurant = await Restaurant.findByPk(user.id_restaurant);
    if (restaurant) {
      res.json(restaurant);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};

export const createRestaurant = async (req: Request, res: Response) => {
  const { body } = req;

  try {
    const restaurant = await Restaurant.create(body);
    res.json(restaurant);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};

export const updateRestaurant = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { body } = req;
  const { user } = req.body;
  const { id_user } = user;

  try {
    const user: any = await User.findByPk(id_user);

    const restaurant = await Restaurant.findByPk(user.id_restaurant);
    if (!restaurant) {
      res.sendStatus(404);
    } else {
      await restaurant.update(body);

      res.json(restaurant);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};
