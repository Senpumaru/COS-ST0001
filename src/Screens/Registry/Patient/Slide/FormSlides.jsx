import { Button, Grid, Paper, TextField, Typography } from "@material-ui/core";
import { DatePicker, LocalizationProvider } from "@material-ui/lab";
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";
import ruLocale from "date-fns/locale/ru";
import moment from "moment";
import React from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { alpha, styled } from "@mui/material/styles";
import SpecTextField from "../../../../Components/SpecTextField";

export const FormSlides = () => {
  /*** React Hook Form ***/
  const {
    control,
    watch,
    formState: { errors },
    reset,
    getValues,
    setValue,
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "slideCodes",
  });

  /* React Hook Form - Watch*/
  const watchCodes = watch("slideCodes");

  /*** Functions ***/

  /* Slide Function */
  function slideGroup(index) {
    const codeYear = String(moment(watchCodes[index]["year"]).format("YYYY")).slice(-2);
    const slideEndCode = parseFloat(watchCodes[index]["startCode"]) + parseFloat(watchCodes[index]["amount"]);
    const slideCode = String(watchCodes[index]["startCode"]) + "-" + String(slideEndCode).slice(-2) + "/" + codeYear;
    watchCodes[index]["code"] = slideCode;
    return { slideEndCode, slideCode };
  }

  return (
    <Grid container pt={1} direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={1}>
      {fields.map((item, index) => {
        return (
          <Grid key={item.id} container spacing={1} item md={12} sm={12} xs={12}>
            <React.Fragment>
              <Grid item md={12} sm={12} xs={12}>
                <Controller
                  control={control}
                  name={`slideCodes[${index}].organ`}
                  rules={{ required: "Обязательное поле" }}
                  render={({ field }) => (
                    <SpecTextField
                      {...field}
                      fullWidth
                      id="Organ-SpecTextField"
                      label="Орган"
                      color="secondary"
                      error={errors.organ ? true : false}
                      helperText={errors?.organ && errors.organ.message}
                    />
                  )}
                />
              </Grid>
              <Grid item md={12} sm={12} xs={12}>
                <Controller
                  control={control}
                  name={`slideCodes[${index}].department`}
                  rules={{ required: "Обязательное поле" }}
                  render={({ field }) => (
                    <SpecTextField
                      {...field}
                      fullWidth
                      id="Department-SpecTextField"
                      label="Отделение"
                      color="secondary"
                      error={errors.department ? true : false}
                      helperText={errors?.department && errors.department.message}
                    />
                  )}
                />
              </Grid>
              <Grid item md={4} sm={4} xs={4}>
                <Controller
                  rules={{ required: "Обязательное поле" }}
                  name={`slideCodes[${index}].startCode`}
                  control={control}
                  mode="onBlur"
                  defaultValue={1}
                  render={({ field }) => (
                    <SpecTextField
                      {...field}
                      fullWidth
                      inputProps={{ min: 1, max: 1000000, type: "number" }}
                      label="Начальный номер МП"
                      variant="outlined"
                      error={!!errors.slideCodes?.[index]?.code}
                      helperText={errors.slideCodes?.[index]?.code?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item md={2} sm={2} xs={2}>
                <Controller
                  rules={{ required: "Обязательное поле" }}
                  name={`slideCodes[${index}].amount`}
                  control={control}
                  mode="onBlur"
                  defaultValue={1}
                  render={({ field }) => (
                    <SpecTextField
                      {...field}
                      fullWidth
                      inputProps={{ min: 1, max: 100000, type: "number" }}
                      label="Куски."
                      variant="outlined"
                      error={!!errors.slideCodes?.[index]?.amount}
                      helperText={errors.slideCodes?.[index]?.amount?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item md={2} sm={2} xs={2}>
                <LocalizationProvider dateAdapter={AdapterDateFns} locale={ruLocale}>
                  <Controller
                    name={`slideCodes[${index}].year`}
                    defaultValue={new Date()}
                    control={control}
                    rules={{ required: "Обязательное поле" }}
                    render={({ field: { ref, ...rest } }) => (
                      <DatePicker
                        {...rest}
                        views={["year"]}
                        defaultChecked={false}
                        id="slideGroupYear-id"
                        label="Год"
                        maxDate={new Date()}
                        variant="inline"
                        inputVariant="outlined"
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        renderInput={(params) => (
                          <SpecTextField
                            {...params}
                            error={!!errors.slideGroupYear}
                            helperText={errors.slideGroupYear?.message}
                          />
                        )}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item md={4} sm={4} xs={4}>
                <SpecTextField
                  fullWidth
                  value={slideGroup(index).slideEndCode}
                  InputProps={{
                    readOnly: true,
                  }}
                  label="Конечный номер"
                  variant="outlined"
                />
              </Grid>
              <Grid item md={12} sm={12} xs={12}>
                <SpecTextField
                  fullWidth
                  value={slideGroup(index).slideCode}
                  InputProps={{
                    readOnly: true,
                  }}
                  label="Блок группа"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <Button onClick={() => remove(index)}>Удалить</Button>
              </Grid>
            </React.Fragment>
          </Grid>
        );
      })}
      <Grid container p={1} spacing={2}>
        <Grid item md={6}>
          <Button
            color="secondary"
            variant="contained"
            onClick={() => {
              reset({ ...getValues(), slideCodes: [] });
            }}
          >
            Сброс
          </Button>
        </Grid>

        <Grid item md={6}>
          <Button
            variant="outlined"
            onClick={() => {
              append({ code: "" }, { amount: "" }, { year: "" });
            }}
          >
            Добавить
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default FormSlides;
