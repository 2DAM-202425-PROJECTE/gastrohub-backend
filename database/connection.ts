import { Sequelize } from "sequelize";

const db = new Sequelize(process.env.DB_NAME || "", process.env.DB_USER || "", process.env.DB_PASSWORD || "",{
    host: 'localhost',
    dialect: 'postgres',
    logging: false
});

export default db;