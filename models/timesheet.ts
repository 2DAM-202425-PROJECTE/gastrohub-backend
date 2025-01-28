import { DataTypes } from "sequelize";
import db from "../database/connection";
import User from "./user";

const Timesheet = db.define(
  "Timesheet",
  {
    id_timesheet: {
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
    location: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);



export default Timesheet;
