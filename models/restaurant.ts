import { DataTypes } from "sequelize";
import db from "../database/connection";
import License from "./license";


const Restaurant = db.define(
  "Restaurant",
  {
    id_restaurant: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    logo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    distribution: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_license: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: License,
        key: "id_license",
      },
    },
  },
  {
    timestamps: false,
  }
);

export default Restaurant;
