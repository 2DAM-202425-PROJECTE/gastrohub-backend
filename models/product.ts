import { DataTypes } from "sequelize";
import db from "../database/connection";
import Restaurant from "./restaurant";

const Product = db.define(
  "Product",
  {
    id_product: {
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
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    image: {
      type: DataTypes.BLOB,
      allowNull: true,
      get() {
        const imageBuffer = this.getDataValue("image");
        return imageBuffer ? imageBuffer.toString("base64") : null;
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
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    kitchen: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    }
  },
  {
    timestamps: false,
  }
);

export default Product;
