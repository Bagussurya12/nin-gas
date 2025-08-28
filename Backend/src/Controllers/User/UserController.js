import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import bcrypt from "bcrypt";

const BCRYPT_SALT_ROUNDS = 10;

class UserController {
  // =====================
  // GET all users
  // =====================
  async getAllUsers(req, res) {
    try {
      const { search = "", page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;

      const where = search
        ? {
            OR: [
              { fullname: { contains: search, mode: "insensitive" } },
              { username: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
            ],
          }
        : {};

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          skip: Number(skip),
          take: Number(limit),
          select: { id: true, fullname: true, username: true, email: true },
          orderBy: { fullname: "asc" },
        }),
        prisma.user.count({ where }),
      ]);

      res.json({
        success: true,
        data: users,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }

  // =====================
  // GET single user by ID
  // =====================
  async getUser(req, res) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: Number(req.params.id) },
        select: { id: true, fullname: true, username: true, email: true },
      });

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      res.json({ success: true, data: user });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }

  // =====================
  // CREATE user
  // =====================
  async createUser(req, res) {
    try {
      const { fullname, username, email, password } = req.body;
      if (!fullname || !username || !email || !password) {
        return res
          .status(400)
          .json({ success: false, message: "All fields are required" });
      }

      const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

      const newUser = await prisma.user.create({
        data: { fullname, username, email, password: hashedPassword },
        select: { id: true, fullname: true, username: true, email: true },
      });

      res.status(201).json({ success: true, data: newUser });
    } catch (err) {
      console.error(err);

      if (err.code === "P2002" && err.meta?.target?.includes("username")) {
        return res.status(400).json({
          success: false,
          message: `Username "${req.body.username}" is already taken`,
        });
      }

      if (err.code === "P2002" && err.meta?.target?.includes("email")) {
        return res.status(400).json({
          success: false,
          message: `Email "${req.body.email}" is already taken`,
        });
      }

      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }

  // =====================
  // UPDATE user
  // =====================
  async updateUser(req, res) {
    try {
      const targetUserId = Number(req.params.id);
      const { username, email, password, fullname } = req.body;

      const dataToUpdate = { username, email, fullname };
      if (password) {
        dataToUpdate.password = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
      }

      const updatedUser = await prisma.user.update({
        where: { id: targetUserId },
        data: dataToUpdate,
        select: { id: true, username: true, email: true, fullname: true },
      });

      res.json({ success: true, data: updatedUser });
    } catch (err) {
      console.error(err);

      if (err.code === "P2002") {
        const field = err.meta?.target?.[0];
        return res.status(400).json({
          success: false,
          message: `${field.charAt(0).toUpperCase() + field.slice(1)} "${
            req.body[field]
          }" is already taken`,
        });
      }

      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }

  // =====================
  // DELETE user
  // =====================
  async deleteUser(req, res) {
    try {
      const targetUserId = Number(req.params.id);
      await prisma.user.delete({ where: { id: targetUserId } });

      res.json({ success: true, message: "User deleted" });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }
}

export default new UserController();
