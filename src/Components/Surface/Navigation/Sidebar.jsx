import { faElementor } from "@fortawesome/free-brands-svg-icons";
import { faFolderPlus, faSearch, faUserMd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ListItemIcon } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Toolbar from "@material-ui/core/Toolbar";
import InboxIcon from "@mui/icons-material/MoveToInbox";

import * as React from "react";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <List>
      <ListItem button component={Link} to="/">
        <ListItemIcon
          sx={{
            fontSize: 30,
            paddingLeft: "0.2rem",
            color: "success.main",
          }}
        >
          <FontAwesomeIcon icon={faElementor} />
        </ListItemIcon>
        <ListItemText primary="Главное меню" />
      </ListItem>
      <Divider />
      <ListItem button component={Link} to="/search">
        <ListItemIcon
          sx={{
            fontSize: 30,
            paddingLeft: "0.2rem",
            color: "success.main",
          }}
        >
          <FontAwesomeIcon icon={faSearch} />
        </ListItemIcon>
        <ListItemText primary="Поиск" />
      </ListItem>
      <Divider />
      <ListItem button component={Link} to="/registry/patient">
        <ListItemIcon
          sx={{
            fontSize: 30,
            paddingLeft: "0.2rem",
            color: "success.main",
          }}
        >
          <FontAwesomeIcon icon={faFolderPlus} />
        </ListItemIcon>
        <ListItemText primary="Регистрация" />
      </ListItem>
    </List>
  );
}

export default Sidebar;
