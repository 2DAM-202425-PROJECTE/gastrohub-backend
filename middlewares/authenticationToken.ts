import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../services/token_service";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) {
    res.status(401).json({ msg: "Token no proporcionado" });
    return;
  }

  try {
    const user = verifyToken(token);
    req.body.user = user;
    next();
  } catch (err) {
    res.status(403).json({ msg: "Token inválido o expirado" });
    return;
  }
};
