import { NextFunction, Request, Response } from "express";
import Inventory from "../models/inventory";
import User from "../models/user";
import ProductIngredient from "../models/productIngredient";

export const getInventory = async (req: Request, res: Response) => {
  const { user } = req.body;
  const { id_user } = user;

  try {
    const user: any = await User.findByPk(id_user);
    const inventory = await Inventory.findAll({
      where: {
        id_restaurant: user.id_restaurant,
      },
    });

    res.json(inventory);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};

export const getOneElement = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id } = req.params;
  const { user } = req.body;
  const { id_user } = user;

  try {
    const inventory = await Inventory.findByPk(id);
    if (!inventory) {
      return res.sendStatus(404);
    } else {
      res.json(inventory);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};

export const createInventory = async (req: Request, res: Response) => {
  const { body } = req;
  const { user } = req.body;
  const { id_user } = user;

  try {
    const inventory = await Inventory.create(body);
    res.json(inventory);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};

export const updateInventory = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id } = req.params;
  const { body } = req;
  const { user } = req.body;
  const { id_user } = user;

  try {
    const inventory = await Inventory.findByPk(id);
    if (!inventory) {
      return res.sendStatus(404);
    } else {
      await inventory.update(body);

      res.json(inventory);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};

export const deleteInventory = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id } = req.params;
  const { user } = req.body;
  const { id_user } = user;

  try {
    const inventory = await Inventory.findByPk(id);
    if (!inventory) {
      return res.sendStatus(404);
    }

    const productIngredients = await ProductIngredient.findAll({
      where: {
        id_ingredient: id,
      },
    });
    await productIngredients.forEach(async (productIngredient) => {
      await productIngredient.destroy();
    });

    await inventory.destroy();
    res.json(inventory);
  } catch (error: any) {
    console.log(error);

    res.status(500).json({
      msg: "Habla con el administrador",
    });
  }
};
