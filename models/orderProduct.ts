import { DataTypes } from "sequelize";
import db from "../database/connection";
import Order from "./order";
import Product from "./product";

const OrderProduct = db.define(
  "OrderProduct",
  {
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
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    details: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

export default OrderProduct;
