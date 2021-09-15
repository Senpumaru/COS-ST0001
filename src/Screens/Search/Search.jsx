import { Tabs, Typography } from "@material-ui/core";
import { Box } from "@material-ui/system";
import React, { useState } from "react";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { BrowserRouter as Router, Switch, Route, Link, useRouteMatch, useParams } from "react-router-dom";
import BlockSearch from "./BlockSearch";
import PatientSearch from "./PatientSearch";
import SlideSearch from "./SlideSearch";
import PersonalData from "../Patient/PersonalData";
import PatientUpdate from "../Patient/Update/PatientUpdate";

function Search() {
  let { path, url } = useRouteMatch();

  const [tab, setTab] = useState("Patient");

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <React.Fragment>
      <Box
        sx={{
          pl: 1,
          borderLeft: "0.2rem solid #f9a825",
          borderBottom: "0.2rem solid #f9a825",
          width: "20rem",
          flexGrow: 1,
        }}
      >
        <Typography variant="h2">Система поиска</Typography>
      </Box>
      <Typography variant="h5">Выберите объект поиска</Typography>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tab} onChange={handleChange} aria-label="lab API tabs example">
          <Tab component={Link} to={`${url}/patient`} label="Пациенты" value="Patient" />
          <Tab component={Link} to={`${url}/block`} label="Блоки" value="Blocks" />
          <Tab component={Link} to={`${url}/slide`} label="Микропрепараты (МП)" value="Slides" />
        </Tabs>
      </Box>
      <Box pt={2}>
        <Switch>
          <Route exact path={`${path}/patient`}>
            <PatientSearch />
          </Route>
          <Route path={`${path}/patient/:uuid/edit`}>
            <PatientUpdate />
          </Route>
          <Route path={`${path}/patient/:uuid`}>
            <PersonalData />
          </Route>
          <Route path={`${path}/block`}>
            <BlockSearch />
          </Route>
          <Route path={`${path}/slide`}>
            <SlideSearch />
          </Route>
        </Switch>
      </Box>
    </React.Fragment>
  );
}

export default Search;
