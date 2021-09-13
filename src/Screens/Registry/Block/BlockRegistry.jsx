import { Box, Tab, Tabs, Typography } from "@material-ui/core";
import React, { useState } from "react";
import { Link, Route, Switch, useRouteMatch } from "react-router-dom";
import FormBlocks from "./FormBlocks";


function BlockRegistry() {
  let { path, url } = useRouteMatch();

  const [value, setValue] = useState("two");

  const handleTabs = (tab, newTab) => {
    setValue(newTab);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h6">Тип регистрации</Typography>
      <Tabs value={value} onChange={handleTabs} aria-label="Tabs">
        {/* <Tab component={Link} to={`${url}/group`} value="one" label="Группа Блоков" /> */}
        <Tab component={Link} to={`${url}/blocks`} value="two" label="Блоки" />
      </Tabs>
      <Box pt={1}>
        <Switch>
          <Route path={`${url}/group`}>
            <FormBlocks />
          </Route>
          <Route path={`${url}/blocks`}>
            <FormBlocks />
          </Route>
        </Switch>
      </Box>
    </Box>
  );
}

export default BlockRegistry;
