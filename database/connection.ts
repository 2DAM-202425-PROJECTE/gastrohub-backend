import { Sequelize } from "sequelize";

const db = new Sequelize("gastrohub", "postgres", "gastrohubadmin",{
    host: '127.0.0.1',
    dialect: 'postgres',
    logging: false 
});

export default db;