import { NextFunction, Request, Response } from "express";
import Booking from "../models/booking";
import User from "../models/user";
import Restaurant from "../models/restaurant";

export const getBookings = async (req: Request, res: Response) => {
  const { user } = req.body;
  const { id_user } = user;

  try {
    const user: any = await User.findByPk(id_user);
    const bookings = await Booking.findAll({
      where: {
        id_restaurant: user!.id_restaurant,
      },
    });

    res.json(bookings);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};

export const createBooking = async (req: Request, res: Response) => {
  const { body } = req;

  try {
    const booking = await Booking.create(body);
    res.json(booking);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};

export const deleteBooking = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id } = req.params;

  try {
    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({
        msg: `There is no booking with the id ${id}`,
      });
    } else {
      await booking.destroy();

      res.json(booking);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};
