import { Checkbox, Grid, TextField, Typography } from "@material-ui/core";
import React from "react";
import { Controller, useForm, useFormContext } from "react-hook-form";
import { connect, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { createPatient } from "../../../Store/Slices/patientSlice";

export const FormStep3 = () => {
  const { getValues } = useFormContext();
  
  return (
    <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={1}>
      <Grid item md={12} sm={12} xs={12}>
      Имя: {getValues("firstName")}
      <br/>
      Фамилия:{getValues("lastName")} 
      <br/>
      и т.д.
      </Grid>
    </Grid>
  );
};

export default FormStep3;
