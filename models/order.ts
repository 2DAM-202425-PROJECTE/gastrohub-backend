import { DataTypes } from "sequelize";
import db from "../database/connection";
import Product from "./product";
import Restaurant from "./restaurant";

const Order = db.define(
  "Order",
  {
    id_order: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_restaurant: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Restaurant,
        key: "id_restaurant",
      },
    },
    table: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

export default Order;
