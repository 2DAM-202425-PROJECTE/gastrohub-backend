import { NextFunction, Request, Response } from "express";
import DeliveryOrder from "../models/deliveryOrder";

export const getDeliveryOrders = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deliveryOrders = await DeliveryOrder.findAll({
      where: {
        id_restaurant: id,
      },
    });

    res.json(deliveryOrders);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};

export const getDeliveryOrder = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const order = await DeliveryOrder.findByPk(id);
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

export const createDeliveryOrder = async (req: Request, res: Response) => {
  const { body } = req;

  try {
    const deliveryOrders = await DeliveryOrder.create(body);
    res.json(deliveryOrders);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};

export const updateDeliveryOrder = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  const { body } = req;

  try {
    const deliveryOrders = await DeliveryOrder.findByPk(id);
    if (!deliveryOrders) {
      return res.status(404).json({
        msg: `There is no deliveryOrders with the id ${id}`,
      });
    } else {
      await deliveryOrders.update(body);

      res.json(deliveryOrders);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};

export const deleteDeliveryOrder = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;

  try {
    const deliveryOrders = await DeliveryOrder.findByPk(id);
    if (!deliveryOrders) {
      return res.status(404).json({
        msg: `There is no deliveryOrders with the id ${id}`,
      });
    } else {
      await deliveryOrders.destroy();

      res.json(deliveryOrders);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};
