import { DataTypes } from "sequelize";
import db from "../database/connection";
import User from "./user";


const Schedule = db.define(
  "Schedule",
  {
    id_schedule: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id_user",
      },
    },
    start_time: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    end_time: {
        type: DataTypes.DATE,
        allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

export default Schedule;
