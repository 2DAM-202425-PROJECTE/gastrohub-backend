import { NextFunction, Request, Response } from "express";
import Inventory from "../models/inventory";

export const getInventory = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const inventory = await Inventory.findAll({
      where: {
        id_restaurant: id,
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

  try {
    const inventory = await Inventory.findByPk(id);
    if (!inventory) {
      return res.status(404).json({
        msg: `There is no inventory with the id ${id}`,
      });
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

  try {
    const inventory = await Inventory.findByPk(id);
    if (!inventory) {
      return res.status(404).json({
        msg: `There is no inventory with the id ${id}`,
      });
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

  try {
    const inventory = await Inventory.findByPk(id);
    if (!inventory) {
      return res.status(404).json({
        msg: `There is no inventory with the id ${id}`,
      });
    } else {
      await inventory.destroy();

      res.json(inventory);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};
