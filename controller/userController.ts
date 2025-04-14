import { Request, Response } from "express";
import User from "../models/user";
import { generateToken } from "../services/token_service";

export const getUsers = async (req: Request, res: Response) => {
  const { user } = req.body;
  const { id_user } = user;

  try {
    const user: any = await User.findByPk(id_user);
    const users = await User.findAll({
      where: {
        id_restaurant: user!.id_restaurant,
      },
    });

    const toSend = users.map((user: any) => {
      return {
        id_user: user.id_user,
        username: user.username,
        email: user.email,
        admin: user.admin,
        image: user.image,
        tag: user.tag,
        name: user.name,
        id_restaurant: user.id_restaurant,
      };
    });

    res.json(toSend);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};

export const getUser = async (req: Request, res: Response) => {
  const { user } = req.body;
  const { id_user, username } = user;

  try {
    const user: any = await User.findByPk(id_user);
    if (user) {
      const toSend = {
        id_user: user.id_user,
        username: user.username,
        email: user.email,
        admin: user.admin,
        image: user.image,
        tag: user.tag,
        name: user.name,
        id_restaurant: user.id_restaurant,
      };
      res.json(toSend);
    } else {
      res.status(404).json({
        msg: `There is no user with the id ${id_user}`,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};

export const pinCheck = async (req: Request, res: Response) => {
  const { user, pin } = req.body;
  const { id_user, username } = user;

  try {
    const user: any = await User.findByPk(id_user);
    if (user) {
      if (user.pin === pin) {
        res.json({ correct: true });
      } else {
        res.status(400).json({
          msg: "Pin incorrect",
        });
      }
    } else {
      res.status(404).json({
        msg: `There is no user with the id ${id_user}`,
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
    const user: any = await User.findOne({
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
      const token = generateToken({
        id_user: user.id_user,
        username: user.username,
      });
      res.json({ token });
    }
  } catch (error) {
    console.log(body);
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};

export const loginUserByToken = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { user } = req.body;
  const { id_user, username } = user;
  try {
    const user: any = await User.findOne({
      where: {
        id_user,
        username,
      },
    });
    if (!user) {
      return res.status(400).json({
        msg: "User or password incorrect",
      });
    } else {
      res.json({ loggedUser: true });
    }
  } catch (error) {
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};

export const createUser = async (req: Request, res: Response): Promise<any> => {
  const { body } = req;
  const { username, email, password } = body;

  try {
    const userByUsername = await User.findOne({
      where: {
        username,
      },
    });
    const userByEmail = await User.findOne({
      where: {
        email,
      },
    });
    if (userByUsername || userByEmail) {
      return res.status(400).json({
        msg: "The user already exists",
      });
    } else {
      const newUser: any = await User.create(body);
      const token = generateToken({
        id_user: newUser.id_user,
        username: newUser.username,
      });
      res.json({ token });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<any> => {
  const { user } = req.body;
  const { id_user } = user;
  const { body } = req;

  try {
    const user = await User.findByPk(id_user);
    if (!user) {
      return res.status(404).json({
        msg: `There is no user with the id ${id_user}`,
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

export const getUserbyUsername = async (req: Request, res: Response) => {
  const { username } = req.params;

  try {
    const users: any = await User.findOne({
      where: {
        username,
      },
    });
    if (users) {
      const toSend = users.map((user: any) => {
        return {
          id_user: user.id_user,
          username: user.username,
          email: user.email,
          admin: user.admin,
          image: user.image,
          tag: user.tag,
          name: user.name,
          id_restaurant: user.id_restaurant,
        };
      });
      res.json(toSend);
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
