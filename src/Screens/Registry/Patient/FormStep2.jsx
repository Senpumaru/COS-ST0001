import { Button, Grid, TextField, Typography } from "@material-ui/core";
import { DatePicker, LocalizationProvider } from "@material-ui/lab";
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";
import ruLocale from "date-fns/locale/ru";
import moment from "moment";
import React from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";

export const FormStep2 = () => {
  /* React Hook Form */
  const {
    control,
    watch,
    formState: { errors },
    reset,
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "blockGroupCodes",
  });

  const watchCodes = watch("blockGroupCodes"); // Watch data

  // BlockGroup Function

  function codeGroup(index) {
    const startCode = watchCodes[index].code;
    const amount = watchCodes[index].amount;
    const year = String(moment(watchCodes[index].year).format("YYYY")).slice(-2);
    const lastCode = parseFloat(startCode) + parseFloat(amount) - 1;
    const groupCode = String(startCode) + "-" + String(lastCode).slice(-2) + "/" + year;
    return {startCode, groupCode};
    
  }

  return (
    <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={1}>
      <Typography>На основании блоков автоматически будут созданы соответсвующие МП</Typography>
      {fields.map((item, index) => {
        return (
          <Grid key={item.id} container spacing={1} item md={12} sm={12} xs={12}>
            <React.Fragment>
              <Grid item md={6} sm={6} xs={6}>
                <Controller
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      inputProps={{ min: 0, max: 10000000, type: "number" }}
                      label="Номер первого блока"
                      variant="outlined"
                      error={!!errors.blockGroupCodes?.[index]?.code}
                      helperText={errors.blockGroupCodes?.[index]?.code?.message}
                    />
                  )}
                  rules={{ required: "Обязательное поле" }}
                  name={`blockGroupCodes[${index}].code`}
                  control={control}
                  mode="onBlur"
                  defaultValue={item.code}
                />
              </Grid>
              <Grid item md={2} sm={2} xs={2}>
                <Controller
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      inputProps={{ min: 1, max: 100, type: "number" }}
                      label="Кол."
                      variant="outlined"
                      error={!!errors.blockGroupCodes?.[index]?.amount}
                      helperText={errors.blockGroupCodes?.[index]?.amount?.message}
                    />
                  )}
                  rules={{ required: "Обязательное поле" }}
                  name={`blockGroupCodes[${index}].amount`}
                  control={control}
                  mode="onBlur"
                  defaultValue={1}
                />
              </Grid>
              <Grid item md={2} sm={2} xs={2}>
                <LocalizationProvider dateAdapter={AdapterDateFns} locale={ruLocale}>
                  <Controller
                    name={`blockGroupCodes[${index}].year`}
                    defaultValue={new Date()}
                    control={control}
                    rules={{ required: "Обязательное поле" }}
                    render={({ field: { ref, ...rest } }) => (
                      <DatePicker
                        {...rest}
                        views={["year"]}
                        defaultChecked={false}
                        id="blockYear-id"
                        label="Год"
                        maxDate={new Date()}
                        variant="inline"
                        inputVariant="outlined"
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            error={!!errors.blockGroupCodes?.[index]?.year}
                            helperText={errors.blockGroupCodes?.[index]?.year?.message}
                          />
                        )}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  value={codeGroup(index).startCode === "" ? "" : codeGroup(index).groupCode}
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
      <Grid container spacing={2}>
        <Grid item md={6}>
          <Button
            onClick={() => {
              reset({ code: "" }, { amount: "" });
            }}
          >
            Отмена
          </Button>
        </Grid>
        <Grid item md={6}>
          <Button
            onClick={() => {
              append({ code: "" }, { amount: "" });
            }}
          >
            Добавить
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default FormStep2;
