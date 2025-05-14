import { DataTypes } from "sequelize";
import db from "../database/connection";
import Order from "./order";
import Product from "./product";

const OrderProduct = db.define(
  "OrderProduct",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Order,
        key: "id_order",
      },
    },
    id_product: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Product,
        key: "id_product",
      },
    },
    details: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    payed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    payed_type:{
      type: DataTypes.INTEGER, // 0, nothing; 1, cash; 2, card
      allowNull: false,
    }
  },
  {
    timestamps: false,
  }
);

export default OrderProduct;
