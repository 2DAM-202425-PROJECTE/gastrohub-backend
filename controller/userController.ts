import { NextFunction, Request, Response } from "express";
import User from "../models/user";

export const getUsuarios = async (req: Request, res: Response) => {
  try {
    const usuarios = await User.findAll();

    res.json(usuarios);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hable con el administrador",
    });
  }
};

export const getUsuario = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const usuario = await User.findByPk(id);
    if (usuario) {
      res.json(usuario);
    } else {
      res.status(404).json({
        msg: `No existe un usuario con el id ${id}`,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hable con el administrador",
    });
  }
};

export const postUsuario = async (req: Request, res: Response) => {
  const { body } = req;

  try {
    const user = await User.create(body);
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hable con el administrador",
    });
  }
};

export const putUsuario = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  const { body } = req;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        msg: `No existe un usuario con el id ${id}`,
      });
    } else {
      await user.update(body);

      res.json(user);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hable con el administrador",
    });
  }
};

export const deleteUsuario = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        msg: `No existe un usuario con el id ${id}`,
      });
    } else {
      await user.destroy();

      res.json(user);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hable con el administrador",
    });
  }
};
