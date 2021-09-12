import {
  Avatar,
  Button,
  Card,
  CardHeader,
  CircularProgress,
  Divider,
  Grid,
  List,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@material-ui/core";

import { Box } from "@material-ui/system";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import React from "react";
import { QueryClient, QueryClientProvider, useQuery, useQueryClient } from "react-query";
import { useLocation, useRouteMatch } from "react-router";
import BlockTransfer from "./Patient/BlockTransfer";

const BASE_URL = "http://localhost/api/ST0001";

function usePatient() {
  let { path, url } = useRouteMatch();
  const lastSegment = url.split("/").pop();

  return useQuery("patient", async () => {
    const { data } = await axios.get(`${BASE_URL}/patients/${lastSegment}`);

    return data;
  });
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

function PersonalData() {
  /*** React-Query ***/
  const queryClient = useQueryClient({
    defaultOptions: {
      queries: {
        suspense: false,
      },
    },
  });

  const { status, data, error, isFetching } = usePatient();

  /*** Tab System ***/
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Box sx={{ flexGrow: 1, bgcolor: "background.paper", display: "flex" }}>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          sx={{ borderRight: 1, borderColor: "divider" }}
        >
          <Tab label="Информация" />
          <Tab label="Блоки & МП" />
          <Tab label="Выдача" />
        </Tabs>

        {isFetching ? (
          <Box display="flex" justifyContent="center" alignItems="center">
            <CircularProgress size={50} thickness={4.8} color="secondary" />
          </Box>
        ) : (
          <React.Fragment>
            <TabPanel value={value} index={0}>
              <CardHeader
                avatar={
                  <Avatar>
                    {data.last_name[0]}
                    {data.first_name[0]}
                  </Avatar>
                }
                title={
                  <Typography>
                    ФИО: {data.last_name} {data.first_name} {data.middle_name}
                  </Typography>
                }
                subheader={<Typography>Дата рождения: {data.date_of_birth}</Typography>}
              ></CardHeader>
              <Typography>Адрес</Typography>
            </TabPanel>

            <TabPanel value={value} index={1}>
              <Grid container direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                <Grid item md={6}>
                  <MenuList dense>
                    Блоки
                    {data["blocks"].map((block) => {
                      return <MenuItem>{block["code"]}</MenuItem>;
                    })}
                  </MenuList>
                </Grid>
                <Grid item md={6}>
                  <MenuList dense>
                    Микропрепараты
                    {data["slides"].map((slide) => {
                      return <MenuItem>{slide["code"]}</MenuItem>;
                    })}
                  </MenuList>
                </Grid>
              </Grid>
            </TabPanel>

            <TabPanel value={value} index={2}>
              <BlockTransfer data={data} />
            </TabPanel>
          </React.Fragment>
        )}
      </Box>
    </QueryClientProvider>
  );
}

export default PersonalData;
