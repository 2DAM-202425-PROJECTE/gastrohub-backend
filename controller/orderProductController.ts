import { NextFunction, Request, Response } from "express";
import OrderProduct from "../models/orderProduct";
import Order from "../models/order";

export const createOrderProduct = async (req: Request, res: Response) => {
  const { body } = req;
  const { user } = req.body;
  const { id_user } = user;

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

export const updateOrderProduct = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id } = req.params;
  const { body } = req;
  const { user } = req.body;
  const { id_user } = user;

  try {
    const product = await OrderProduct.findOne({
      where: {
        id: id,
      },
    });
    if (!product) {
      return res.sendStatus(404);
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

export const deleteOrderProduct = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id } = req.params;
  const { user } = req.body;
  const { id_user } = user;

  try {
    const product: any = await OrderProduct.findOne({
      where: {
        id: id,
      },
    });
    if (!product) {
      return res.sendStatus(404);
    } else {
      await product.destroy();

      const order = await OrderProduct.findAll({
        where: {
          id_order: product.id_order,
        },
      });
      if (order.length == 0) {
        await Order.destroy({
          where: {
            id_order: product.id_order,
          },
        });
      }

      res.json(product);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};

export const setPayedByList = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { body } = req;
  const { user, list_ids, mode, bool } = req.body;
  const { id_user } = user;

  try {
    const orderProducts = await OrderProduct.findAll({
      where: {
        id: list_ids,
      },
    });
    if (orderProducts.length == 0) {
      return res.sendStatus(404);
    } else {
      await Promise.all(
        orderProducts.map(async (orderProduct: any) => {
          await orderProduct.update({
            payed: bool,
            payed_type: mode,
          });
        })
      );
    }
    return res.json({
      done: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};
