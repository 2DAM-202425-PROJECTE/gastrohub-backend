import { NextFunction, Request, Response } from "express";
import Order from "../models/order";

export const getOrders = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const orders = await Order.findAll({
      where: {
        id_restaurant: id,
      },
    });

    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};

export const getOrder = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const order = await Order.findByPk(id);
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({
        msg: `There is no order with the id ${id}`,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};

export const createOrder = async (req: Request, res: Response) => {
  const { body } = req;

  try {
    const order = await Order.create(body);
    res.json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};

export const updateOrder = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  const { body } = req;

  try {
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({
        msg: `There is no order with the id ${id}`,
      });
    } else {
      await order.update(body);

      res.json(order);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};

export const deleteOrder = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;

  try {
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({
        msg: `There is no order with the id ${id}`,
      });
    } else {
      await order.destroy();

      res.json(order);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};
