import { Sequelize } from "sequelize";

const db = new Sequelize("gastrohub", "postgres", "gastrohubadmin",{
    host: 'localhost',
    dialect: 'postgres',
    logging: false
});

export default db;