import { DataTypes } from "sequelize";
import db from "../database/connection";
import Restaurant from "./restaurant";

const ProductIngredient = db.define(
  "ProductIngredient",
  {
    id_ingredient: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Restaurant,
        key: "id_restaurant",
      },
    },
    id_product: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Restaurant,
        key: "id_restaurant",
      },
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

export default ProductIngredient;
