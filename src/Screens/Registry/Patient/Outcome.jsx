import { Box, Checkbox, Grid, Paper, TextField, Typography } from "@material-ui/core";
import React from "react";
import { Controller, useForm, useFormContext } from "react-hook-form";
import { connect, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { createPatient } from "../../../Store/Slices/patientSlice";

export const Outcome = () => {
  const { getValues } = useFormContext();
  

  return (
    <React.Fragment>
      <Typography>Итоговые данные</Typography>
      <Paper elevation={12}>
        <Box p={2} m={1}>
          <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={1}>
            <Grid item md={12} sm={12} xs={12}>
              <Box
                sx={{
                  pl: 1,
                  borderLeft: "0.2rem solid #f57f17",
                  borderTop: "0.2rem solid #f57f17",

                  flexGrow: 1,
                }}
              >
                Амбульяторный ID: {getValues("ambulatoryNumber")}
              </Box>
            </Grid>
            <Grid item md={4} sm={4} xs={12}>
              Имя: {getValues("firstName")}
            </Grid>
            <Grid item md={4} sm={4} xs={12}>
              Фамилия: {getValues("lastName")}
            </Grid>
            <Grid item md={4} sm={4} xs={12}>
              Отчество: {getValues("middleName")}
            </Grid>
            <Grid item md={12} sm={12} xs={12}>
              <Box
                sx={{
                  pl: 1,
                  borderLeft: "0.2rem solid #f57f17",
                  borderTop: "0.2rem solid #f57f17",

                  flexGrow: 1,
                }}
              >
                Организация: {getValues("orginization")}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </React.Fragment>
  );
};

export default Outcome;
