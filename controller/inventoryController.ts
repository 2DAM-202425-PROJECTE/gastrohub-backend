import { NextFunction, Request, Response } from "express";
import Inventory from "../models/inventory";
import User from "../models/user";

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
  const { user } = req.body;
  const { id_user } = user;

  try {
    const inventory = await Inventory.findByPk(id);
    if (!inventory) {
      return res.status(404).json({
        msg: `No existe un inventario con el id ${id}`,
      });
    }

    await inventory.destroy();
    res.json(inventory);
  } catch (error: any) {
    console.log(error);

    // Verificamos si el error es por restricción de clave foránea
    if (
      error.name === "SequelizeForeignKeyConstraintError" ||
      error.parent?.code === "ER_ROW_IS_REFERENCED_2" // Para MySQL
    ) {
      return res.status(400).json({
        msg: "Este inventario está asociado a un menú. Arregla ese menú primero antes de eliminar.",
      });
    }

    res.status(500).json({
      msg: "Habla con el administrador",
    });
  }
};
