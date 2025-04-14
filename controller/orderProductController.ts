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
  const { id_order, id_product } = req.params;
  const { body } = req;
  const { user } = req.body;
  const { id_user } = user;

  try {
    const product = await OrderProduct.findOne({
      where: {
        id_order: id_order,
        id_product: id_product,
      },
    });
    if (!product) {
      return res.status(404).json({
        msg: `There is no user with the id ${id_order} and product ${id_product}`,
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

export const deleteOrderProduct = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id_order, id_product } = req.params;
  const { user } = req.body;
  const { id_user } = user;

  try {
    const product = await OrderProduct.findOne({
      where: {
        id_order: id_order,
        id_product: id_product,
      },
    });
    if (!product) {
      return res.status(404).json({
        msg: `There is no product with the id ${id_product} in order ${id_order}`,
      });
    } else {
      await product.destroy();

      const order = await OrderProduct.findAll({
        where: {
          id_order: id_order,
        },
      });
      if (order.length == 0) {
        await Order.destroy({
          where: {
            id_order: id_order,
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
