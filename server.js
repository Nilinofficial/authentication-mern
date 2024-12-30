import express from "express";
import cookieParser from "cookie-parser";
import "dotenv/config";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
  })
);

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`Listenijg to port ${PORT}`);
});
