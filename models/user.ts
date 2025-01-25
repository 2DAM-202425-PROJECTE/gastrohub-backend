import { DataTypes } from "sequelize";
import db from "../database/connection";

const User = db.define(
  "User",
  {
    name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    estado: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    timestamps: false,
    
  }
);

export default User;
