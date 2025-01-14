import express from "express";
import cookieParser from "cookie-parser";
import "dotenv/config";
import cors from "cors";
import { connectDB } from "./config/database.js";
import authRouter from './routes/auth.js'

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
  })
);

app.use("/auth",authRouter)

const PORT = 4000;

connectDB().then(() =>
  app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
  })
);
