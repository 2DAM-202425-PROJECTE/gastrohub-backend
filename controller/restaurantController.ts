import { NextFunction, Request, Response } from "express";
import Restaurant from "../models/restaurant";

export const getRestaurants = async (req: Request, res: Response) => {
    try {
      const restaurants = await Restaurant.findAll();
  
      res.json(restaurants);
    } catch (error) {
      console.log(error);
      res.status(500).json({
        msg: "Talk to the administrator",
      });
    }
  };

export const getRestaurant = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const restaurant = await Restaurant.findByPk(id);
    if (restaurant) {
      res.json(restaurant);
    } else {
      res.status(404).json({
        msg: `There is no restaurant with the id ${id}`,
      });
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
  const { id } = req.params;
  const { body } = req;

  try {
    const restaurant = await Restaurant.findByPk(id);
    if (!restaurant) {
      return res.status(404).json({
        msg: `There is no restaurant with the id ${id}`,
      });
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

export const deleteRestaurant = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id } = req.params;

  try {
    const restaurant = await Restaurant.findByPk(id);
    if (!restaurant) {
      return res.status(404).json({
        msg: `There is no restaurant with the id ${id}`,
      });
    } else {
      await restaurant.destroy();

      res.json(restaurant);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};
