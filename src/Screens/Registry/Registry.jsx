import { Box } from "@material-ui/core";
import { Tab, Tabs, Typography } from "@material-ui/core";
import React from "react";
import { useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link, useRouteMatch, useParams } from "react-router-dom";
import BlockRegistry from "./Block/BlockRegistry";
import PatientRegistry from "./Patient/PatientRegistry";
import SlideRegistry from "./Slide/SlideRegistry";

function Registry() {
  let { path, url } = useRouteMatch();

  const [value, setValue] = useState("one");

  const handleTabs = (tab, newTab) => {
    setValue(newTab);
  };

  return (
    <React.Fragment>
      <Box>
        <Box sx={{ pl: 1, borderLeft: "0.2rem solid #f9a825", borderBottom: "0.2rem solid #f9a825", width:"20rem", flexGrow: 1 }}>
          <Typography variant="h2">Регистрация</Typography>
        </Box>

        <Typography variant="h5">Выберите объект для регистрации</Typography>
        <Tabs value={value} onChange={handleTabs} aria-label="Tabs">
          <Tab component={Link} to={`${url}/patient`} value="one" label="Пациент" />
          <Tab component={Link} to={`${url}/block/blocks`} value="two" label="Блок" />
          <Tab component={Link} to={`${url}/slide/slides`} value="three" label="Микропрепарат (МП)" />
        </Tabs>
      </Box>

      <Switch>
        <Route path={`${path}/patient`}>
          <PatientRegistry />
        </Route>
        <Route path={`${path}/block/`}>
          <BlockRegistry />
        </Route>
        <Route path={`${path}/slide/`}>
          <SlideRegistry />
        </Route>
      </Switch>
    </React.Fragment>
  );
}

export default Registry;
