import { faEdit, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Avatar,
  Button,
  Card,
  CardHeader,
  CircularProgress,
  Dialog,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@material-ui/core";

import { Box, fontSize } from "@material-ui/system";
import { DialogTitle, ListItemIcon } from "@mui/material";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import React, { useState } from "react";
import { QueryClient, QueryClientProvider, useQuery, useQueryClient } from "react-query";
import { useLocation, useRouteMatch } from "react-router";
import { Link } from "react-router-dom";
import BlockDialog from "../../Components/Dialogs/BlockDialog";
import BlockTransfer from "./Tabs/BlockTransfer";

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
      {value === index && <Box sx={{ paddingLeft: 2, maxWidth: 800 }}>{children}</Box>}
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
  const [tab, setTab] = useState(0);

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  /** Block Edit - Dialog **/
  const [open, setOpen] = useState(false);
  const [dialogData, setDialogData] = useState(false);

  const handleClickOpen = (index) => () => {
    setDialogData(index);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      {data && (
        <React.Fragment>
          <Box
            sx={{
              pl: 1,
              mb: 1,
              borderLeft: "0.2rem solid #f9a825",
              borderTop: "0.2rem solid #f9a825",
              width: "20rem",
              flexGrow: 1,
            }}
          >
            <Typography variant="h6">Пациент №{data.id_ambulatory}</Typography>
          </Box>
          <Box sx={{ p: 0, bgcolor: "background.paper", display: "flex" }}>
            <Tabs
              orientation="vertical"
              variant="scrollable"
              textColor="secondary"
              value={tab}
              onChange={handleChange}
              aria-label="Personal Data Vertical tabs"
              sx={{ borderLeft: 1, borderRight: 1, borderColor: "divider" }}
            >
              <Tab label="Информация" />
              <Tab label="Блоки" />
              <Tab label="МП" />
            </Tabs>

            {isFetching ? (
              <div style={{ paddingTop: 4, display: "flex", justifyContent: "center" }}>
                <CircularProgress size={90} thickness={3.2} color="secondary" />
              </div>
            ) : (
              <React.Fragment>
                <TabPanel value={tab} index={0}>
                  <Typography>
                    ФИО: {data.last_name} {data.first_name} {data.middle_name}
                  </Typography>

                  <Typography>Дата рождения: {data.date_of_birth}</Typography>

                  <Typography>Адрес</Typography>
                </TabPanel>
                <TabPanel value={tab} index={1}>
                  <Grid container spacing={1}>
                    <Grid item>
                      <Typography m={0}>Блоки с присвоенной группой</Typography>
                      {data["blocks"].map((block, index) => {
                        if (block["block_group"]) {
                          return (
                            <React.Fragment>
                              <div key={block["uuid"]}>
                                <Button sx={{ paddingTop: 0, paddingBottom: 0, fontSize: 22 }}>
                                  <FontAwesomeIcon icon={faEdit} />
                                </Button>

                                <MenuItem onClick={handleClickOpen(block)} sx={{ padding: 0, fontSize: 16 }}>
                                  {block["code"]}
                                </MenuItem>
                              </div>
                            </React.Fragment>
                          );
                        }
                      })}

                      <BlockDialog open={open} handleClose={handleClose} data={dialogData} />

                      <Typography m={0}>Блоки без присвоенной группы</Typography>
                      {data["blocks"].map((block) => {
                        if (!block["block_group"]) {
                          return (
                            <React.Fragment>
                              <div key={block["uuid"]}>
                                <Button sx={{ paddingTop: 0, paddingBottom: 0, fontSize: 22 }}>
                                  <FontAwesomeIcon icon={faEdit} />
                                </Button>

                                <MenuItem onClick={handleClickOpen(block)} sx={{ padding: 0, fontSize: 16 }}>
                                  {block["code"]}
                                </MenuItem>
                              </div>
                            </React.Fragment>
                          );
                        }
                      })}
                    </Grid>
                  </Grid>
                </TabPanel>
                <TabPanel value={tab} index={2}>
                  В разработке
                </TabPanel>
              </React.Fragment>
            )}
          </Box>
        </React.Fragment>
      )}
    </QueryClientProvider>
  );
}

export default PersonalData;
