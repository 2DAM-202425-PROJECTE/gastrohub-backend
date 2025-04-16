import express, { Application } from "express";
import cors from "cors";
import licenseRoutes from "../routes/licenseRoutes";
import restaurantRoutes from "../routes/restaurantRoutes";
import userRoutes from "../routes/userRoutes";
import timesheetRoutes from "../routes/timesheetRoutes";
import scheduleRoutes from "../routes/scheduleRoutes";
import bookingRoutes from "../routes/bookingRoutes";
import inventoryRoutes from "../routes/inventoryRoutes";
import productRoutes from "../routes/productRoutes";
import productIngredientRoutes from "../routes/productIngredientRoutes";
import orderRoutes from "../routes/orderRoutes";
import deliveryOrdersRoutes from "../routes/deliveryOrderRoutes";
import orderProductRoutes from "../routes/orderProductRoutes";
import setDefaultData from "../database/defaultData";

import db from "../database/connection";
import { decrypt, encrypt } from "../services/encrypt_service";
import { decryptRequestMiddleware, encryptResponseMiddleware } from "../middlewares/encryptMiddleware";

class Server {
  private app: Application;
  private port: string;
  private apiPaths = {
    license: "/api/license",
    restaurant: "/api/restaurant",
    user: "/api/user",
    timesheet: "/api/timesheet",
    schedule: "/api/schedule",
    booking: "/api/booking",
    inventory: "/api/inventory",
    product: "/api/product",
    productIngredient: "/api/productIngredient",
    order: "/api/order",
    deliveryOrders: "/api/deliveryOrders",
    orderProductRoutes: "/api/orderProduct",
  };

  constructor() {
    this.app = express();
    this.port = process.env.PORT || "8000";

    this.dbConnection();
    this.middlewares();

    this.routes();
  }

  async dbConnection() {
    try {
      await db.authenticate();
      console.log("Database online");
      await db.sync({ force: true });
      console.log("Base de datos conectada y tablas sincronizadas");
      await setDefaultData();
      console.log("Datos por defecto cargados");
    } catch (error: any) {
      console.log(error);
      throw new Error(error);
    }
  }

  middlewares() {
    this.app.use(cors());

    this.app.use(express.json({ limit: "50mb" }));

    this.app.use(encryptResponseMiddleware);
    this.app.use(decryptRequestMiddleware);
  }

  routes() {
    this.app.use(this.apiPaths.license, licenseRoutes);
    this.app.use(this.apiPaths.restaurant, restaurantRoutes);
    this.app.use(this.apiPaths.user, userRoutes);
    this.app.use(this.apiPaths.timesheet, timesheetRoutes);
    this.app.use(this.apiPaths.schedule, scheduleRoutes);
    this.app.use(this.apiPaths.booking, bookingRoutes);
    this.app.use(this.apiPaths.inventory, inventoryRoutes);
    this.app.use(this.apiPaths.product, productRoutes);
    this.app.use(this.apiPaths.productIngredient, productIngredientRoutes);
    this.app.use(this.apiPaths.order, orderRoutes);
    this.app.use(this.apiPaths.deliveryOrders, deliveryOrdersRoutes);
    this.app.use(this.apiPaths.orderProductRoutes, orderProductRoutes);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server running  on port ${this.port}`);
    });
  }
}

export default Server;
