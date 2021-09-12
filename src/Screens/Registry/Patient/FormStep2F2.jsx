import { Button, Grid, Paper, TextField, Typography } from "@material-ui/core";
import { DatePicker, LocalizationProvider } from "@material-ui/lab";
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";
import ruLocale from "date-fns/locale/ru";
import moment from "moment";
import React from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";

function FormStep2F2() {
  /*** React Hook Form ***/
  const {
    control,
    watch,
    formState: { errors },
    reset,
    getValues,
    setValue,
  } = useFormContext();

  /* React Hook Form - Watch*/
  const watchBlockGroupCode = watch("blockGroupCode");
  const watchBlockGroupCount = watch("blockGroupCount");
  const watchBlockGroupYear = watch("blockGroupYear");

  /*** Functions ***/

  /* BlockGroup Function */
  function blockGroup() {
    const groupStartCode = parseFloat(watchBlockGroupCode);

    // Check for NaN
    var groupAmount = 1;
    if (parseFloat(watchBlockGroupCount) > 0) {
      groupAmount = parseFloat(watchBlockGroupCount);
    }
    const groupYear = String(moment(watchBlockGroupYear).format("YYYY")).slice(-2);
    const groupLastCode = groupStartCode + groupAmount - 1;
    setValue("blockGroupLastCode", groupLastCode);
    const range = [...Array(groupAmount)].map((_, i) => i + groupStartCode);

    const groupCode = String(groupStartCode) + "-" + String(groupLastCode).slice(-2) + "/" + groupYear;

    return { groupStartCode, groupLastCode, groupCode, groupAmount, groupYear };
  }

  return (
    <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={1}>
      <Grid item md={12} sm={12} xs={12}>
        <Controller
          control={control}
          name="organ"
          rules={false}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              id="Organ-TextField"
              label="Орган"
              color="secondary"
              error={errors.organ ? true : false}
              helperText={errors?.organ && errors.organ.message}
            />
          )}
        />
      </Grid>
      
      <Grid item md={4} sm={4} xs={12}>
        <Controller
          name={"blockGroupCode"}
          control={control}
          mode="onSubmit"
          defaultValue={""}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              inputProps={{ min: 1, max: 1000000, type: "number" }}
              label="Начальный номер"
              variant="outlined"
              error={!!errors.blockGroupCode}
              helperText={errors.blockGroupCode?.message}
            />
          )}
          rules={{
            
            max: {
              value: 1000000,
              message: "Слишком большое число",
            },
            
          }}
        />
      </Grid>
      <Grid item md={1} sm={1} xs={1}>
        <Controller
          rules={false}
          name="blockGroupCount"
          control={control}
          mode="onBlur"
          defaultValue={1}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              inputProps={{ min: 1, max: 100, type: "number" }}
              label="Кол."
              variant="outlined"
              error={!!errors.blockGroupCount}
              helperText={errors.blockGroupCount?.message}
            />
          )}
        />
      </Grid>
      <Grid item md={2} sm={2} xs={2}>
        <LocalizationProvider dateAdapter={AdapterDateFns} locale={ruLocale}>
          <Controller
            name={"blockGroupYear"}
            defaultValue={new Date()}
            control={control}
            rules={false}
            render={({ field: { ref, ...rest } }) => (
              <DatePicker
                {...rest}
                views={["year"]}
                defaultChecked={false}
                id="blockGroupYear-id"
                label="Год"
                maxDate={new Date()}
                variant="inline"
                inputVariant="outlined"
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
                renderInput={(params) => (
                  <TextField {...params} error={!!errors.blockGroupYear} helperText={errors.blockGroupYear?.message} />
                )}
              />
            )}
          />
        </LocalizationProvider>
      </Grid>
      <Grid item md={5} sm={5} xs={12}>
        <TextField
          fullWidth
          label="Блок группа"
          variant="outlined"
          value={blockGroup().groupStartCode === "" ? "" : blockGroup().groupCode}
          InputProps={{
            readOnly: true,
          }}
        />
      </Grid>
    </Grid>
  );
}

export default FormStep2F2;
