import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../services/token_service";
import User from "../models/user";

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) {
    res.sendStatus(401);
    return;
  }

  try {
    const user = verifyToken(token);
    const userModel: any = await User.findByPk(user.id_user);
    if (!userModel) {
      res.sendStatus(402);
      return;
    }
    req.body.user = user;
    next();
  } catch (err) {
    res.sendStatus(403);
    return;
  }
};
