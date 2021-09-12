import { Box, Button, Tab, Tabs, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";


import { BrowserRouter as Router, Switch, Route, Link, useRouteMatch, useParams } from "react-router-dom";
import BlockForm from "./BlockForm";

function BlockRegistry() {
  let { path, url } = useRouteMatch();

  const [value, setValue] = useState("one");

  const handleTabs = (tab, newTab) => {
    setValue(newTab);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h6">Тип регистрации</Typography>
      <Tabs value={value} onChange={handleTabs} aria-label="Tabs">
        <Tab component={Link} to={`${url}/group`} value="one" label="Блок Группа" />
        <Tab component={Link} to={`${url}/blocks`} value="two" label="Блоки" />
      </Tabs>
      <Box pt={1}>
        <Switch>
          <Route path={`${url}/group`}>
            <BlockForm />
          </Route>
          <Route path={`${url}/blocks`}>
            <BlockForm />
          </Route>
        </Switch>
      </Box>
    </Box>
  );
}

export default BlockRegistry;
