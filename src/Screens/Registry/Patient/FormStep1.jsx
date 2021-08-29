import { Grid, TextField } from "@material-ui/core";
import { DatePicker, LocalizationProvider } from "@material-ui/lab";
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";
import ruLocale from "date-fns/locale/ru";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";

function FormStep1() {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  

  return (
    <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={1}>
      <Grid item md={8} sm={8} xs={12}>
        <Controller
          control={control}
          name="ambulatoryNumber"
          rules={{ required: "Обязательное поле" }}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              id="Ambulatory ID-TextField"
              label="Амбуляторный ID"
              color="secondary"
              error={errors.ambulatoryNumber ? true : false}
              helperText={errors?.ambulatoryNumber && errors.ambulatoryNumber.message}
            />
          )}
        />
      </Grid>
      <Grid item md={4} sm={4} xs={12}>
        <LocalizationProvider dateAdapter={AdapterDateFns} locale={ruLocale}>
          <Controller
            name="dateBirth"
            control={control}
            rules={{ required: "Обязательное поле"}}
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
                  <TextField
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
      <Grid item md={4} sm={4} xs={12}>
        <Controller
          control={control}
          name="firstName"
          rules={{ required: "Обязательное поле" }}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              id="First name-TextField"
              color="secondary"
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
            <TextField
              {...field}
              fullWidth
              id="Last name ID-TextField"
              color="secondary"
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
            <TextField
              {...field}
              fullWidth
              id="Middle name-TextField"
              color="secondary"
              label="Отчество"
              error={errors.middleName ? true : false}
              helperText={errors?.middleName && errors.middleName.message}
            />
          )}
        />
      </Grid>
      <Grid item md={12} sm={12} xs={12}>
        <Controller
          control={control}
          name="address"
          rules={{ required: false }}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              id="Address-TextField"
              color="secondary"
              label="Адрес"
              error={errors.address ? true : false}
              helperText={errors?.address && errors.address.message}
            />
          )}
        />
      </Grid>
    </Grid>
  );
}

export default FormStep1;
