import React from "react";
import axios from "axios";
import { ReactQueryDevtools } from "react-query/devtools";
import { useQuery, useQueryClient, useMutation, QueryClient, QueryClientProvider } from "react-query";
import { List, ListItem, Toolbar, Typography } from "@material-ui/core";
import { ListItemText } from "@mui/material";
import { Box } from "@material-ui/system";

const SERVER_URL = process.env.REACT_APP_API_SERVER;

function History() {
  // Dialog
  const toggleDrawer = (open) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }
  };

  // React Query - History
  const queryClient = useQueryClient();
  const [intervalMs, setIntervalMs] = React.useState(5000 * 5);
  const [value, setValue] = React.useState("");

  const { status, data, error, isFetching } = useQuery(
    "history",
    async () => {
      const res = await axios.get(SERVER_URL + "/api/ST0001/patient/history/");
      return res.data;
    },
    {
      
      // Refetch the data every second
      refetchInterval: intervalMs,
      refetchOnWindowFocus:true
    }
  );

  return (
    <Box p={2} sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <Toolbar />
      <Typography variant="h4">История</Typography>
      <List>
        {data.map((patient, index) => (
          <ListItem button key={patient["uuid"]}>
            <ListItemText primary={patient["id_ambulatory"]} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default History;
