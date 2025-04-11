import { NextFunction, Request, Response } from "express";
import Product from "../models/product";
import ProductIngredient from "../models/productIngredient";

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

export const getOneProduct = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        msg: `There is no product with the id ${id}`,
      });
    } else {
      res.json(product);
    }
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

export const updateProduct = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id } = req.params;
  const { product, ingredients } = req.body;

  try {
    const existingProduct = await Product.findByPk(id);
    if (!existingProduct) {
      return res.status(404).json({
        msg: `There is no product with the id ${id}`,
      });
    }

    await existingProduct.update(product);

    if (ingredients) {
      for (const [id_ingredient, quantity] of Object.entries(ingredients)) {
        const existingProductIngredient = await ProductIngredient.findOne({
          where: {
            id_product: id,
            id_ingredient: id_ingredient,
          },
        });

        if (existingProductIngredient) {
          if (quantity === 0) {
            await existingProductIngredient.destroy();
          } else {
            await existingProductIngredient.update({
              quantity: quantity,
            });
          }
        } else {
          await ProductIngredient.create({
            id_product: id,
            id_ingredient: id_ingredient,
            quantity: quantity,
          });
        }
      }
    }

    res.json(existingProduct);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        msg: `There is no product with the id ${id}`,
      });
    }

    await ProductIngredient.destroy({
      where: { id_product: id },
    });

    await product.destroy();

    res.json(product);
  } catch (error: any) {
    console.error(error);

    if (
      error.name === "SequelizeForeignKeyConstraintError" &&
      error.original?.constraint === "OrderProducts_id_product_fkey"
    ) {
      return res.status(400).json({
        msg: "No se puede eliminar el producto porque hay pedidos que lo incluyen.",
      });
    }

    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};
