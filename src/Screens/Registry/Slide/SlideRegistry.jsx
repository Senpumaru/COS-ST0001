import { Box, Button, Tab, Tabs, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useRouteMatch } from "react-router";
import { Link } from "react-router-dom";

function SlideRegistry() {
    let { path, url } = useRouteMatch();

  const [value, setValue] = useState("one");

  const handleTabs = (tab, newTab) => {
    setValue(newTab);
  };

  return (
    <Box sx={{ flexGrow: 1,pb:2 }}>
      <Typography variant="h6">Тип регистрации</Typography>
      <Tabs value={value} onChange={handleTabs} aria-label="Tabs">
        <Tab component={Link} to={`${url}/group`} value="one" label="МП Группа" />
        <Tab component={Link} to={`${url}/blocks`} value="two" label="МП" />
      </Tabs>

      
    </Box>
  );
}

export default SlideRegistry
