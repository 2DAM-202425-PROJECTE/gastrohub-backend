import { NextFunction, Request, Response } from "express";
import Timesheet from "../models/timesheet";
import Restaurant from "../models/restaurant";
import User from "../models/user";

export const getTimesheets = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { user } = req.body;
  const { id_user } = user;

  try {
    const timesheets = await Timesheet.findAll({
      where: {
        id_user: id,
      },
    });

    res.json(timesheets);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};

export const createTimesheet = async (req: Request, res: Response) => {
  const { user, latitude, longitude } = req.body;
  const { id_user } = user;

  try {
    const userDb: any = await User.findByPk(id_user);
    const restaurant: any = await Restaurant.findByPk(userDb.id_restaurant);
    // Extraemos las coords del string "lat,lng"
    const restoCoords = getRestaurantCoords(restaurant.address);
    if (!restoCoords) {
      res.sendStatus(500);
      return;
    }
    // Distancia en metros
    const distance = getDistanceFromLatLonInMeters(
      latitude,
      longitude,
      restoCoords.lat,
      restoCoords.lng
    );

    // 100 m = umbral
    if (distance > 100) {
      res.sendStatus(421);
      return;
    }

    const timesheet = await Timesheet.create(req.body);
    res.json(timesheet);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};

export const updateTimesheet = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id } = req.params;
  const { user, latitude, longitude } = req.body; // lat & lng del cliente
  const { id_user } = user;

  try {
    const timesheet = await Timesheet.findByPk(id);
    const userDb: any = await User.findByPk(id_user);
    const restaurant: any = await Restaurant.findByPk(userDb.id_restaurant);

    if (!timesheet || !restaurant) {
      res.sendStatus(404);
      return;
    }

    // Extraemos las coords del string "lat,lng"
    const restoCoords = getRestaurantCoords(restaurant.address);
    if (!restoCoords) {
      res.sendStatus(500);
      return;
    }

    // Distancia en metros
    const distance = getDistanceFromLatLonInMeters(
      latitude,
      longitude,
      restoCoords.lat,
      restoCoords.lng
    );

    // 100 m = umbral
    if (distance > 100) {
      res.sendStatus(421);
      return;
    }

    // Todo OK → actualiza y responde
    await timesheet.update(req.body);
    res.json(timesheet);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};

export const getActiveTimesheet = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { user } = req.body;
  const { id_user } = user;

  try {
    const timesheet = await Timesheet.findOne({
      where: {
        id_user: id,
        end_date: null,
      },
    });

    if (timesheet) {
      res.json(timesheet);
    } else {
      res.json({
        no_found: "No active timesheet found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};

function getDistanceFromLatLonInMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // radio Tierra en m
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function getRestaurantCoords(
  address: string
): { lat: number; lng: number } | null {
  if (!address) return null;

  const [latStr, lngStr] = address.split(",").map((s) => s.trim());

  const lat = parseFloat(latStr);
  const lng = parseFloat(lngStr);

  if (isNaN(lat) || isNaN(lng)) return null;

  return { lat, lng };
}
