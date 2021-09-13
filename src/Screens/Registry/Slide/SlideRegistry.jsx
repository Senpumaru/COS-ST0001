import { Box, Tab, Tabs, Typography } from "@material-ui/core";
import React, { useState } from "react";
import { Link, Route, Switch, useRouteMatch } from "react-router-dom";
import FormSlides from "./FormSlides";

function SlideRegistry() {
  let { path, url } = useRouteMatch();

  const [value, setValue] = useState("two");

  const handleTabs = (tab, newTab) => {
    setValue(newTab);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h6">Тип регистрации</Typography>
      <Tabs value={value} onChange={handleTabs} aria-label="Tabs">
        {/* <Tab component={Link} to={`${url}/group`} value="one" label="Группа МП" /> */}
        <Tab component={Link} to={`${url}/slides`} value="two" label="МП" />
      </Tabs>
      <Box pt={1}>
        <Switch>
          <Route path={`${url}/group`}>
            <FormSlides />
          </Route>
          <Route path={`${url}/slides`}>
            <FormSlides />
          </Route>
        </Switch>
      </Box>
    </Box>
  );
}

export default SlideRegistry;
