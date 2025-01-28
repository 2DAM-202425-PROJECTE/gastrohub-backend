import { NextFunction, Request, Response } from "express";
import Booking from "../models/booking";

export const getBookings = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const bookings = await Booking.findAll({
      where: {
        id_restaurant: id,
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

export const updateBooking = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  const { body } = req;

  try {
    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({
        msg: `There is no booking with the id ${id}`,
      });
    } else {
      await booking.update(body);

      res.json(booking);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};

export const deleteBooking = async (req: Request, res: Response): Promise<any> => {
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
