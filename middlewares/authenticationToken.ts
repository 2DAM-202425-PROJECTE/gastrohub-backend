import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../services/token_service";
import User from "../models/user";
import UserToken from "../models/userTokens";

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

    const userToken: any = await UserToken.findByPk(userModel.id_token);

    if (!userModel || !userModel.id_token) {
      res.sendStatus(403);
      return;
    }


    // Verifica que el token actual coincida y sea válido
    if (!userToken || !userToken.is_valid || userToken.token !== token) {
      res.sendStatus(403); // Token inválido o no autorizado
      return;
    }

    req.body.user = user;
    next();
  } catch (err) {
    res.sendStatus(403);
    return;
  }
};
