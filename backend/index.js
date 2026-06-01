import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";

import signalRoutes from "./routes/TradingSignals.js";
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/signals", signalRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});