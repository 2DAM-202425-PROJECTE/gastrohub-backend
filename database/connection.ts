import { Sequelize } from "sequelize";

const db = new Sequelize(
  "postgresql://postgres:icoYmQxejrRAKwGKzqPfHksEulcYNspA@gondola.proxy.rlwy.net:57733/railway",
  {
    dialect: "postgres",
    logging: false,
  }
);

export default db;
