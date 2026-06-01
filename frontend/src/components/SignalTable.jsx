import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Button,
  Skeleton,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";

import toast from "react-hot-toast";

import StatusChip from "./StatusChip";

import {
  getSignals,
  getSignalStatus,
  deleteSignal,
} from "../services/signalApi";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export default function SignalTable() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["signals"],

    queryFn: async () => {
      const res = await getSignals();

      const rows = await Promise.all(
        res.data.data.map(async (signal) => {
          try {
            const statusRes =
              await getSignalStatus(signal.id);

            const currentPrice =
              statusRes.data.data.current_price;

            let roi = 0;

            if (signal.direction === "BUY") {
              roi =
                ((currentPrice -
                  signal.entry_price) /
                  signal.entry_price) *
                100;
            } else {
              roi =
                ((signal.entry_price -
                  currentPrice) /
                  signal.entry_price) *
                100;
            }

            return {
              ...signal,
              currentPrice,
              roi: roi.toFixed(2),
              status:
                statusRes.data.data.status,
            };
          } catch {
            return signal;
          }
        })
      );

      return rows;
    },

    refetchInterval: 15000,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSignal,

    onSuccess: () => {
      toast.success(
        "Signal deleted successfully"
      );

      queryClient.invalidateQueries({
        queryKey: ["signals"],
      });
    },

    onError: () => {
      toast.error("Delete failed");
    },
  });

  if (isLoading) {
    return (
      <>
        <Skeleton height={60} />
        <Skeleton height={60} />
        <Skeleton height={60} />
        <Skeleton height={60} />
      </>
    );
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Table>
        <TableHead>
          {/* <TableRow> */}
            <TableRow
    sx={{
      background:
        "rgba(59,130,246,0.08)",
    }}
  >
            <TableCell>Symbol</TableCell>
            <TableCell>Direction</TableCell>
            <TableCell>Entry</TableCell>
            <TableCell>Target</TableCell>
            <TableCell>Stop Loss</TableCell>
            <TableCell>Current</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>ROI %</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data?.map((signal) => (
            <TableRow key={signal.id}>
              <TableCell>
                {signal.symbol}
              </TableCell>

              <TableCell>
                {signal.direction}
              </TableCell>

 <TableCell>
  {Number(signal.entry_price).toFixed(2)}
</TableCell>

<TableCell>
  {Number(signal.target_price).toFixed(2)}
</TableCell>

<TableCell>
  {Number(signal.stop_loss).toFixed(2)}
</TableCell>

<TableCell>
  {signal.currentPrice
    ? Number(signal.currentPrice).toFixed(2)
    : "--"}
</TableCell>

              <TableCell>
                <StatusChip
                  status={signal.status}
                />
              </TableCell>

<TableCell
  sx={{
    color:
      Number(signal.roi) >= 0
        ? "#10B981"
        : "#EF4444",
    fontWeight: 700,
  }}
>
  {Number(signal.roi).toFixed(2)}%
</TableCell>

              <TableCell>
                <Button
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => {
                    if (
                      window.confirm(
                        "Delete this signal?"
                      )
                    ) {
                      deleteMutation.mutate(
                        signal.id
                      );
                    }
                  }}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}