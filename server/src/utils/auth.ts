import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request } from "express";

const JWT_SECRET = process.env.JWT_SECRET || "5joi3j5ojfpoerksopjdf";

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const verifyPassword = async (
  password: string,
  hashedPassword: string
) => {
  return bcrypt.compare(password, hashedPassword);
};

export const signToken = (payload: { id: string; email: string }) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
};

export const getUserFromToken = (req: Request) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  const token = authHeader.replace("Bearer ", "").trim();

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      email: string;
    };
    return decoded;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};
