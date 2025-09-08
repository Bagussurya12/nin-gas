import express from "express";
import { PrismaClient } from "@prisma/client"; // langsung pakai PrismaClient
import router from "./src/Routes/index.js";
import jwtAuth from "./src/Middlewares/Auth/JwtAuth.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const prisma = new PrismaClient(); // inisialisasi langsung di sini

app.use(express.json());
app.use("/api", router);

// Test endpoint root
app.get("/", async (req, res) => {
  // contoh query ke database
  const users = await prisma.user.findMany();
  res.json({ message: "Server is running", users });
});

// Jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
