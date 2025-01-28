import { NextFunction, Request, Response } from "express";
import ProductIngredient from "../models/productIngredient";

export const getProductIngredients = async (req: Request, res: Response) => {
  const { id } = req.params;

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

export const updateProductIngredient = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  const { body } = req;

  try {
    const product = await ProductIngredient.findByPk(id);
    if (!product) {
      return res.status(404).json({
        msg: `There is no ProductIngredient with the id ${id}`,
      });
    } else {
      await product.update(body);

      res.json(product);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};

export const deleteProductIngredient = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;

  try {
    const product = await ProductIngredient.findByPk(id);
    if (!product) {
      return res.status(404).json({
        msg: `There is no ProductIngredient with the id ${id}`,
      });
    } else {
      await product.destroy();

      res.json(product);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};
