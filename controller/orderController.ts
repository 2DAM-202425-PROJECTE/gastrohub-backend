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
export const getAnalytics = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id } = req.params;

  try {
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
        id_restaurant: id,
        date: {
          [Op.gte]: pastYear, // Solo las órdenes de hace un año o menos
        },
      },
    });

    // Inicializamos los objetos para almacenar las estadísticas
    const analytics: { [key: string]: any } = {};

    // ----------------- Día -----------------
    const dayAnalytics: { [key: string]: number } = {};
    for (let i = 0; i < 24; i++) {
      const start = new Date();
      start.setHours(i, 0, 0, 0);
      const end = new Date();
      end.setHours(i + 1, 0, 0, 0);

      const count = lastOrders.filter((order: any) => {
        const orderDate = new Date(order.date);
        return (
          orderDate >= start && orderDate < end && orderDate >= past24Hours
        );
      }).length;

      dayAnalytics[`${i}:00`] = count;
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

    res.json(analytics);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};
