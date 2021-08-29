import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import MenuIcon from "@material-ui/icons/Menu";
import { makeStyles } from "@material-ui/styles";
import * as React from "react";
import { useState } from "react";
import { Route, Switch } from "react-router-dom";
import Home from "../../Screens/Home";
import Login from "../../Screens/Login";
import Database from "../../Screens/Search/Database";
import Registry from "../../Screens/Registry";
import Users from "../../Screens/Test";
import Sidebar from "./Navigation/Sidebar";
const drawerWidth = 200;

/*** Material-UI Styles ***/
const useStyles = makeStyles((theme) => ({
  
}));

function Interface(props) {
  /*** Material-UI Styles ***/
  const classes = useStyles();

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Регистр пациентов
          </Typography>
        </Toolbar>
      </AppBar>
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }} aria-label="Menu actions">
        <Sidebar />
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
        <Toolbar />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/search">
            <Database />
          </Route>
          <Route path="/registry">
            <Registry />
          </Route>
        </Switch>
      </Box>
    </Box>
  );
}

export default Interface;
