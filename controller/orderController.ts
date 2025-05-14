import { Request, Response } from "express";
import Order from "../models/order";
import OrderProduct from "../models/orderProduct";
import { Op } from "sequelize";
import Product from "../models/product";
import User from "../models/user";
import Inventory from "../models/inventory";
import ProductIngredient from "../models/productIngredient";

export const getAllActiveOrders = async (req: Request, res: Response) => {
  const { user } = req.body;
  const { id_user } = user;
  const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);

  try {
    const user: any = await User.findByPk(id_user);

    const unpaidOrders = await Order.findAll({
      where: {
        id_restaurant: user!.id_restaurant,
      },
    });

    const recentOrders = await Order.findAll({
      where: {
        id_restaurant: user!.id_restaurant,
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

export const createOrder = async (req: Request, res: Response) => {
  const { body } = req;
  const { user } = req.body;
  const { id_user } = user;

  try {
    const user: any = await User.findByPk(id_user);
    body.id_restaurant = user!.id_restaurant;
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
  const { user } = req.body;
  const { id_user } = user;

  try {
    const order: any = await Order.findByPk(id);
    if (!order) {
      return res.sendStatus(404);
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
              state: 1,
            });
          });

          orderProducts.forEach(async (orderProduct: any) => {
            const product: any = await Product.findByPk(
              orderProduct.id_product
            );
            const productIngredients = await ProductIngredient.findAll({
              where: {
                id_product: product!.id_product,
              },
            });
            productIngredients.forEach(async (productIngredient: any) => {
              const ingredient: any = await Inventory.findByPk(
                productIngredient.id_ingredient
              );
              await ingredient.update({
                quantity: ingredient.quantity - orderProduct.quantity,
              });
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
  const { user } = req.body;
  const { id_user } = user;

  try {
    const order = await Order.findByPk(id);
    if (!order) {
      return res.sendStatus(404);
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
export const getAnalytics = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { user } = req.body;
  const { id_user } = user;

  try {
    const user: any = await User.findByPk(id_user);
    const now = new Date();

    // Calculamos las fechas para las 4 vistas: Día, Semana, Mes, Año
    const past24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const pastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const pastMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const pastYear = new Date(
      now.getFullYear() - 1,
      now.getMonth(),
      now.getDate()
    );

    // Consultamos las órdenes dentro de los últimos 12 meses
    const lastOrders = await Order.findAll({
      where: {
        id_restaurant: user!.id_restaurant,
        date: {
          [Op.gte]: pastYear, // Solo las órdenes de hace un año o menos
        },
      },
    });

    // Inicializamos los objetos para almacenar las estadísticas
    const analytics: { [key: string]: any } = {};
    const earnings: { [key: string]: any } = {};

    // ----------------- Día -----------------
    const dayAnalytics: { [key: string]: number } = {};
    const dayEarnings: { [key: string]: number } = {};
    for (let i = 0; i < 24; i++) {
      const start = new Date();
      start.setHours(i, 0, 0, 0);
      const end = new Date();
      end.setHours(i + 1, 0, 0, 0);

      const orders = lastOrders.filter((order: any) => {
        const orderDate = new Date(order.date);
        return (
          orderDate >= start && orderDate < end && orderDate >= past24Hours
        );
      });

      dayAnalytics[`${i}:00`] = orders.length;
    }
    analytics["day"] = dayAnalytics;

    // ----------------- Semana -----------------
    const weekAnalytics: { [key: string]: number } = {};
    for (let i = 0; i < 7; i++) {
      const start = new Date();
      start.setDate(now.getDate() - i);
      start.setHours(0, 0, 0, 0);
      const end = new Date();
      end.setDate(now.getDate() - i + 1);
      end.setHours(0, 0, 0, 0);

      const count = lastOrders.filter((order: any) => {
        const orderDate = new Date(order.date);
        return orderDate >= start && orderDate < end && orderDate >= pastWeek;
      }).length;

      const dayName = start.toLocaleString("en-US", { weekday: "short" }); // Día de la semana en abreviatura (Lun, Mar, etc.)
      weekAnalytics[dayName] = count;
    }
    analytics["week"] = weekAnalytics;

    // ----------------- Mes -----------------
    const monthAnalytics: { [key: string]: number } = {};

    // Obtenemos cuántos días tiene el mes actual
    const totalDaysInMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0
    ).getDate();
    const weeksInMonth = Math.ceil(totalDaysInMonth / 7);

    for (let i = 0; i < weeksInMonth; i++) {
      const start = new Date(now.getFullYear(), now.getMonth(), i * 7 + 1);
      const end = new Date(
        now.getFullYear(),
        now.getMonth(),
        Math.min((i + 1) * 7 + 1, totalDaysInMonth + 1)
      );

      const count = lastOrders.filter((order: any) => {
        const orderDate = new Date(order.date);
        return orderDate >= start && orderDate < end && orderDate >= pastMonth;
      }).length;

      monthAnalytics[`Week ${i + 1}`] = count;
    }

    analytics["month"] = monthAnalytics;

    // ----------------- Año -----------------
    const yearAnalytics: { [key: string]: number } = {};
    for (let i = 0; i < 12; i++) {
      const start = new Date(now.getFullYear(), i, 1);
      const end = new Date(now.getFullYear(), i + 1, 1);

      const count = lastOrders.filter((order: any) => {
        const orderDate = new Date(order.date);
        return orderDate >= start && orderDate < end && orderDate >= pastYear;
      }).length;

      const monthName = start.toLocaleString("en-US", { month: "short" }); // Abreviatura del mes (Ene, Feb, Mar...)
      yearAnalytics[monthName] = count;
    }
    analytics["year"] = yearAnalytics;

    res.json({ orders: analytics });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};
