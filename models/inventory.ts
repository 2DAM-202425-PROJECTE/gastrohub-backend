import { DataTypes } from "sequelize";
import db from "../database/connection";
import Restaurant from "./restaurant";

const Inventory = db.define(
  "Inventory",
  {
    id_ingredient: {
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);


export default Inventory;
