import CloseIcon from "@mui/icons-material/Close";
import { Button, Grid, IconButton, MenuItem, Typography } from "@material-ui/core";
import { styled } from "@material-ui/styles";
import { Box } from "@material-ui/system";
import { Alert, CircularProgress, Fade, TextField } from "@mui/material";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useRouteMatch, useHistory } from "react-router-dom";
import { UpdateReset, detailPatient, updatePatient } from "../../../Store/Slices/patientSlice";
import { DatePicker, LocalizationProvider } from "@material-ui/lab";
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";
import ruLocale from "date-fns/locale/ru";
import SpecTextField from "../../../Components/SpecTextField";

const BASE_URL = "http://localhost/api/ST0001";

const GENDER = [
  {
    value: "Male",
    label: "М",
  },
  {
    value: "Female",
    label: "Ж",
  },
];

function PatientUpdate() {
  const history = useHistory();
  const uuid = history.location.state;

  /* Redux Toolkit */
  const dispatch = useDispatch();

  const { Data: DataDetails, Loading: LoadingDetails } = useSelector((state) => state.Patients.Details);
  const { Data: DataUpdate, Loading: LoadingUpdate, Error, Success } = useSelector((state) => state.Patients.Update);

  /*** React Hook Form ***/
  /* React Hook Form - Defaults */

  const defaultValues = {
    id_ambulatory: "",
    orginization: "",
    department: "",
    gender: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    date_of_birth: null,
    country: "",
    city: "",
    street: "",
    house: "",
    flat: "",
  };

  /* React Hook Form - Submit */
  const onSubmit = (sentData) => {
    // Data Modification
    sentData["uuid"] = DataDetails["uuid"];
    sentData["date_of_birth"] = moment(sentData["date_of_birth"]).format("YYYY-MM-DD");
    console.log(sentData);
    // React Hook Form Data Dispatch
    dispatch(updatePatient(sentData));
    setOpenAlert(true);
  };

  /* React Hook Form - Form */
  const methods = useForm({
    shouldUnregister: false,
    defaultValues,
    mode: "onSubmit",
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    getValues,
    reset,
    trigger,
  } = methods;

  /* React Hook Form - Set Values */
  useEffect(() => {
    if (!DataDetails || DataDetails.uuid !== uuid) {
      dispatch(detailPatient(uuid));
    } else {
      setValue("id_ambulatory", DataDetails["id_ambulatory"]);
      setValue("orginization", DataDetails["orginization"]);
      setValue("department", DataDetails["department"]);
      setValue("gender", DataDetails["gender"]);
      setValue("first_name", DataDetails["first_name"]);
      setValue("middle_name", DataDetails["middle_name"]);
      setValue("last_name", DataDetails["last_name"]);
      setValue("date_of_birth", moment(DataDetails["date_of_birth"], "YYYY-MM-DD").toDate());
      setValue("country", DataDetails["country"]);
      setValue("city", DataDetails["city"]);
      setValue("street", DataDetails["street"]);
      setValue("house", DataDetails["house"]);
      setValue("flat", DataDetails["flat"]);
    }
  }, [dispatch, DataDetails, DataUpdate]);

  /*** Alert ***/
  const [openAlert, setOpenAlert] = useState(false);

  return (
    <React.Fragment>
      <Box
        sx={{
          pl: 1,
          borderLeft: "0.2rem solid #f9a825",
          borderTop: "0.2rem solid #f9a825",
          width: "20rem",
          flexGrow: 1,
        }}
      >
        <Typography variant="h4">Обновлеие пациента</Typography>
      </Box>
      <Typography variant="h6">Личная информация</Typography>
      {LoadingDetails || LoadingUpdate ? (
        <div style={{ paddingTop: 4, display: "flex", justifyContent: "center" }}>
          <CircularProgress size={90} thickness={3.2} color="secondary" />
        </div>
      ) : (
        <Box pt={1}>
          <form>
            <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={1}>
              <Grid item md={7} sm={7} xs={12}>
                <Controller
                  control={control}
                  name="id_ambulatory"
                  rules={{ required: "Обязательное поле" }}
                  render={({ field }) => (
                    <SpecTextField
                      {...field}
                      fullWidth
                      key="Confirmation Code"
                      id="Ambulatory ID-TextField"
                      label="Амбуляторный ID"
                      color="primary"
                      error={errors.id_ambulatory ? true : false}
                      helperText={errors?.id_ambulatory && errors.id_ambulatory.message}
                    />
                  )}
                />
              </Grid>
              <Grid item md={2} sm={2} xs={2}>
                <Controller
                  control={control}
                  name="gender"
                  rules={{ required: "Обязательное поле" }}
                  render={({ field }) => (
                    <SpecTextField
                      {...field}
                      fullWidth
                      select
                      id="Gender-TextField"
                      label="Пол"
                      error={errors.gender ? true : false}
                      helperText={errors?.gender && errors.gender.message}
                    >
                      {GENDER.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </SpecTextField>
                  )}
                />
              </Grid>
              <Grid item md={3} sm={3} xs={3}>
                <LocalizationProvider dateAdapter={AdapterDateFns} locale={ruLocale}>
                  <Controller
                    name="date_of_birth"
                    control={control}
                    rules={{ required: "Обязательное поле" }}
                    render={({ field: { ref, ...rest } }) => (
                      <DatePicker
                        {...rest}
                        defaultChecked={false}
                        id="date_of_birth-id"
                        label="Дата рождения"
                        inputFormat="dd/MM/yyyy"
                        maxDate={new Date()}
                        variant="inline"
                        inputVariant="outlined"
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        renderInput={(params) => (
                          <SpecTextField
                            {...params}
                            error={errors.date_of_birth ? true : false}
                            helperText={errors?.date_of_birth && errors.date_of_birth.message}
                          />
                        )}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item md={12} sm={12} xs={12}>
                <Controller
                  control={control}
                  name="orginization"
                  rules={{ required: "Обязательное поле" }}
                  render={({ field }) => (
                    <SpecTextField
                      {...field}
                      fullWidth
                      id="Orginization-TextField"
                      label="Организация"
                      error={errors.orginization ? true : false}
                      helperText={
                        errors?.orginization
                          ? errors.orginization.message
                          : "Отделение указывается только для РНПЦ ОМР им.Александрова"
                      }
                    />
                  )}
                />
              </Grid>

              <Grid item md={12} sm={12} xs={12}>
                <Controller
                  control={control}
                  name="department"
                  render={({ field }) => (
                    <SpecTextField
                      {...field}
                      fullWidth
                      id="Department-TextField"
                      label="Отделение"
                      error={errors.department ? true : false}
                      helperText={errors?.department && errors.department.message}
                    />
                  )}
                />
              </Grid>

              <Grid item md={4} sm={4} xs={12}>
                <Controller
                  control={control}
                  name="first_name"
                  rules={{ required: "Обязательное поле" }}
                  render={({ field }) => (
                    <SpecTextField
                      {...field}
                      fullWidth
                      id="First name-TextField"
                      label="Имя"
                      error={errors.first_name ? true : false}
                      helperText={errors?.first_name && errors.first_name.message}
                    />
                  )}
                />
              </Grid>
              <Grid item md={4} sm={4} xs={12}>
                <Controller
                  control={control}
                  name="last_name"
                  rules={{ required: "Обязательное поле" }}
                  render={({ field }) => (
                    <SpecTextField
                      {...field}
                      fullWidth
                      id="Last name ID-TextField"
                      label="Фамилия"
                      error={errors.last_name ? true : false}
                      helperText={errors?.last_name && errors.last_name.message}
                    />
                  )}
                />
              </Grid>
              <Grid item md={4} sm={4} xs={12}>
                <Controller
                  control={control}
                  name="middle_name"
                  rules={{ required: "Обязательное поле" }}
                  render={({ field }) => (
                    <SpecTextField
                      {...field}
                      fullWidth
                      id="Middle name-TextField"
                      label="Отчество"
                      error={errors.middle_name ? true : false}
                      helperText={errors?.middle_name && errors.middle_name.message}
                    />
                  )}
                />
              </Grid>
              <Grid item md={12} sm={12} xs={12}>
                <Typography variant="h6">Адрес</Typography>
              </Grid>
              <Grid item md={6} sm={6} xs={12}>
                <Controller
                  control={control}
                  name="country"
                  rules={{ required: "Обязательное поле" }}
                  render={({ field }) => (
                    <SpecTextField
                      {...field}
                      fullWidth
                      id="Country-TextField"
                      label="Страна"
                      error={errors.country ? true : false}
                      helperText={errors?.country && errors.country.message}
                    />
                  )}
                />
              </Grid>
              <Grid item md={6} sm={6} xs={12}>
                <Controller
                  control={control}
                  name="city"
                  rules={{ required: "Обязательное поле" }}
                  render={({ field }) => (
                    <SpecTextField
                      {...field}
                      fullWidth
                      id="Country-TextField"
                      label="Город"
                      error={errors.city ? true : false}
                      helperText={errors?.city && errors.city.message}
                    />
                  )}
                />
              </Grid>
              <Grid item md={8} sm={8} xs={12}>
                <Controller
                  control={control}
                  name="street"
                  rules={{ required: false }}
                  render={({ field }) => (
                    <SpecTextField
                      {...field}
                      fullWidth
                      id="Street-TextField"
                      label="Улица"
                      error={errors.street ? true : false}
                      helperText={errors?.street && errors.street.message}
                    />
                  )}
                />
              </Grid>
              <Grid item md={2} sm={2} xs={6}>
                <Controller
                  control={control}
                  name="house"
                  rules={{ required: false }}
                  render={({ field }) => (
                    <SpecTextField
                      {...field}
                      fullWidth
                      id="Home-TextField"
                      inputProps={{ min: 1, max: 1000, type: "number" }}
                      label="Дом"
                      error={errors.house ? true : false}
                      helperText={errors?.house && errors.house.message}
                    />
                  )}
                />
              </Grid>
              <Grid item md={2} sm={2} xs={6}>
                <Controller
                  control={control}
                  name="flat"
                  rules={{ required: false }}
                  render={({ field }) => (
                    <SpecTextField
                      {...field}
                      fullWidth
                      id="Flat-TextField"
                      inputProps={{ min: 1, max: 1000, type: "number" }}
                      label="Квартира"
                      error={errors.flat ? true : false}
                      helperText={errors?.flat && errors.flat.message}
                    />
                  )}
                />
              </Grid>
              <Grid item>
                <Button variant="contained" color="primary" onClick={handleSubmit(onSubmit)}>
                  Обновить
                </Button>
              </Grid>
            </Grid>
          </form>

          {/* Errors */}
          <Box pt={2}>
            {Error && (
              <Fade timeout={1000} in={openAlert}>
                <Alert
                  action={
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={() => {
                        dispatch(UpdateReset());
                        setOpenAlert(false);
                      }}
                    >
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  }
                  severity="error"
                  color="error"
                >
                  {typeof Error === "object" ? (
                    Object.entries(Error).map(([key, value]) => {
                      return <Typography key={key}>{Error[key]}</Typography>;
                    })
                  ) : (
                    <Typography>{Error}</Typography>
                  )}
                </Alert>
              </Fade>
            )}

            {Success && (
              <Fade timeout={1000} in={openAlert}>
                <Alert
                  action={
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={() => {
                        dispatch(UpdateReset());
                        setOpenAlert(false);
                      }}
                    >
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  }
                  severity="success"
                >
                  {Success.success}
                </Alert>
              </Fade>
            )}
          </Box>
        </Box>
      )}
    </React.Fragment>
  );
}

export default PatientUpdate;
