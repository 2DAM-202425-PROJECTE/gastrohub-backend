import e from "express";
import License from "../models/license";
import Restaurant from "../models/restaurant";
import User from "../models/user";

const setDefaultData = async () => {
  try {
    License.create({
      license_type: 1,
      details: "This is a test license",
      start_date: new Date(),
      end_date: new Date().setFullYear(new Date().getFullYear() + 1),
    })
    Restaurant.create({
      name: "Kebab La Rapita",
      address: "Carrer de la Rapita",
      distribution: {},
      capacity: 100,
      id_license: 1,
    })
    User.create({
      username: "admin",
      password: "admin",
      admin: true,
      id_restaurant: 1,
      pin: "12345",
    })
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

export default setDefaultData;