import { Box, Checkbox, Grid, Paper, TextField, Typography } from "@material-ui/core";
import React from "react";
import { Controller, useForm, useFormContext } from "react-hook-form";
import { connect, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { createPatient } from "../../../Store/Slices/patientSlice";

export const FormStep3 = () => {
  const { getValues } = useFormContext();

  return (
    <React.Fragment>
      <Typography>Итоговые данные</Typography>
      <Paper elevation={12}>
        <Box p={2} m={1}>
        <Grid container direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
          <Grid xs={4} item>Имя: {getValues("firstName")}</Grid>
          <Grid xs={4} item>Фамилия: {getValues("lastName")}</Grid>
          <Grid xs={4} item>Отчество: {getValues("middleName")}</Grid>
        </Grid>
        </Box>
      </Paper>
    </React.Fragment>
  );
};

export default FormStep3;
