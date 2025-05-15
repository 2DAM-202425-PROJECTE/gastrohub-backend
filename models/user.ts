import { DataTypes } from "sequelize";
import db from "../database/connection";
import Restaurant from "./restaurant";
import UserToken from "./userTokens";

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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
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
      type: DataTypes.BLOB,
      allowNull: true,
      get() {
        const logoBuffer = this.getDataValue("image");
        return logoBuffer ? logoBuffer.toString("base64") : null;
      },
      set(value) {
        if (typeof value === "string") {
          const bufferValue = Buffer.from(value, "base64");
          this.setDataValue("image", bufferValue);
        } else {
          this.setDataValue("image", value);
        }
      },
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
    id_token: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: UserToken,
        key: "id_token",
      },
    },
  },
  {
    timestamps: false,
  }
);

export default User;
