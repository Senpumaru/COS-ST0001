import { faEdit, faUserMd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Avatar,
  Card,
  CardHeader,
  CircularProgress,
  Divider,
  IconButton,
  List,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@material-ui/core";
import { MoreVert } from "@material-ui/icons";
import { Box } from "@material-ui/system";
import React from "react";
import { useSelector } from "react-redux";
import { Link, useRouteMatch, Route } from "react-router-dom";
import PatientAutocomplete from "../../Components/Fields/PatientAutocomplete";
import PatientSearchField from "../../Components/Fields/PatientSearchField";

function PatientCard(props) {
  const { personData } = props;

  let { path, url } = useRouteMatch();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box pt={1}>
      <Card key={personData.uuid}>
        <CardHeader
          avatar={
            <Avatar>
              {personData.last_name[0]}
              {personData.first_name[0]}
            </Avatar>
          }
          action={
            <React.Fragment>
              <IconButton
                aria-label="more"
                id="long-button"
                aria-controls="long-menu"
                aria-expanded={open ? "true" : undefined}
                aria-haspopup="true"
                onClick={handleClick}
              >
                <MoreVert />
              </IconButton>

              <Menu
                id="Patient-Menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <MenuItem
                  component={Link}
                  to={{ pathname: `${url}/${personData.uuid}/edit`, state: `${personData.uuid}` }}
                >
                  <ListItemIcon>
                    <FontAwesomeIcon icon={faEdit} />
                  </ListItemIcon>
                  <ListItemText>????????????????</ListItemText>
                </MenuItem>
                <Divider />

                <MenuItem component={Link} to={`${url}/${personData.uuid}`}>
                  <ListItemIcon>
                    <FontAwesomeIcon icon={faUserMd} />
                  </ListItemIcon>
                  <ListItemText>????????????????</ListItemText>
                </MenuItem>
              </Menu>
            </React.Fragment>
          }
          title={
            <Typography>
              ??????: {personData.last_name} {personData.first_name} {personData.middle_name}
            </Typography>
          }
          subheader={<Typography>???????? ????????????????: {personData.date_of_birth}</Typography>}
        ></CardHeader>
      </Card>
    </Box>
  );
}

function PatientSearch() {
  const { Data, Loading, Error, Success } = useSelector((state) => state.Patients.List);

  return (
    <React.Fragment>
      <Typography variant="h5">?????????? ????????????????</Typography>
      <Box pt={1}>
        <PatientSearchField />
      </Box>
      {Loading ? (
        <div style={{ paddingTop: 4, display: "flex", justifyContent: "center" }}>
          <CircularProgress size={60} thickness={3.2} color="secondary" />
        </div>
      ) : (
        <List>
          {Data.map((person) => (
            <PatientCard personData={person} key={person.uuid} />
          ))}
        </List>
      )}
    </React.Fragment>
  );
}

export default PatientSearch;
