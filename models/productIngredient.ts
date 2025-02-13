import { DataTypes } from "sequelize";
import db from "../database/connection";
import Restaurant from "./restaurant";
import Inventory from "./inventory";
import Product from "./product";

const ProductIngredient = db.define(
  "ProductIngredient",
  {
    id_ingredient: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Inventory,
        key: "id_ingredient",
      },
    },
    id_product: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Product,
        key: "id_product",
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
