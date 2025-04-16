import e from "express";
import License from "../models/license";
import Restaurant from "../models/restaurant";
import User from "../models/user";
import Inventory from "../models/inventory";
import Product from "../models/product";
import ProductIngredient from "../models/productIngredient";
import Order from "../models/order";
import OrderProduct from "../models/orderProduct";
import Booking from "../models/booking";
import DeliveryOrder from "../models/deliveryOrder";
import bcrypt from 'bcryptjs';

const setDefaultData = async () => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('admin', salt);
  try {
    License.create({
      license_type: 2,
      details: "This is a test license",
      start_date: new Date().setFullYear(new Date().getFullYear() - 2),
      end_date: new Date().setFullYear(new Date().getFullYear() + 1),
    }).then((license) => {
      Restaurant.create({
        name: "Kebab La Rapita",
        address: "Carrer de la Rapita",
        capacity: 100,
        id_license: 1,
      }).then((restaurant) => {
        User.create({
          username: "admin",
          password: hashedPassword,
          admin: true,
          id_restaurant: 1,
          pin: "12345",
          name: "Admin",
          email: "test@gmail.com",
        });
        User.create({
          username: "regular",
          password: hashedPassword,
          admin: false,
          id_restaurant: 1,
          pin: "12345",
          name: "Regular",
          email: "test@gmail.com",
        });
        User.create({
          username: "pepe",
          password: hashedPassword,
          admin: false,
          id_restaurant: null,
          name: "pepe",
          email: "pepe@gmail.com",
        });
        Inventory.create({
          id_restaurant: 1,
          name: "Tomato",
          category: "Vegetables",
          quantity: 10,
          gluten: false,
          lactose: false,
        });
        Inventory.create({
          id_restaurant: 1,
          name: "Chese",
          category: "Fridge",
          quantity: 10,
          gluten: false,
          lactose: true,
        });
        Product.create({
          id_restaurant: 1,
          name: "Kebab",
          price: 5,
          category: "Main",
          image: null,
          description: "This is a kebab",
          kitchen: true,
        }).then((product) => {
          ProductIngredient.create({
            id_product: 1,
            id_ingredient: 1,
            quantity: 1,
          });
          ProductIngredient.create({
            id_product: 1,
            id_ingredient: 2,
            quantity: 1,
          });
          Order.create({
            id_restaurant: 1,
            id_user: 1,
            table: "1",
            date: new Date(),
            payed: false,
          }).then((order) => {
            OrderProduct.create({
              id_order: 1,
              id_product: 1,
              quantity: 1,
              state: 1,
            });
          });
          Order.create({
            id_restaurant: 1,
            id_user: 1,
            table: "1",
            date: new Date(),
            payed: true,
          }).then((order) => {
            OrderProduct.create({
              id_order: 2,
              id_product: 1,
              quantity: 5,
              state: 1,
            });
          });
        });

        Booking.create({
          id_restaurant: 1,
          id_user: 1,
          date: new Date(),
          name: "PEpe",
          time: "13:00",
          quantity: 2,
        });
      });
    });
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

export default setDefaultData;
