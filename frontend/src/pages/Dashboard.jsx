import {
  Container,
  Typography,
  Paper,
  Box,
} from "@mui/material";

import SignalForm from "../components/SignalForm";
import SignalTable from "../components/SignalTable";

export default function Dashboard() {
  return (
    <Container
      maxWidth="xl"
      sx={{
        py: 4,
      }}
    >
      <Box
        sx={{
          mb: 4,
        }}
      >
        <Typography
          variant="h3"
          fontWeight="700"
        >
          Trading Signal Tracker
        </Typography>

        <Typography
          color="text.secondary"
        >
          Live Binance Signal Monitoring
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          border: "1px solid #1F2937",
          background:
            "linear-gradient(180deg,#111827,#0F172A)",
        }}
      >
        <SignalForm />
      </Paper>

      <SignalTable />
    </Container>
  );
}