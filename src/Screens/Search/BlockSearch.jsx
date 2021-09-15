import { faEdit, faUserMd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Avatar,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  Grid,
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
import BlockSearchField from "../../Components/Fields/BlockSearchField";
import PatientAutocomplete from "../../Components/Fields/PatientAutocomplete";

function BlockCard(props) {
  const { blockData } = props;

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
      <Card key={blockData.uuid}>
        <CardHeader
          avatar={<Avatar></Avatar>}
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
                  to={{ pathname: `${url}/${blockData.uuid}/edit`, state: `${blockData.uuid}` }}
                >
                  <ListItemIcon>
                    <FontAwesomeIcon icon={faEdit} />
                  </ListItemIcon>
                  <ListItemText>Изменить</ListItemText>
                </MenuItem>
                <Divider />

                <MenuItem component={Link} to={`${url}/${blockData.uuid}`}>
                  <ListItemIcon>
                    <FontAwesomeIcon icon={faUserMd} />
                  </ListItemIcon>
                  <ListItemText>Просмотр</ListItemText>
                </MenuItem>
              </Menu>
            </React.Fragment>
          }
          title={
            <Box>
              <Typography>
                ФИО: {blockData.patient.last_name} {blockData.patient.first_name} {blockData.patient.middle_name}
              </Typography>
              <Typography>Амбуляторный ID:{blockData.patient.id_ambulatory}</Typography>
            </Box>
          }
          subheader={
            blockData.block_group ? (
              <Typography>Блок группа: {blockData.block_group}</Typography>
            ) : (
              <Alert sx={{ fontSize: 14, padding: 0, paddingLeft: 1 }} severity="info">
                Блок группа отсутсвует
              </Alert>
            )
          }
        ></CardHeader>
        <CardContent>
          <Box pl={2}>
            <Grid container spacing={0}>
              <Grid item xs={12}>
                <MenuItem>Блок: {blockData.code}</MenuItem>
              </Grid>
              <Grid p={0} m={0} item xs={12}>
                <Accordion sx={{}}>
                  <AccordionSummary sx={{ fontSize:14, backgroundColor: "#f9a825" }}>Микропрепараты</AccordionSummary>
                  <AccordionDetails sx={{ padding: 0 }}>
                    <Grid item xs={4}>
                      {blockData.slides.map((slide) => (
                        <MenuItem key={slide.uuid}>{slide.code}</MenuItem>
                      ))}
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

function BlockSearch() {
  const { Data, Loading, Error, Success } = useSelector((state) => state.Blocks.List);
  console.log(Data);

  return (
    <React.Fragment>
      <Typography variant="h5">Поиск блоков</Typography>
      <Box pt={1}>
        <BlockSearchField />
      </Box>
      {Loading ? (
        <div style={{ paddingTop: 4, display: "flex", justifyContent: "center" }}>
          <CircularProgress size={90} thickness={3.2} color="secondary" />
        </div>
      ) : (
        <List>
          {Data.map((block) => (
            <BlockCard blockData={block} key={block.uuid} />
          ))}
        </List>
      )}
    </React.Fragment>
  );
}

export default BlockSearch;
