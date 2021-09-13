import { faEdit, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
import { ListItemIcon } from "@mui/material";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import React from "react";
import { QueryClient, QueryClientProvider, useQuery, useQueryClient } from "react-query";
import { useLocation, useRouteMatch } from "react-router";
import { Link } from "react-router-dom";
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
  const [tab, setTab] = React.useState(0);

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <QueryClientProvider client={queryClient}>
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
          <Tab label="Блоки & МП" />
        </Tabs>

        {isFetching ? (
          <Box justifyContent="center" alignItems="center">
            <CircularProgress size={50} thickness={4.8} color="secondary" />
          </Box>
        ) : (
          <React.Fragment>
            <TabPanel value={tab} index={0}>
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

            <TabPanel value={tab} index={1}>
              <Box sx={{}}>
                <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={1}>
                  <Typography m={1} variant="h5">
                    Блоки и МП с присвоенной группой
                  </Typography>
                  <Grid item xs={6}>
                    Блоки
                    {data["blocks"].map((block) => {
                      if (block["block_group"]) {
                        return (
                          <React.Fragment>
                            <Grid container item>
                              <Button>
                                <FontAwesomeIcon icon={faEdit} />
                              </Button>

                              <MenuItem>
                                <ListItemText>{block["code"]}</ListItemText>
                              </MenuItem>
                            </Grid>
                          </React.Fragment>
                        );
                      }
                    })}
                  </Grid>
                  <Grid item xs={6}>
                    Микропрепараты
                    {data["slides"].map((slide) => {
                      if (slide["slide_group"]) {
                        return (
                          <React.Fragment>
                            <Grid container item>
                              <Button>
                                <FontAwesomeIcon icon={faEdit} />
                              </Button>

                              <MenuItem>
                                <ListItemText>{slide["code"]}</ListItemText>
                              </MenuItem>
                            </Grid>
                          </React.Fragment>
                        );
                      }
                    })}
                  </Grid>
                </Grid>
              </Box>

              <Box
                sx={{
                  flexGrow: 1,
                }}
              >
                <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={1}>
                  <Typography m={1} variant="h5">
                    Блоки и МП без присвоенной группы
                  </Typography>
                  <Grid item xs={6}>
                    <MenuList dense>
                      Блоки
                      {data["blocks"].map((block) => {
                        if (!block["block_group"]) {
                          return (
                            <React.Fragment>
                              <Grid container item>
                                <Button>
                                  <FontAwesomeIcon icon={faEdit} />
                                </Button>

                                <MenuItem>
                                  <ListItemText>{block["code"]}</ListItemText>
                                </MenuItem>
                              </Grid>
                            </React.Fragment>
                          );
                        }
                      })}
                    </MenuList>
                  </Grid>
                  <Grid item xs={6}>
                    <MenuList dense>
                      Микропрепараты
                      {data["slides"].map((slide) => {
                        if (!slide["slide_group"]) {
                          return (
                            <React.Fragment>
                              <Grid container item>
                                <Button>
                                  <FontAwesomeIcon icon={faEdit} />
                                </Button>

                                <MenuItem>
                                  <ListItemText>{slide["code"]}</ListItemText>
                                </MenuItem>
                              </Grid>
                            </React.Fragment>
                          );
                        }
                      })}
                    </MenuList>
                  </Grid>
                </Grid>
              </Box>
            </TabPanel>

            <TabPanel value={tab} index={2}>
              <BlockTransfer data={data} />
            </TabPanel>
          </React.Fragment>
        )}
      </Box>
    </QueryClientProvider>
  );
}

export default PersonalData;
