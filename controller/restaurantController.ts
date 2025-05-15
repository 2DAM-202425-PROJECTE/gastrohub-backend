import { NextFunction, Request, Response } from "express";
import Restaurant from "../models/restaurant";
import User from "../models/user";
import License from "../models/license";
import Product from "../models/product";
import ProductIngredient from "../models/productIngredient";
import Inventory from "../models/inventory";
import Stripe from "stripe";

const stripe = new Stripe(
  "sk_test_51RP6ws4NmBYejv2sfGfN4d1bLRLNBb7dHKGcv3k7VhFKXqfpM1SzaZCRBPKgNeDlVPw2uOjM3a0mm3FnkwgUt5XR00I8YgTIpa"
);

export const getRestaurant = async (req: Request, res: Response) => {
  const { user } = req.body;
  const { id_user } = user;

  try {
    const user: any = await User.findByPk(id_user);
    const restaurant = await Restaurant.findByPk(user.id_restaurant);
    if (restaurant) {
      res.json(restaurant);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};

export const createRestaurant = async (req: Request, res: Response) => {
  const { restaurant, license, id_user, paymentIntentId } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      res.sendStatus(419);
      return;
    }
    const newLicense: any = await License.create(license);
    restaurant.id_license = newLicense.id_license;
    const newRestaurant: any = await Restaurant.create(restaurant);
    const user: any = await User.findByPk(id_user);
    if (user) {
      if (user.id_restaurant != null) {
        res.sendStatus(417);
      } else {
        await user.update({
          id_restaurant: newRestaurant.id_restaurant,
          admin: true,
          tag: "",
          pin: "00000",
        });
      }
    } else {
      res.sendStatus(404);
    }

    res.json({ done: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};

export const updateRestaurant = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { body } = req;
  const { user } = req.body;
  const { id_user } = user;

  try {
    const user: any = await User.findByPk(id_user);

    const restaurant = await Restaurant.findByPk(user.id_restaurant);
    if (!restaurant) {
      res.sendStatus(404);
    } else {
      await restaurant.update(body);

      res.json(restaurant);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};

export const getWebMenu = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;

  try {
    const restaurant: any = await Restaurant.findByPk(id);
    if (!restaurant) {
      res.sendStatus(404);
      return;
    }
    const license: any = await License.findByPk(restaurant.id_license);
    if (!license) {
      res.sendStatus(404);
      return;
    }
    const currentDate = new Date();
    const expirationDate = new Date(license.end_date);
    if (currentDate > expirationDate) {
      res.sendStatus(404);
      return;
    }
    if (license.license_type != 2) {
      res.sendStatus(404);
      return;
    }

    const restaurantData = {
      id_restaurant: restaurant.id_restaurant,
      name: restaurant.name,
      address: restaurant.address,
      logo: restaurant.logo,
      phone: restaurant.phone,
      banner: restaurant.banner,
    };

    const products = await Product.findAll({
      where: {
        id_restaurant: restaurant.id_restaurant,
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

    res.json({ products, productIngredientMap, ingredientMap, restaurantData });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};
