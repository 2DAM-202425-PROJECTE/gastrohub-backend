import { NextFunction, Request, Response } from "express";
import OrderProduct from "../models/user";

export const getOrderProducts = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const products = await OrderProduct.findAll({
      where: {
        id_order: id,
      },
    });

    res.json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};

export const createOrderProduct = async (req: Request, res: Response) => {
  const { body } = req;

  try {
    const product = await OrderProduct.create(body);
    res.json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};

export const updateOrderProduct = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  const { body } = req;

  try {
    const product = await OrderProduct.findByPk(id);
    if (!product) {
      return res.status(404).json({
        msg: `There is no user with the id ${id}`,
      });
    } else {
      await product.update(body);

      res.json(product);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};

export const deleteOrderProduct = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;

  try {
    const product = await OrderProduct.findByPk(id);
    if (!product) {
      return res.status(404).json({
        msg: `There is no product with the id ${id}`,
      });
    } else {
      await product.destroy();

      res.json(product);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};
