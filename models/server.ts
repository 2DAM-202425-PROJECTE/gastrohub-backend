import express, { Application } from "express";
import cors from "cors";
import userRoutes from "../routes/userRoutes";
import db from "../database/connection";
import User from "./user";

class Server {
  private app: Application;
  private port: string;
  private apiPaths = {
    users: "/api/users",
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

      // Sincronizar tablas
      await db.sync({ force: false });
      console.log("Base de datos conectada y tablas sincronizadas");

      // Insertar valores por defecto
      await User.create({ name: "Juan", email: "aa", estado: true });
      await User.create({ name: "Juan3", email: "aa", estado: true });
    } catch (error: any) {
      console.log(error);
      throw new Error(error);
    }
  }

  middlewares() {
    //CORS
    this.app.use(cors());

    //Lectura del body
    this.app.use(express.json());
  }

  routes() {
    this.app.use(this.apiPaths.users, userRoutes);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server running  on port ${this.port}`);
    });
  }
}

export default Server;
