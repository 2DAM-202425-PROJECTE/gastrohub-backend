import { DataTypes } from "sequelize";
import db from "../database/connection";
import Restaurant from "./restaurant";


const User = db.define(
  "User",
  {
    id_user: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_restaurant: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Restaurant,
        key: "id_restaurant",
      },
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    admin: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pin: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    tag: {
      type: DataTypes.STRING,
      allowNull: true,
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



export default User;
