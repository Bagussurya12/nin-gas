// app.js
import express from "express";
import { PrismaClient } from "@prisma/client";
import router from "./src/Routes/index.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

// Pastikan middleware ini dipasang SEBELUM router
app.use(express.json()); // ← HARUS sebelum app.use("/api", router)
app.use(express.urlencoded({ extended: true })); // ← Tambahkan ini juga

app.use("/api", router);

// Test endpoint
app.get("/", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json({ message: "Server is running", users });
});

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, "0.0.0.0", () => {
//   console.log(`Server running at http://0.0.0.0:${PORT}`);
// });
const PORT = process.env.PORT || 3000;
app.listen(PORT, "localhost", () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
