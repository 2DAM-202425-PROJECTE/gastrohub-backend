import { Request, Response } from "express";
import User from "../models/user";
import { generateAndSaveToken, generateToken } from "../services/token_service";
import Restaurant from "../models/restaurant";
import License from "../models/license";
import bcrypt from "bcryptjs";

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
        notificationToken: user.notificationToken,
      };
      res.json(toSend);
    } else {
      res.sendStatus(404);
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
      if (user.pin === null) {
        res.sendStatus(413);
        return;
      }
      if (user.pin === pin) {
        res.json({ correct: true });
      } else {
        res.sendStatus(412);
      }
    } else {
      res.sendStatus(404);
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
      },
    });
    if (!user) {
      res.sendStatus(414);
    } else {
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.sendStatus(414);
      }

      const token = await generateAndSaveToken({
        id_user: user.id_user,
        username: user.username,
      });

      res.json({ token });
    }
  } catch (error) {
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
      res.sendStatus(414);
    } else {
      if(user.id_restaurant == null){
        res.sendStatus(418);
      }
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
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
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
      res.sendStatus(415);
    } else {
      const newUser: any = await User.create({
        ...body,
        password: hashedPassword,
      });
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

export const createWorker = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { body } = req;
  const { username, email, password } = body;
  const { user } = req.body;
  const { id_user } = user;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user: any = await User.findOne({
      where: {
        id_user,
      },
    });
    const restaurant: any = await Restaurant.findByPk(user.id_restaurant);
    const license: any = await License.findByPk(restaurant.id_license);

    const actualWorkers = await User.findAll({
      where: {
        id_restaurant: user.id_restaurant,
      },
    });
    const actualWorkersCount = actualWorkers.length;

    if (license.license_type != 2 && actualWorkersCount >= 5) {
      res.sendStatus(411);
    } else {
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
        res.sendStatus(415);
      } else {
        const newUser: any = await User.create({
          ...body,
          password: hashedPassword,
        });
        newUser.update({
          restaurant: user.id_restaurant,
          admin: false,
          tag: "",
          pin: "00000",
        });

        res.json({ done: true });
      }
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
    const user: any = await User.findByPk(id_user);
    if (!user) {
      res.sendStatus(404);
    } else {
      if (body.password != "" && body.password != null) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(body.password, salt);
        body.password = hashedPassword;
      } else {
        body.password = user.password;
      }
      if (body.pin == null && user.pin != null) {
        body.pin = user.pin;
      }
      await user.update(body);

      res.json({ done: true });
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
    const user: any = await User.findOne({
      where: {
        username,
      },
    });
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
      res.sendStatus(404);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};

export const userAdminCheck = async (req: Request, res: Response) => {
  const { user } = req.body;
  const { id_user } = user;

  try {
    const user: any = await User.findOne({
      where: {
        id_user,
      },
    });
    if (user) {
      if (user.admin) {
        res.json({ admin: true });
      } else {
        res.json({ admin: false });
      }
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};

export const assignWorker = async (req: Request, res: Response) => {
  const { user } = req.body;
  const { id_user } = user;
  const { id } = req.params;

  try {
    const user: any = await User.findOne({
      where: {
        id_user,
      },
    });
    const restaurant: any = await Restaurant.findByPk(user.id_restaurant);
    const license: any = await License.findByPk(restaurant.id_license);

    const actualWorkers = await User.findAll({
      where: {
        id_restaurant: user.id_restaurant,
      },
    });
    const actualWorkersCount = actualWorkers.length;

    if (license.license_type != 2 && actualWorkersCount >= 5) {
      res.sendStatus(411);
    } else {
      const worker: any = await User.findByPk(id);
      if (worker) {
        if (worker.id_restaurant != null) {
          res.sendStatus(417);
          return;
        } else {
          await worker.update({
            id_restaurant: user.id_restaurant,
            admin: false,
            tag: "",
            pin: "00000",
          });
        }
        res.json({ added: true });
      } else {
        res.sendStatus(404);
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};

export const deleteWorker = async (req: Request, res: Response) => {
  const { user } = req.body;
  const { id_user } = user;
  const { id } = req.params;

  try {
    const worker: any = await User.findByPk(id);
    if (worker) {
      await worker.update({
        id_restaurant: null,
        admin: false,
        tag: "",
        pin: "00000",
      });
      res.json({ deleted: true });
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};

export const resetPin = async (req: Request, res: Response) => {
  const { user } = req.body;
  const { id_user } = user;
  const { id } = req.params;

  try {
    const worker: any = await User.findByPk(id);
    if (worker) {
      await worker.update({
        pin: "00000",
      });
      res.json({ done: true });
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};

export const leaveRestaurant = async (req: Request, res: Response) => {
  const { user } = req.body;
  const { id_user } = user;

  try {
    const worker: any = await User.findByPk(id_user);
    if (worker) {
      await worker.update({
        id_restaurant: null,
        admin: false,
        tag: "",
        pin: "00000",
      });
      res.json({ left: true });
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};

export const updateWorker = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id } = req.params;
  const { user } = req.body;
  const { id_user } = user;
  const { tag, admin } = req.body;

  try {
    const user: any = await User.findByPk(id);
    const userAdmins = await User.findAll({
      where: {
        id_restaurant: user.id_restaurant,
        admin: true,
      },
    });

    const userAdminsCount = userAdmins.length;
    if (!admin && userAdminsCount <= 1) {
      res.sendStatus(416);
      return;
    }
    if (!user) {
      res.sendStatus(404);
    } else {
      await user.update({
        tag,
        admin,
      });

      res.json({ done: true });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};

export const notificationsUpdate = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { user } = req.body;
  const { id_user } = user;
  const { body } = req;

  try {
    const user: any = await User.findByPk(id_user);
    if (!user) {
      res.sendStatus(404);
    } else {
      const notificationToken = body.notificationToken;

      await user.update({
        notificationToken,
        
      });

      res.json({ done: true });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};


export const languageUpdate = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { user } = req.body;
  const { id_user } = user;
  const { body } = req;

  try {
    const user: any = await User.findByPk(id_user);
    if (!user) {
      res.sendStatus(404);
    } else {
      const language = body.language;

      await user.update({
        language,
      });

      res.json({ done: true });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};
