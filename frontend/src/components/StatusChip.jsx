import Chip from "@mui/material/Chip";

export default function StatusChip({
  status,
}) {
  const config = {
    OPEN: {
      color: "info",
    },

    TARGET_HIT: {
      color: "success",
    },

    STOPLOSS_HIT: {
      color: "error",
    },

    EXPIRED: {
      color: "warning",
    },
  };

  return (
    <Chip
      label={status}
      color={
        config[status]?.color ||
        "default"
      }
      size="small"
      sx={{
        fontWeight: 700,
      }}
    />
  );
}