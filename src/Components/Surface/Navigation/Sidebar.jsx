import { Collapse, ListItemButton, ListItemIcon } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Toolbar from "@material-ui/core/Toolbar";
import { ExpandLess, ExpandMore, StarBorder } from "@material-ui/icons";
import * as React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

const drawerWidth = 200;

function Sidebar(props) {
  const { window } = props;
  const [open, setOpen] = React.useState(true);
  const handleClick = () => {
    setOpen(!open);
  };
  const container = window !== undefined ? () => window().document.body : undefined;
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const [mobileOpen, setMobileOpen] = useState(false);
  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        <ListItem button component={Link} to="/">
          <ListItemText primary="Главное меню" />
        </ListItem>
        <ListItem button component={Link} to="/search">
          <ListItemText primary="Поиск" />
        </ListItem>
        <ListItem button component={Link} to="/registry">
          <ListItemText primary="Регистрация" />
        </ListItem>
        
      </List>
      <Divider />
    </div>
  );
  return (
    <React.Fragment>
      <Drawer
        container={container}
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>
    </React.Fragment>
  );
}

export default Sidebar;
