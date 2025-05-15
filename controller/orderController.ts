import { Request, Response } from "express";
import Order from "../models/order";
import OrderProduct from "../models/orderProduct";
import { Op } from "sequelize";
import Product from "../models/product";
import User from "../models/user";
import Inventory from "../models/inventory";
import ProductIngredient from "../models/productIngredient";
import DeliveryOrder from "../models/deliveryOrder";
import admin from "../services/firebase_service";

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

    const workers = await User.findAll({
      where: {
        id_restaurant: user!.id_restaurant,
      },
    });

    // Agrupar tokens por idioma
    const tokensByLanguage: Record<string, string[]> = {};

    workers.forEach((worker: any) => {
      if (worker.notificationToken) {
        const lang = worker.language || "EN";
        if (!tokensByLanguage[lang]) {
          tokensByLanguage[lang] = [];
        }
        tokensByLanguage[lang].push(worker.notificationToken);
      }
    });

    // Mensajes traducidos por idioma
    const messages: Record<string, { title: string; body: string }> = {
      CA: {
        title: "🛎️ Nova comanda",
        body: 'Hi ha una nova comanda al restaurant!',
      },
      ES: {
        title: "🛎️ Nuevo pedido",
        body: 'Hay un nuevo pedido en el restaurante!',
      },
      EN: {
        title: "🛎️ New order",
        body: 'There is a new order at the restaurant!',
      },
    };

    // Enviar una notificación por grupo de idioma
    for (const lang in tokensByLanguage) {
      const tokens = tokensByLanguage[lang];
      const { title, body } = messages[lang] || messages.EN; // fallback al inglés

      const message = {
        notification: {
          title,
          body,
        },
        tokens,
      };

      const response = await admin.messaging().sendEachForMulticast(message);
    }

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
      const orderProducts = await OrderProduct.findAll({
        where: {
          id_order: id,
        },
      });
      orderProducts.forEach(async (orderProduct) => {
        await orderProduct.destroy();
      });
      const deliveryOrder = await DeliveryOrder.findAll({
        where: {
          id_order: id,
        },
      });
      deliveryOrder.forEach(async (delivery) => {
        await delivery.destroy();
      });
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
    const dayCashEarnings: { [key: string]: number } = {};
    const dayCardEarnings: { [key: string]: number } = {};

    for (let i = 0; i < 24; i++) {
      const start = new Date();
      start.setHours(i, 0, 0, 0);
      const end = new Date();
      end.setHours(i + 1, 0, 0, 0);

      const orders: any = lastOrders.filter((order: any) => {
        const orderDate = new Date(order.date);
        return (
          orderDate >= start && orderDate < end && orderDate >= past24Hours
        );
      });

      let totalEarnings = 0;
      let cardEarnings = 0;
      let cashEarnings = 0;

      for (const order of orders) {
        const orderProducts: any = await OrderProduct.findAll({
          where: {
            id_order: order.id_order,
            payed: true,
          },
        });

        // Contar cantidad por id_product
        const productCounts: { [id: number]: number } = {};

        for (const op of orderProducts) {
          const id = op.id_product;
          productCounts[id] = (productCounts[id] || 0) + 1;
        }

        // Obtener productos únicos para este pedido
        const productIds = Object.keys(productCounts).map(Number);
        const products: any = await Product.findAll({
          where: {
            id_product: productIds,
          },
        });

        // Mapear precios
        const priceMap: { [id: number]: number } = {};
        for (const product of products) {
          priceMap[product.id_product] = product.price || 0;
        }

        // Calcular ganancias separadas
        for (const op of orderProducts) {
          const id = op.id_product;
          const price = priceMap[id] || 0;

          totalEarnings += price;

          if (op.payed_type === 1) {
            cashEarnings += price;
          } else if (op.payed_type === 2) {
            cardEarnings += price;
          }
        }
      }

      dayAnalytics[`${i}:00`] = orders.length;
      dayEarnings[`${i}:00`] = totalEarnings;
      dayCashEarnings[`${i}:00`] = cashEarnings;
      dayCardEarnings[`${i}:00`] = cardEarnings;
    }

    analytics["day"] = dayAnalytics;
    earnings["day"] = dayEarnings;
    earnings["dayCash"] = dayCashEarnings;
    earnings["dayCard"] = dayCardEarnings;

    // ----------------- Semana -----------------
    const weekAnalytics: { [key: string]: number } = {};
    const weekEarnings: { [key: string]: number } = {};
    const weekCashEarnings: { [key: string]: number } = {};
    const weekCardEarnings: { [key: string]: number } = {};
    for (let i = 0; i < 7; i++) {
      const start = new Date();
      start.setDate(now.getDate() - i);
      start.setHours(0, 0, 0, 0);
      const end = new Date();
      end.setDate(now.getDate() - i + 1);
      end.setHours(0, 0, 0, 0);

      const orders: any = lastOrders.filter((order: any) => {
        const orderDate = new Date(order.date);
        return orderDate >= start && orderDate < end && orderDate >= pastWeek;
      });

      const dayName = start.toLocaleString("en-US", { weekday: "short" }); // Día de la semana en abreviatura (Lun, Mar, etc.)

      let totalEarnings = 0;
      let cardEarnings = 0;
      let cashEarnings = 0;

      for (const order of orders) {
        const orderProducts: any = await OrderProduct.findAll({
          where: {
            id_order: order.id_order,
            payed: true,
          },
        });

        // Contar cantidad por id_product
        const productCounts: { [id: number]: number } = {};

        for (const op of orderProducts) {
          const id = op.id_product;
          productCounts[id] = (productCounts[id] || 0) + 1;
        }

        // Obtener productos únicos para este pedido
        const productIds = Object.keys(productCounts).map(Number);
        const products: any = await Product.findAll({
          where: {
            id_product: productIds,
          },
        });

        // Mapear precios
        const priceMap: { [id: number]: number } = {};
        for (const product of products) {
          priceMap[product.id_product] = product.price || 0;
        }

        // Calcular ganancias
        // Calcular ganancias separadas
        for (const op of orderProducts) {
          const id = op.id_product;
          const price = priceMap[id] || 0;

          totalEarnings += price;

          if (op.payed_type === 1) {
            cashEarnings += price;
          } else if (op.payed_type === 2) {
            cardEarnings += price;
          }
        }
      }
      weekAnalytics[dayName] = orders.length;
      weekEarnings[dayName] = totalEarnings;
      weekCashEarnings[dayName] = cashEarnings;
      weekCardEarnings[dayName] = cardEarnings;
    }
    analytics["week"] = weekAnalytics;
    earnings["week"] = weekEarnings;
    earnings["weekCash"] = weekCashEarnings;
    earnings["weekCard"] = weekCardEarnings;

    // ----------------- Mes -----------------
    const monthAnalytics: { [key: string]: number } = {};
    const monthEarnings: { [key: string]: number } = {};
    const monthCashEarnings: { [key: string]: number } = {};
    const monthCardEarnings: { [key: string]: number } = {};

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

      const orders: any = lastOrders.filter((order: any) => {
        const orderDate = new Date(order.date);
        return orderDate >= start && orderDate < end && orderDate >= pastMonth;
      });

      let totalEarnings = 0;
      let cardEarnings = 0;
      let cashEarnings = 0;

      for (const order of orders) {
        const orderProducts: any = await OrderProduct.findAll({
          where: {
            id_order: order.id_order,
            payed: true,
          },
        });

        // Contar cantidad por id_product
        const productCounts: { [id: number]: number } = {};

        for (const op of orderProducts) {
          const id = op.id_product;
          productCounts[id] = (productCounts[id] || 0) + 1;
        }

        // Obtener productos únicos para este pedido
        const productIds = Object.keys(productCounts).map(Number);
        const products: any = await Product.findAll({
          where: {
            id_product: productIds,
          },
        });

        // Mapear precios
        const priceMap: { [id: number]: number } = {};
        for (const product of products) {
          priceMap[product.id_product] = product.price || 0;
        }

        // Calcular ganancias separadas
        for (const op of orderProducts) {
          const id = op.id_product;
          const price = priceMap[id] || 0;

          totalEarnings += price;

          if (op.payed_type === 1) {
            cashEarnings += price;
          } else if (op.payed_type === 2) {
            cardEarnings += price;
          }
        }
      }

      monthAnalytics[`Week ${i + 1}`] = orders.length;
      monthEarnings[`Week ${i + 1}`] = totalEarnings;
      monthCashEarnings[`Week ${i + 1}`] = cashEarnings;
      monthCardEarnings[`Week ${i + 1}`] = cardEarnings;
    }

    analytics["month"] = monthAnalytics;
    earnings["month"] = monthEarnings;
    earnings["monthCash"] = monthCashEarnings;
    earnings["monthCard"] = monthCardEarnings;

    // ----------------- Año -----------------
    const yearAnalytics: { [key: string]: number } = {};
    const yearEarnings: { [key: string]: number } = {};
    const yearCashEarnings: { [key: string]: number } = {};
    const yearCardEarnings: { [key: string]: number } = {};
    for (let i = 0; i < 12; i++) {
      const start = new Date(now.getFullYear(), i, 1);
      const end = new Date(now.getFullYear(), i + 1, 1);

      const orders: any = lastOrders.filter((order: any) => {
        const orderDate = new Date(order.date);
        return orderDate >= start && orderDate < end && orderDate >= pastYear;
      });

      let totalEarnings = 0;
      let cardEarnings = 0;
      let cashEarnings = 0;

      for (const order of orders) {
        const orderProducts: any = await OrderProduct.findAll({
          where: {
            id_order: order.id_order,
            payed: true,
          },
        });

        // Contar cantidad por id_product
        const productCounts: { [id: number]: number } = {};

        for (const op of orderProducts) {
          const id = op.id_product;
          productCounts[id] = (productCounts[id] || 0) + 1;
        }

        // Obtener productos únicos para este pedido
        const productIds = Object.keys(productCounts).map(Number);
        const products: any = await Product.findAll({
          where: {
            id_product: productIds,
          },
        });

        // Mapear precios
        const priceMap: { [id: number]: number } = {};
        for (const product of products) {
          priceMap[product.id_product] = product.price || 0;
        }

        // Calcular ganancias separadas
        for (const op of orderProducts) {
          const id = op.id_product;
          const price = priceMap[id] || 0;

          totalEarnings += price;

          if (op.payed_type === 1) {
            cashEarnings += price;
          } else if (op.payed_type === 2) {
            cardEarnings += price;
          }
        }
      }

      const monthName = start.toLocaleString("en-US", { month: "short" }); // Abreviatura del mes (Ene, Feb, Mar...)
      yearAnalytics[monthName] = orders.length;
      yearEarnings[monthName] = totalEarnings;
      yearCashEarnings[monthName] = cashEarnings;
      yearCardEarnings[monthName] = cardEarnings;
    }
    analytics["year"] = yearAnalytics;
    earnings["year"] = yearEarnings;
    earnings["yearCash"] = yearCashEarnings;
    earnings["yearCard"] = yearCardEarnings;

    res.json({ orders: analytics, earnings: earnings });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};
