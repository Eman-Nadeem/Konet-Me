import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import { connnectDB } from "./lib/connnect.db.js";

dotenv.config();

const app = express();

const PORT=process.env.PORT

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
  connnectDB();
});
