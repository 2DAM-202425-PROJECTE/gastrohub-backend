import { NextFunction, Request, Response } from "express";
import Product from "../models/product";

export const getProducts = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const products = await Product.findAll({
      where: {
        id_restaurant: id,
      },
    });

    res.json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  const { body } = req;

  try {
    const product = await Product.create(body);
    res.json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  const { body } = req;

  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        msg: `There is no product with the id ${id}`,
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

export const deleteProduct = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        msg: `There is no product with the id ${id}`,
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
