import express from "express";
import prisma from "./prisma.js";
import router from "./src/Routes/index.js";
import jwtAuth from "./src/Middlewares/Auth/JwtAuth.js"; // pastikan jwtAuth menaruh user di req.user
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/api", router);

// Test endpoint root
app.get("/", (req, res) => res.send("Server is running"));

// Jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
