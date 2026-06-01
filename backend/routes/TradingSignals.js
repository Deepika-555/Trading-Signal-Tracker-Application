import express from "express";
import { createSignal, getAllSignals,getSignalById,deleteSignal, getSignalStatus} from "../Controlllers/TradingSignals.js";

const router = express.Router();

router.post("/", createSignal);
router.get("/", getAllSignals);
router.get("/:id", getSignalById);
router.delete("/:id", deleteSignal);
router.get("/:id/status", getSignalStatus);


export default router;