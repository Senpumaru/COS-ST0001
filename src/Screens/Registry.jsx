import { Box } from "@material-ui/core";
import { Tab, Tabs, Typography } from "@material-ui/core";
import React from "react";
import { useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link, useRouteMatch, useParams } from "react-router-dom";
import BlockRegistry from "./Registry/BlockRegistry";
import PatientRegistry from "./Registry/PatientRegistry";
import SlideRegistry from "./Registry/SlideRegistry";

function Registry() {
  let { path, url } = useRouteMatch();

  const [value, setValue] = useState("one");

  const handleTabs = (tab, newTab) => {
    setValue(newTab);
  };

  return (
    <React.Fragment>
      <Typography variant="h4">Регистрация</Typography>
      <Tabs value={value} onChange={handleTabs} aria-label="Tabs">
        <Tab component={Link} to={`${url}/patient`} value="one" label="Пациент" />
        <Tab component={Link} to={`${url}/block`} value="two" label="Блоки" />
        <Tab component={Link} to={`${url}/slide`} value="three" label="Микропрепараты (МП)" />
      </Tabs>
      <Box sx={{ flexGrow: 1, p: 2 }}>
        <Typography>Выебрите объект для регистрации</Typography>
      </Box>
      <Switch>
        <Route path={`${path}/patient`}>
          <PatientRegistry />
        </Route>
        <Route path={`${path}/block`}>
          <BlockRegistry />
        </Route>
        <Route path={`${path}/slide`}>
          <SlideRegistry />
        </Route>
      </Switch>
    </React.Fragment>
  );
}

export default Registry;
