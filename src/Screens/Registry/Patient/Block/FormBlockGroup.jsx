import { Button, Grid, Paper, TextField, Typography } from "@material-ui/core";
import { DatePicker, LocalizationProvider } from "@material-ui/lab";
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";
import ruLocale from "date-fns/locale/ru";
import moment from "moment";
import React from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { alpha, styled } from "@mui/material/styles";
import { Alert } from "@mui/material";

const SpecTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "#f57f17",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#f57f17",
  },
  "& .MuiOutlinedInput-root": {
    "&:hover fieldset": {
      borderColor: "#263238",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#f57f17",
    },
  },
});

export const FormBlockGroup = () => {
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
    name: "blockCodes",
  });

  /* React Hook Form - Watch*/
  const watchBlockGroupCode = watch("blockGroupCode");
  const watchBlockGroupCount = watch("blockGroupCount");
  const watchBlockGroupYear = watch("blockGroupYear");
  const watchCodes = watch("blockCodes");

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

  /* Block Function */
  function codeGroup(index) {
    const groupYear = String(moment(watchBlockGroupYear).format("YYYY")).slice(-2);
    const startCode = blockGroup().groupStartCode;
    const overAllAmount = blockGroup().groupAmount;
    if (watchCodes.length != 0) {
      if (index === 0) {
        // Firts Block
        const amount = watchCodes[index].amount;

        const lastCode = parseFloat(startCode) + parseFloat(amount) - 1;
        if (startCode === lastCode) {
          blockCode = String(startCode) + "/" + groupYear;
        } else {
          blockCode = String(startCode) + "-" + String(lastCode).slice(-2) + "/" + groupYear;
        }

        const newStartCode = startCode;

        watchCodes[index]["code"] = newStartCode;
        watchCodes[index]["amount"] = amount;
        watchCodes[index]["block"] = blockCode;

        return { newStartCode, lastCode, blockCode };
      } else {
        // Subsequent Blocks
        var previousAmount = 1;
        if (parseFloat(watchCodes[index - 1]?.amount) > 0) {
          previousAmount = parseFloat(watchCodes[index - 1].amount);
        }

        var newAmount = 1;
        if (parseFloat(watchCodes[index]?.amount) > 0) {
          newAmount = parseFloat(watchCodes[index].amount);
        }

        if (watchCodes[index]) {
          const newStartCode = watchCodes[index - 1]["code"] + previousAmount;
          watchCodes[index]["code"] = newStartCode;

          const lastCode = parseFloat(newStartCode) + newAmount - 1;

          var blockCode = "";
          if (newStartCode === lastCode) {
            blockCode = String(newStartCode) + "/" + groupYear;
          } else {
            blockCode = String(newStartCode) + "-" + String(lastCode).slice(-2) + "/" + groupYear;
          }
          watchCodes[index]["block"] = blockCode;

          return { newStartCode, blockCode, lastCode, amount: newAmount };
        }
      }
    }
  }

  return (
    <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={1}>
      <Grid item md={12} sm={12} xs={12}>
        <Typography>Укажите группу содержащие блоки пациента</Typography>
      </Grid>
      <Grid item md={12} sm={12} xs={12}>
        <Controller
          control={control}
          name="blockOrgan"
          // rules={{ required: "Обязательное поле" }}
          render={({ field }) => (
            <SpecTextField
              {...field}
              fullWidth
              id="Organ-SpecTextField"
              label="Орган"
              color="secondary"
              error={errors.blockOrgan ? true : false}
              helperText={errors?.blockOrgan && errors.blockOrgan.message}
            />
          )}
        />
      </Grid>
      <Grid item md={12} sm={12} xs={12}>
        <Controller
          control={control}
          name="blockDepartment"
          // rules={{ required: "Обязательное поле" }}
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
      <Grid item md={4} sm={4} xs={12}>
        <Controller
          name={"blockGroupCode"}
          control={control}
          mode="onBlur"
          defaultValue={""}
          render={({ field }) => (
            <SpecTextField
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
            // required: "Обязательное поле",
            max: {
              value: 1000000,
              message: "Слишком большое число",
            },
            validate: {
              matchLastCodes: () => {
                const { blockGroupLastCode } = getValues();
                if (watchBlockGroupCode != "") {
                  return (
                    blockGroupLastCode === codeGroup(watchCodes.length - 1)?.lastCode || "Не прикреплены все блоки"
                  );
                }
              },
            },
          }}
        />
      </Grid>
      <Grid item md={1} sm={1} xs={1}>
        <Controller
          // rules={{ required: "Обязательное поле" }}
          name="blockGroupCount"
          control={control}
          mode="onBlur"
          defaultValue={1}
          render={({ field }) => (
            <SpecTextField
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
            // rules={{ required: "Обязательное поле" }}
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
                  <SpecTextField
                    {...params}
                    error={!!errors.blockGroupYear}
                    helperText={errors.blockGroupYear?.message}
                  />
                )}
              />
            )}
          />
        </LocalizationProvider>
      </Grid>
      <Grid item md={5} sm={5} xs={12}>
        <SpecTextField
          fullWidth
          label="Блок группа"
          variant="outlined"
          value={blockGroup().groupStartCode === "" ? "" : blockGroup().groupCode}
          InputProps={{
            readOnly: true,
          }}
        />
      </Grid>
      <Grid item md={12} sm={12} xs={12}>
        <Alert severity="info">
          При создании блоков будут созданы соответсвующие "виртуальные слайды"
        </Alert>
      </Grid>
      {fields.map((item, index) => {
        return (
          <Grid key={item.id} container spacing={1} item md={12} sm={12} xs={12}>
            <React.Fragment>
              <Grid item md={3} sm={3} xs={3}>
                <Controller
                  rules={{ required: "Обязательное поле" }}
                  name={`blockCodes[${index}].code`}
                  control={control}
                  mode="onBlur"
                  defaultValue={1}
                  render={({ field }) => (
                    <SpecTextField
                      {...field}
                      fullWidth
                      value={codeGroup(index).newStartCode}
                      inputProps={{ type: "number" }}
                      label="Начальный номер блока"
                      variant="outlined"
                      InputProps={{
                        readOnly: true,
                      }}
                      error={!!errors.blockCodes?.[index]?.code}
                      helperText={errors.blockCodes?.[index]?.code?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item md={1} sm={1} xs={1}>
                <Controller
                  render={({ field }) => (
                    <SpecTextField
                      {...field}
                      fullWidth
                      inputProps={{
                        min: 1,
                        max: parseInt(blockGroup().groupLastCode) - parseInt(codeGroup(index).newStartCode) + 1,
                        type: "number",
                      }}
                      label="Куски."
                      variant="outlined"
                      error={!!errors.blockCodes?.[index]?.amount}
                      helperText={errors.blockCodes?.[index]?.amount?.message}
                    />
                  )}
                  rules={{ required: "Обязательное поле" }}
                  name={`blockCodes[${index}].amount`}
                  control={control}
                  mode="onBlur"
                  defaultValue={1}
                />
              </Grid>

              <Grid item md={3} sm={3} xs={3}>
                <SpecTextField
                  fullWidth
                  value={codeGroup(index).newStartCode === "" ? "" : codeGroup(index).lastCode}
                  InputProps={{
                    readOnly: true,
                  }}
                  label="Конечный номер"
                  variant="outlined"
                />
              </Grid>
              <Grid item md={5} sm={5} xs={12}>
                <SpecTextField
                  fullWidth
                  value={codeGroup(index).blockCode}
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
              reset();
            }}
          >
            Сброс
          </Button>
        </Grid>

        {blockGroup()?.groupLastCode === codeGroup(watchCodes.length - 1)?.lastCode ? null : (
          <Grid item md={6}>
            <Button
              variant="outlined"
              onClick={() => {
                append({ code: "" }, { amount: "" }, { year: "" });
              }}
            >
              Добавить блок к группе
            </Button>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export default FormBlockGroup;
