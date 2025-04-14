import { NextFunction, Request, Response } from "express";
import DeliveryOrder from "../models/deliveryOrder";
import User from "../models/user";

export const getDeliveryOrders = async (req: Request, res: Response) => {
  const { user } = req.body;
  const { id_user } = user;

  try {
    const user: any = await User.findByPk(id_user);
    const deliveryOrders = await DeliveryOrder.findAll({
      where: {
        id_restaurant: user.id_restaurant,
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

export const createDeliveryOrder = async (req: Request, res: Response) => {
  const { body } = req;
  const { user } = req.body;
  const { id_user } = user;

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

export const updateDeliveryOrder = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id } = req.params;
  const { body } = req;
  const { user } = req.body;
  const { id_user } = user;

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

export const deleteDeliveryOrder = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id } = req.params;
  const { user } = req.body;
  const { id_user } = user;

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
