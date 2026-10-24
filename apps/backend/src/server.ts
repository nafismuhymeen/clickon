import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { db } from "./db/index.js";

const app = express();
const PORT = env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "ClickOn Express backend is running",
    environment: env.NODE_ENV,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on ${env.BASE_URL}`);
});
