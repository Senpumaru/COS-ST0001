import { Button, Divider, Grid, Paper, TextField, Typography } from "@material-ui/core";
import { DatePicker, LocalizationProvider } from "@material-ui/lab";
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";
import ruLocale from "date-fns/locale/ru";
import moment from "moment";
import React from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { alpha, styled } from "@mui/material/styles";
import { Alert } from "@mui/material";
import SpecTextField from "../../../../Components/SpecTextField";

export const FormSlideGroup = () => {
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
  const watchSlideGroupCode = watch("slideGroupCode");
  const watchSlideGroupCount = watch("slideGroupCount");
  const watchSlideGroupYear = watch("slideGroupYear");
  const watchCodes = watch("slideCodes");

  /*** Functions ***/

  /* SlideGroup Function */
  function slideGroup() {
    const groupStartCode = parseFloat(watchSlideGroupCode);

    // Check for NaN
    var groupAmount = 1;
    if (parseFloat(watchSlideGroupCount) > 0) {
      groupAmount = parseFloat(watchSlideGroupCount);
    }
    const groupYear = String(moment(watchSlideGroupYear).format("YYYY")).slice(-2);
    const groupLastCode = groupStartCode + groupAmount - 1;
    setValue("slideGroupLastCode", groupLastCode);
    const range = [...Array(groupAmount)].map((_, i) => i + groupStartCode);

    const groupCode = String(groupStartCode) + "-" + String(groupLastCode).slice(-2) + "/" + groupYear;

    return { groupStartCode, groupLastCode, groupCode, groupAmount, groupYear };
  }

  /* Slide Function */
  function codeGroup(index) {
    const groupYear = String(moment(watchSlideGroupYear).format("YYYY")).slice(-2);
    const startCode = slideGroup().groupStartCode;
    const overAllAmount = slideGroup().groupAmount;
    if (watchCodes.length != 0) {
      if (index === 0) {
        // Firts Slide
        const amount = watchCodes[index].amount;

        const lastCode = parseFloat(startCode) + parseFloat(amount) - 1;
        if (startCode === lastCode) {
          slideCode = String(startCode) + "/" + groupYear;
        } else {
          slideCode = String(startCode) + "-" + String(lastCode).slice(-2) + "/" + groupYear;
        }

        const newStartCode = startCode;

        watchCodes[index]["code"] = newStartCode;
        watchCodes[index]["amount"] = amount;
        watchCodes[index]["slide"] = slideCode;

        return { newStartCode, lastCode, slideCode };
      } else {
        // Subsequent Slides
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

          var slideCode = "";
          if (newStartCode === lastCode) {
            slideCode = String(newStartCode) + "/" + groupYear;
          } else {
            slideCode = String(newStartCode) + "-" + String(lastCode).slice(-2) + "/" + groupYear;
          }
          watchCodes[index]["slide"] = slideCode;

          return { newStartCode, slideCode, lastCode, amount: newAmount };
        }
      }
    }
  }

  return (
    <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={1}>
      <Grid item md={12} sm={12} xs={12}>
        <Typography>Укажите группу содержащие МП пациента</Typography>
      </Grid>
      <Grid item md={12} sm={12} xs={12}>
        <Controller
          control={control}
          name="slideOrgan"
          // rules={{ required: "Обязательное поле" }}
          render={({ field }) => (
            <SpecTextField
              {...field}
              fullWidth
              id="Organ-SpecTextField"
              label="Орган"
              color="secondary"
              error={errors.slideOrgan ? true : false}
              helperText={errors?.slideOrgan && errors.slideOrgan.message}
            />
          )}
        />
      </Grid>
      <Grid item md={12} sm={12} xs={12}>
        <Controller
          control={control}
          name="slideDepartment"
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
          name={"slideGroupCode"}
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
              error={!!errors.slideGroupCode}
              helperText={errors.slideGroupCode?.message}
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
                const { slideGroupLastCode } = getValues();
                if (watchSlideGroupCode != "") {
                  return (
                    slideGroupLastCode === codeGroup(watchCodes.length - 1)?.lastCode || "Не прикреплены все МП"
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
          name="slideGroupCount"
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
              error={!!errors.slideGroupCount}
              helperText={errors.slideGroupCount?.message}
            />
          )}
        />
      </Grid>
      <Grid item md={2} sm={2} xs={2}>
        <LocalizationProvider dateAdapter={AdapterDateFns} locale={ruLocale}>
          <Controller
            name={"slideGroupYear"}
            defaultValue={new Date()}
            control={control}
            // rules={{ required: "Обязательное поле" }}
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
      <Grid item md={5} sm={5} xs={12}>
        <SpecTextField
          fullWidth
          label="Блок группа"
          variant="outlined"
          value={slideGroup().groupStartCode === "" ? "" : slideGroup().groupCode}
          InputProps={{
            readOnly: true,
          }}
        />
      </Grid>
      <Divider/>
      {fields.map((item, index) => {
        return (
          <Grid key={item.id} container spacing={1} item md={12} sm={12} xs={12}>
            <React.Fragment>
              <Grid item md={3} sm={3} xs={3}>
                <Controller
                  rules={{ required: "Обязательное поле" }}
                  name={`slideCodes[${index}].code`}
                  control={control}
                  mode="onBlur"
                  defaultValue={1}
                  render={({ field }) => (
                    <SpecTextField
                      {...field}
                      fullWidth
                      value={codeGroup(index).newStartCode}
                      inputProps={{ type: "number" }}
                      label="Начальный номер МП"
                      variant="outlined"
                      InputProps={{
                        readOnly: true,
                      }}
                      error={!!errors.slideCodes?.[index]?.code}
                      helperText={errors.slideCodes?.[index]?.code?.message}
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
                        max: parseInt(slideGroup().groupLastCode) - parseInt(codeGroup(index).newStartCode) + 1,
                        type: "number",
                      }}
                      label="Куски."
                      variant="outlined"
                      error={!!errors.slideCodes?.[index]?.amount}
                      helperText={errors.slideCodes?.[index]?.amount?.message}
                    />
                  )}
                  rules={{ required: "Обязательное поле" }}
                  name={`slideCodes[${index}].amount`}
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
                  value={codeGroup(index).slideCode}
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
              reset({
                ...getValues(),
                slideGroupOrgan: "",
                slideGroupDepartment: "",
                slideGroupCode: "",
                slideGroupCount: "",
                slideCodes: [],
              });
            }}
          >
            Сброс
          </Button>
        </Grid>

        {slideGroup()?.groupLastCode === codeGroup(watchCodes.length - 1)?.lastCode ? null : (
          <Grid item md={6}>
            <Button
              variant="outlined"
              onClick={() => {
                append({ code: "" }, { amount: "" }, { year: "" });
              }}
            >
              Добавить МП к группе
            </Button>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export default FormSlideGroup;
