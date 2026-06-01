import { useState } from "react";
import { createSignal } from "../services/signalApi";
import {
  Grid,
  TextField,
  Button,
  MenuItem,
  Typography,
  Paper,
  Alert,
  Box,
} from "@mui/material";

const initialState = {
  symbol: "",
  direction: "BUY",
  entry_price: "",
  stop_loss: "",
  target_price: "",
  entry_time: "",
  expiry_time: "",
};

export default function SignalForm({ onCreated }) {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    const entry = Number(form.entry_price);
    const stop = Number(form.stop_loss);
    const target = Number(form.target_price);

    if (form.direction === "BUY") {
      if (stop >= entry)
        return "Stop Loss must be less than Entry Price";

      if (target <= entry)
        return "Target Price must be greater than Entry Price";
    }

    if (form.direction === "SELL") {
      if (stop <= entry)
        return "Stop Loss must be greater than Entry Price";

      if (target >= entry)
        return "Target Price must be less than Entry Price";
    }

    if (
      new Date(form.expiry_time) <=
      new Date(form.entry_time)
    ) {
      return "Expiry Time must be after Entry Time";
    }

    return "";
  };

  const submit = async (e) => {
    e.preventDefault();

    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await createSignal(form);

      setError("");
      setForm(initialState);

      onCreated?.();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Something went wrong"
      );
    }
  };

  const fieldStyle = {
    "& .MuiOutlinedInput-root": {
      height: 56,
      borderRadius: "12px",
      backgroundColor: "#111827",

      "& fieldset": {
        borderColor: "#374151",
      },

      "&:hover fieldset": {
        borderColor: "#3B82F6",
      },

      "&.Mui-focused fieldset": {
        borderColor: "#3B82F6",
      },
    },

    "& .MuiInputBase-input": {
      color: "#fff",
    },

    "& .MuiInputLabel-root": {
      color: "#94A3B8",
    },

    "& .MuiInputLabel-root.Mui-focused": {
      color: "#3B82F6",
    },

    "& input::-webkit-calendar-picker-indicator": {
      filter: "invert(1)",
      cursor: "pointer",
    },
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        borderRadius: "20px",
        background:
          "linear-gradient(180deg,#111827,#0F172A)",
        border: "1px solid #1E293B",
      }}
    >
      <form onSubmit={submit}>
        <Typography
          variant="h4"
          sx={{
            color: "#fff",
            fontWeight: 700,
            mb: 1,
          }}
        >
          Create Trading Signal
        </Typography>

        <Typography
          sx={{
            color: "#94A3B8",
            mb: 4,
          }}
        >
          Create and monitor trading signals with
          live market tracking.
        </Typography>

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: 2,
            }}
          >
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Trading Pair"
              placeholder="BTCUSDT"
              name="symbol"
              value={form.symbol}
              onChange={handleChange}
              sx={fieldStyle}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              select
              fullWidth
              label="Direction"
              name="direction"
              value={form.direction}
              onChange={handleChange}
              sx={fieldStyle}
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    sx: {
                      bgcolor: "#111827",
                      color: "#fff",
                    },
                  },
                },
              }}
            >
              <MenuItem value="BUY">
                BUY
              </MenuItem>

              <MenuItem value="SELL">
                SELL
              </MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              type="number"
              label="Entry Price"
              name="entry_price"
              value={form.entry_price}
              onChange={handleChange}
              sx={fieldStyle}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Stop Loss"
              name="stop_loss"
              value={form.stop_loss}
              onChange={handleChange}
              sx={fieldStyle}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Target Price"
              name="target_price"
              value={form.target_price}
              onChange={handleChange}
              sx={fieldStyle}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="datetime-local"
              label="Entry Time"
              name="entry_time"
              value={form.entry_time}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              sx={fieldStyle}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="datetime-local"
              label="Expiry Time"
              name="expiry_time"
              value={form.expiry_time}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              sx={fieldStyle}
            />
          </Grid>

          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                mt: 1,
              }}
            >
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{
                  minWidth: "220px",
                  height: "52px",
                  borderRadius: "12px",
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: "16px",
                  background:
                    "linear-gradient(90deg,#2563EB,#3B82F6)",

                  "&:hover": {
                    background:
                      "linear-gradient(90deg,#1D4ED8,#2563EB)",
                  },
                }}
              >
                Create Signal
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}