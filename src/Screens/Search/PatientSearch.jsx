import { faEdit, faUserMd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Avatar,
  Card,
  CardHeader,
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
                <MenuItem component={Link} to={{ pathname: `${url}/${personData.uuid}/edit`, state: `${personData.uuid}` }}>
                  <ListItemIcon>
                    <FontAwesomeIcon icon={faEdit} />
                  </ListItemIcon>
                  <ListItemText>Изменить</ListItemText>
                </MenuItem>
                <Divider />

                <MenuItem component={Link} to={`${url}/${personData.uuid}`}>
                  <ListItemIcon>
                    <FontAwesomeIcon icon={faUserMd} />
                  </ListItemIcon>
                  <ListItemText>Просмотр</ListItemText>
                </MenuItem>
              </Menu>
            </React.Fragment>
          }
          title={
            <Typography>
              ФИО: {personData.last_name} {personData.first_name} {personData.middle_name}
            </Typography>
          }
          subheader={<Typography>Дата рождения: {personData.date_of_birth}</Typography>}
        ></CardHeader>
      </Card>
    </Box>
  );
}

function PatientDatabase() {
  const patientsState = useSelector((state) => state.Patients.List);

  return (
    <React.Fragment>
      <Box
        sx={{
          pl: 1,
          borderLeft: "0.2rem solid #f9a825",
          borderBottom: "0.2rem solid #f9a825",
          width: "20rem",
          flexGrow: 1,
        }}
      >
        <Typography variant="h2">Система поиска</Typography>
      </Box>
      <Typography variant="h5">Поиск пациента</Typography>
      <Box pt={1}>
        <PatientAutocomplete />
      </Box>
      <List>
        {patientsState["Data"].map((person) => (
          <PatientCard personData={person} key={person.uuid} />
        ))}
      </List>
    </React.Fragment>
  );
}

export default PatientDatabase;
