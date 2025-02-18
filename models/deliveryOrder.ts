import { DataTypes } from "sequelize";
import db from "../database/connection";
import Restaurant from "./restaurant";
import Order from "./order";
import User from "./user";

const DeliveryOrder = db.define(
  "DeliveryOrder",
  {
    id_restaurant: {
      type: DataTypes.INTEGER,
      primaryKey: false,
      references: {
        model: Restaurant,
        key: "id_restaurant",
      },
    },
    id_order: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Order,
        key: "id_order",
      },
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: "id_user",
      },
    },
    id_worker: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: "id_user",
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

export default DeliveryOrder;
