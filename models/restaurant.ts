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
      type: DataTypes.BLOB,
      allowNull: true,
      get() {
        const logoBuffer = this.getDataValue("logo");
        return logoBuffer ? logoBuffer.toString("base64") : null;
      },
      set(value) {
        if (typeof value === "string") {
          const bufferValue = Buffer.from(value, "base64");
          this.setDataValue("logo", bufferValue);
        } else {
          this.setDataValue("logo", value);
        }
      },
    },
    distribution: {
      type: DataTypes.JSON,
      allowNull: true,
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
    phone: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    banner: {
      type: DataTypes.BLOB,
      allowNull: true,
      get() {
        const bannerBuffer = this.getDataValue("banner");
        return bannerBuffer ? bannerBuffer.toString("base64") : null;
      },
      set(value) {
        if (typeof value === "string") {
          const bufferValue = Buffer.from(value, "base64");
          this.setDataValue("banner", bufferValue);
        } else {
          this.setDataValue("banner", value);
        }
      },
    },
  },
  {
    timestamps: false,
  }
);

export default Restaurant;
