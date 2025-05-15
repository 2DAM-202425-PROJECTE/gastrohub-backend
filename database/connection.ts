import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.DB_URL) {
  throw new Error("DB_URL environment variable is not defined.");
}

const db = new Sequelize(process.env.DB_URL, {
  dialect: "postgres",
  logging: false,
});

export default db;
