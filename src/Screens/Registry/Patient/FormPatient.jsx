
import { Grid, MenuItem, Switch, TextField, Typography } from "@material-ui/core";
import { DatePicker, LocalizationProvider } from "@material-ui/lab";
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";
import ruLocale from "date-fns/locale/ru";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { alpha, styled } from "@mui/material/styles";
import SpecTextField from "../../../Components/SpecTextField";

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


function FormPatient() {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext();

  /* React Hook Form - Watch */
  const depTrue = watch("orginization");

  return (
    <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={1}>
      <Grid item md={7} sm={7} xs={12}>
        <Controller
          control={control}
          name="ambulatoryNumber"
          rules={{ required: "Обязательное поле" }}
          render={({ field }) => (
            <SpecTextField
              {...field}
              fullWidth
              key="Confirmation Code"
              id="Ambulatory ID-TextField"
              label="Амбуляторный ID"
              color="primary"
              error={errors.ambulatoryNumber ? true : false}
              helperText={errors?.ambulatoryNumber && errors.ambulatoryNumber.message}
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
            name="dateBirth"
            control={control}
            rules={{ required: "Обязательное поле" }}
            render={({ field: { ref, ...rest } }) => (
              <DatePicker
                {...rest}
                defaultChecked={false}
                id="dateBirth-id"
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
                    error={errors.dateBirth ? true : false}
                    helperText={errors?.dateBirth && errors.dateBirth.message}
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
              helperText={errors?.orginization ? errors.orginization.message : "Отделение указывается только для РНПЦ ОМР им.Александрова"}
            />
          )}
        />
      </Grid>
      {depTrue === "РНПЦ ОМР им.Александрова" && (
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
      )}
      <Grid item md={4} sm={4} xs={12}>
        <Controller
          control={control}
          name="firstName"
          rules={{ required: "Обязательное поле" }}
          render={({ field }) => (
            <SpecTextField
              {...field}
              fullWidth
              id="First name-TextField"
              label="Имя"
              error={errors.firstName ? true : false}
              helperText={errors?.firstName && errors.firstName.message}
            />
          )}
        />
      </Grid>
      <Grid item md={4} sm={4} xs={12}>
        <Controller
          control={control}
          name="lastName"
          rules={{ required: "Обязательное поле" }}
          render={({ field }) => (
            <SpecTextField
              {...field}
              fullWidth
              id="Last name ID-TextField"
              label="Фамилия"
              error={errors.lastName ? true : false}
              helperText={errors?.lastName && errors.lastName.message}
            />
          )}
        />
      </Grid>
      <Grid item md={4} sm={4} xs={12}>
        <Controller
          control={control}
          name="middleName"
          rules={{ required: "Обязательное поле" }}
          render={({ field }) => (
            <SpecTextField
              {...field}
              fullWidth
              id="Middle name-TextField"
              label="Отчество"
              error={errors.middleName ? true : false}
              helperText={errors?.middleName && errors.middleName.message}
            />
          )}
        />
      </Grid>
      <Grid item md={12} sm={12} xs={12}>
        <Typography pl={2} variant="h6">
          Адрес
        </Typography>
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
    </Grid>
  );
}

export default FormPatient;
