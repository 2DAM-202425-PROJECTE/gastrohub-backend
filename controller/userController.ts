import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import { where } from "sequelize";

export const getUsers = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const users = await User.findAll({
      where: {
        id_restaurant: id,
      },
    });

    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};

export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({
        msg: `There is no user with the id ${id}`,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<any> => {
  const { body } = req;
  const { username, password } = body;

  try {
    const user = await User.findOne({
      where: {
        username: username,
        password: password,
      },
    });
    if (!user) {
      return res.status(400).json({
        msg: "User or password incorrect",
      });
    } else {
      res.json(user);
    }
  } catch (error) {
    console.log(body);
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};

export const createUser = async (req: Request, res: Response): Promise<any> => {
  const { body } = req;
  const { username, password } = body;

  try {
    const user = await User.findOne({
      where: {
        username,
      },
    });
    if (user) {
      return res.status(400).json({
        msg: "The user already exists",
      });
    } else {
      const newUser = await User.create(body);
      res.json(newUser);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  const { body } = req;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        msg: `There is no user with the id ${id}`,
      });
    } else {
      await user.update(body);

      res.json(user);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        msg: `There is no user with the id ${id}`,
      });
    } else {
      await user.destroy();

      res.json(user);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};

export const getUserbyUsername = async (req: Request, res: Response) => {
  const { username } = req.params;

  try {
    const users = await User.findOne({
      where: {
        username,
      },
    });
    if (users) {
      res.json(users);
    } else {
      res.status(404).json({
        msg: `There is no user with the username ${username}`,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};
