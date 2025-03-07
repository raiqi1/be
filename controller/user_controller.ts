import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../config/db";
import { redisClient } from "../config/redis";
import jwt from "jsonwebtoken";

export const create_user = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    const cached_user = await redisClient.get(`user:${email}`);
    if (cached_user) {
      res.status(200).json(JSON.parse(cached_user));
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    await redisClient.set(`user:${email}`, JSON.stringify(user), { EX: 3600 });

    res.status(201).json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const login_user = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
