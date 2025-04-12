import { Request, Response } from "express";
import Order from "../models/order";
import OrderProduct from "../models/orderProduct";
import { Op } from "sequelize";
import Product from "../models/product";

export const getAllActiveOrders = async (req: Request, res: Response) => {
  const { id } = req.params;
  const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);

  try {
    const unpaidOrders = await Order.findAll({
      where: {
        id_restaurant: id,
        payed: false,
      },
    });

    const recentOrders = await Order.findAll({
      where: {
        id_restaurant: id,
        date: {
          [Op.gte]: twelveHoursAgo,
        },
      },
    });

    const allOrders = [...unpaidOrders, ...recentOrders];

    const uniqueOrders = Array.from(
      new Map(allOrders.map((order: any) => [order.id_order, order])).values()
    );

    const orderProducts = await OrderProduct.findAll({
      where: {
        id_order: {
          [Op.in]: uniqueOrders.map((order: any) => order.id_order),
        },
      },
    });

    const orderProductMap = orderProducts.reduce((map: any, product: any) => {
      if (!map[product.id_order]) {
        map[product.id_order] = [];
      }
      map[product.id_order].push(product);
      return map;
    }, {});

    const productIds = orderProducts.map(
      (orderProduct: any) => orderProduct.id_product
    );
    const products = await Product.findAll({
      where: {
        id_product: {
          [Op.in]: productIds,
        },
      },
    });
    const productMap = products.reduce((map: any, product: any) => {
      map[product.id_product] = product;
      return map;
    }, {});

    res.json({
      orders: uniqueOrders,
      orderProducts: orderProductMap,
      products: productMap,
    });
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

export const updateOrder = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id } = req.params;
  const { body } = req;

  try {
    const order: any = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({
        msg: `There is no order with the id ${id}`,
      });
    } else {
      if (body.payed != order.payed) {
        if (body.payed == true) {
          const orderProducts = await OrderProduct.findAll({
            where: {
              id_order: id,
            },
          });
          orderProducts.forEach(async (orderProduct) => {
            await orderProduct.update({
              state: "Done",
            });
          });
        }
      }
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

export const deleteOrder = async (
  req: Request,
  res: Response
): Promise<any> => {
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
