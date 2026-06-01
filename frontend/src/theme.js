import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",

    primary: {
      main: "#3B82F6",
    },

    success: {
      main: "#10B981",
    },

    error: {
      main: "#EF4444",
    },

    warning: {
      main: "#F59E0B",
    },

    background: {
      default: "#0B0F19",
      paper: "#111827",
    },

    text: {
      primary: "#F9FAFB",
      secondary: "#9CA3AF",
    },
  },

  shape: {
    borderRadius: 14,
  },

  typography: {
    fontFamily:
      "'Inter', sans-serif",
  },
});

export default theme;