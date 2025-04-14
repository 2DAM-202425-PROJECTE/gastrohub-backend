import { NextFunction, Request, Response } from "express";
import ProductIngredient from "../models/productIngredient";

export const getProductIngredients = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { user } = req.body;
  const { id_user } = user;

  try {
    const ingredients = await ProductIngredient.findAll({
      where: {
        id_product: id,
      },
    });

    res.json(ingredients);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};

export const createProductIngredient = async (req: Request, res: Response) => {
  const { body } = req;
  const { user } = req.body;
  const { id_user } = user;

  try {
    const product = await ProductIngredient.create(body);
    res.json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};
