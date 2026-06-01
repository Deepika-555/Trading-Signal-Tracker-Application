import * as signalService from "../Services/TradingSignals.js";
import { getCurrentPrice } from "../Services/binanceService.js";

export const createSignal = async (req, res) => {
  try {
    const {
      symbol,
      direction,
      entry_price,
      stop_loss,
      target_price,
      entry_time,
      expiry_time,
    } = req.body;

    // Required fields validation
    if (
      !symbol ||
      !direction ||
      entry_price == null ||
      stop_loss == null ||
      target_price == null ||
      !entry_time ||
      !expiry_time
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

        // NEW VALIDATION HERE 👇
    const now = new Date();
    const entryDate = new Date(entry_time);

    const hoursDiff =
      (now.getTime() - entryDate.getTime()) /
      (1000 * 60 * 60);

    if (hoursDiff > 24) {
      return res.status(400).json({
        success: false,
        message:
          "Entry time cannot be more than 24 hours old",
      });
    }





    // BUY validations
    if (direction === "BUY") {
      if (Number(stop_loss) >= Number(entry_price)) {
        return res.status(400).json({
          success: false,
          message: "For BUY signals: Stop Loss must be less than Entry Price",
        });
      }

      if (Number(target_price) <= Number(entry_price)) {
        return res.status(400).json({
          success: false,
          message: "For BUY signals: Target Price must be greater than Entry Price",
        });
      }
    }

    // SELL validations
    if (direction === "SELL") {
      if (Number(stop_loss) <= Number(entry_price)) {
        return res.status(400).json({
          success: false,
          message: "For SELL signals: Stop Loss must be greater than Entry Price",
        });
      }

      if (Number(target_price) >= Number(entry_price)) {
        return res.status(400).json({
          success: false,
          message: "For SELL signals: Target Price must be less than Entry Price",
        });
      }
    }

        if (new Date(expiry_time) <= new Date(entry_time)) {
      return res.status(400).json({
        success: false,
        message:
          "Expiry time must be after Entry time",
      });
    }

    const signal = await signalService.createSignal(req.body);

    return res.status(201).json({
      success: true,
      message: "Trading signal created successfully",
      data: signal,
    });
  } catch (error) {
    console.error("Create Signal Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


export const getAllSignals = async (req, res) => {
  try {
    const signals = await signalService.getAllSignals();

    return res.status(200).json({
      success: true,
      count: signals.length,
      data: signals,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


export const getSignalById = async (req, res) => {
  try {
    const { id } = req.params;

    const signal = await signalService.getSignalById(id);

    if (!signal) {
      return res.status(404).json({
        success: false,
        message: "Signal not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: signal,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};



export const deleteSignal = async (req, res) => {
  try {
    const { id } = req.params;



    const deletedSignal = await signalService.deleteSignal(id);

    if (!deletedSignal) {
      return res.status(404).json({
        success: false,
        message: "Signal not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Signal deleted successfully",
      data: deletedSignal,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


export const getSignalStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const signal = await signalService.getSignalById(id);

    if (!signal) {
      return res.status(404).json({
        success: false,
        message: "Signal not found",
      });
    }

    const currentPrice = await getCurrentPrice(signal.symbol);

    let status = "OPEN";

    const now = new Date();

    if (now > new Date(signal.expiry_time)) {
      status = "EXPIRED";
    } else if (signal.direction === "BUY") {
      if (currentPrice >= Number(signal.target_price)) {
        status = "TARGET_HIT";
      } else if (currentPrice <= Number(signal.stop_loss)) {
        status = "STOPLOSS_HIT";
      }
    } else if (signal.direction === "SELL") {
      if (currentPrice <= Number(signal.target_price)) {
        status = "TARGET_HIT";
      } else if (currentPrice >= Number(signal.stop_loss)) {
        status = "STOPLOSS_HIT";
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        signal_id: signal.id,
        symbol: signal.symbol,
        direction: signal.direction,
        current_price: currentPrice,
        target_price: signal.target_price,
        stop_loss: signal.stop_loss,
        status,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};