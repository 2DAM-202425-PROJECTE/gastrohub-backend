import jwt, { Secret, SignOptions } from "jsonwebtoken";
import UserToken from "../models/userTokens";
import User from "../models/user";

const JWT_SECRET: Secret = process.env.JWT_SECRET || "nose";

export const generateToken = (
  payload: string | object | Buffer,
  expiresIn: SignOptions["expiresIn"] = "7d"
): string => {
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, JWT_SECRET);
};
export const generateAndSaveToken = async (user: any): Promise<string> => {
  
  const userModel: any = await User.findByPk(user.id_user);
  if (userModel.id_token) {
    await UserToken.update(
      { is_valid: false },
      { where: { id_token: userModel.id_token } }
    );
  }

  const token = generateToken({
    id_user: user.id_user,
    username: user.username,
  });
  const decoded = jwt.decode(token) as { exp: number };
  const expiresAt = new Date(decoded.exp! * 1000);

  // Guarda el token en la DB
  const savedToken: any = await UserToken.create({
    token: token,
    expiration_date: expiresAt,
    is_valid: true,
  });

  await User.update(
    { id_token: savedToken.id_token },
    { where: { id_user: user.id_user } }
  );

  return token;
};
