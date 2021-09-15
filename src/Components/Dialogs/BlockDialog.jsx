import { Button, Dialog, DialogActions, Divider, Grid, ListItemText, MenuItem, Typography } from "@material-ui/core";
import { DialogContent, DialogTitle } from "@mui/material";
import React, { useState } from "react";
import BlockFormBlueprint from "../Forms/BlockFormBlueprint";
import COS from "../../Images/COS.png";
import { Box } from "@material-ui/system";
function BlockDialog(props) {
  const { data, open, handleClose } = props;

  return (
    <Dialog  open={open}>
      <DialogTitle sx={{ backgroundColor: "#f9a825", padding: 1 }}>
        <Box
          sx={{
            pl: 1,
            borderLeft: "0.2rem solid #455a64",
            borderTop: "0.2rem solid #455a64",
            width: "20rem",
            flexGrow: 1,
          }}
        >
          <Typography sx={{ fontWeight: 600 }}>Блок: {data["code"]}</Typography>
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent>
        {data && (
          <Grid container>
            <Grid item md={6} sm={6} xs={12}>
              <Typography>Отделение: {data["department"]}</Typography>
              <Typography>Организация: {data["orginization"]}</Typography>
              <Typography>Орган: {data["organ"]}</Typography>
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <Typography>Присвоенные МП</Typography>
              {data["slides"].map((slide) => {
                return (
                  <MenuItem>
                    <ListItemText key={slide["uuid"]}>{slide["code"]}</ListItemText>
                  </MenuItem>
                );
              })}
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Закрыть</Button>
      </DialogActions>
    </Dialog>
  );
}

export default BlockDialog;
