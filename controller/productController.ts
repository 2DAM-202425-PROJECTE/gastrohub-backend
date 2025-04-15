import { NextFunction, Request, Response } from "express";
import Product from "../models/product";
import ProductIngredient from "../models/productIngredient";
import Inventory from "../models/inventory";
import User from "../models/user";

export const getProducts = async (req: Request, res: Response) => {
  const { user } = req.body;
  const { id_user } = user;

  try {
    const user: any = await User.findByPk(id_user);
    const products = await Product.findAll({
      where: {
        id_restaurant: user!.id_restaurant,
      },
    });
    const productIngredient = await ProductIngredient.findAll({
      where: {
        id_product: products.map((product: any) => product.id_product),
      },
    });

    const productIngredientMap = productIngredient.reduce(
      (map: any, ingredient: any) => {
        if (!map[ingredient.id_product]) {
          map[ingredient.id_product] = [];
        }
        map[ingredient.id_product].push({
          id_ingredient: ingredient.id_ingredient,
          quantity: ingredient.quantity,
        });
        return map;
      },
      {}
    );

    const ingredients = await Inventory.findAll({
      where: {
        id_ingredient: productIngredient.map(
          (ingredient: any) => ingredient.id_ingredient
        ),
      },
    });
    const ingredientMap = ingredients.reduce((map: any, ingredient: any) => {
      map[ingredient.id_ingredient] = ingredient;
      return map;
    }, {});

    res.json({ products, productIngredientMap, ingredientMap });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  const { body } = req;
  const { user } = req.body;
  const { id_user } = user;

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
  const { user } = req.body;
  const { id_user } = user;

  try {
    const existingProduct = await Product.findByPk(id);
    if (!existingProduct) {
      res.sendStatus(404);
      return;
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
  const { user } = req.body;
  const { id_user } = user;

  try {
    const product = await Product.findByPk(id);
    if (!product) {
      res.sendStatus(404);
      return;
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
