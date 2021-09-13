import { Alert, Box, Button, CircularProgress, Grid, IconButton, TextField, Typography } from "@material-ui/core";
import { DatePicker, LocalizationProvider } from "@material-ui/lab";
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";
import { styled } from "@material-ui/styles";
import CloseIcon from "@mui/icons-material/Close";
import { Collapse, Fade } from "@mui/material";
import ruLocale from "date-fns/locale/ru";
import moment from "moment";
import React, { useState } from "react";
import { Controller, FormProvider, useFieldArray, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import PatientSearch from "../../../Components/Fields/PatientAutocomplete";
import SpecTextField from "../../../Components/SpecTextField";
import { createBlocks, CreateReset } from "../../../Store/Slices/blockSlice";


function FormBlocks() {
  /* Redux Toolkit */
  const dispatch = useDispatch();

  const ListPatients = useSelector((state) => state.Patients.List);
  const CreateBlocks = useSelector((state) => state.Blocks.Create);

  /*** React Hook Form ***/
  /* React Hook Form - Defaults */
  const defaultValues = {
    blockCodes: [],
  };

  /* React Hook Form - Submit */
  const onSubmit = (data) => {
    if (ListPatients["Data"][0]["uuid"]) {
      data["Patient UUID"] = ListPatients["Data"][0]["uuid"];
    }
    // React Hook Form - Submit Dispatch
    dispatch(createBlocks(data));
    setOpenAlert(true);
  };

  /* React Hook Form - Form */
  const methods = useForm({
    shouldUnregister: false,
    defaultValues,
    mode: "onChange",
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

  // Array
  const { fields, append, remove } = useFieldArray({
    control,
    name: "blockCodes",
  });

  // Watch
  const watchCodes = watch("blockCodes");

  /*** Alert ***/
  const [openAlert, setOpenAlert] = useState(true);

  /*** Functions ***/

  /* Block Function */
  function blockGroup(index) {
    const codeYear = String(moment(watchCodes[index]["year"]).format("YYYY")).slice(-2);
    const blockEndCode = parseFloat(watchCodes[index]["startCode"]) + parseFloat(watchCodes[index]["amount"]);
    const blockCode = String(watchCodes[index]["startCode"]) + "-" + String(blockEndCode).slice(-2) + "/" + codeYear;
    watchCodes[index]["code"] = blockCode;
    return { blockEndCode, blockCode };
  }

  return (
    <React.Fragment>
      <FormProvider>
        <form>
          <PatientSearch />

          <Box pt={1}>
            {fields.map((item, index) => {
              return (
                <Grid key={item.id} container spacing={1} item md={12} sm={12} xs={12}>
                  <React.Fragment>
                    <Grid item md={12} sm={12} xs={12}>
                      <Controller
                        control={control}
                        name={`blockCodes[${index}].organ`}
                        rules={{ required: "Обязательное поле" }}
                        render={({ field }) => (
                          <SpecTextField
                            {...field}
                            fullWidth
                            id="Organ-SpecTextField"
                            label="Орган"
                            color="secondary"
                            error={!!errors.blockCodes?.[index]?.organ?.message}
                            helperText={errors.blockCodes?.[index]?.organ?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item md={12} sm={12} xs={12}>
                      <Controller
                        control={control}
                        name={`blockCodes[${index}].department`}
                        rules={{ required: "Обязательное поле" }}
                        render={({ field }) => (
                          <SpecTextField
                            {...field}
                            fullWidth
                            id="Department-SpecTextField"
                            label="Отделение"
                            color="secondary"
                            error={!!errors.blockCodes?.[index]?.department?.message}
                            helperText={errors.blockCodes?.[index]?.department?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item md={4} sm={4} xs={4}>
                      <Controller
                        rules={{ required: "Обязательное поле" }}
                        name={`blockCodes[${index}].startCode`}
                        control={control}
                        mode="onBlur"
                        defaultValue={1}
                        render={({ field }) => (
                          <SpecTextField
                            {...field}
                            fullWidth
                            inputProps={{ min: 1, max: 1000000, type: "number" }}
                            label="Начальный номер блока"
                            variant="outlined"
                            error={!!errors.blockCodes?.[index]?.code}
                            helperText={errors.blockCodes?.[index]?.code?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item md={2} sm={2} xs={2}>
                      <Controller
                        rules={{ required: "Обязательное поле" }}
                        name={`blockCodes[${index}].amount`}
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
                            error={!!errors.blockCodes?.[index]?.amount}
                            helperText={errors.blockCodes?.[index]?.amount?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item md={2} sm={2} xs={2}>
                      <LocalizationProvider dateAdapter={AdapterDateFns} locale={ruLocale}>
                        <Controller
                          name={`blockCodes[${index}].year`}
                          defaultValue={new Date()}
                          control={control}
                          rules={{ required: "Обязательное поле" }}
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

                    <Grid item md={4} sm={4} xs={4}>
                      <SpecTextField
                        fullWidth
                        value={blockGroup(index).blockEndCode}
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
                        value={blockGroup(index).blockCode}
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
          </Box>
          <Grid container p={1} spacing={2}>
            <Grid item md={12} sm={12} xs={12}>
              <Alert severity="info">При создании блоков будут созданы соответсвующие "виртуальные слайды"</Alert>
            </Grid>
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
            <Grid item xs={12}>
              <Button variant="contained" color="primary" onClick={handleSubmit(onSubmit)}>
                <Typography pr={2}>Завершить</Typography>
                {CreateBlocks.Loading && <CircularProgress size={25} thickness={4.8} color="secondary" />}
              </Button>
            </Grid>
          </Grid>
        </form>
      </FormProvider>

      {/* Errors */}
      <Box pt={2}>
        {CreateBlocks.Error && (
          <Fade timeout={1000} in={openAlert}>
            <Alert
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    dispatch(CreateReset())
                    setOpenAlert(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
              severity="error"
              color="error"
            >
              {typeof CreateBlocks.Error === "object" ? (
                Object.entries(CreateBlocks.Error).map(([key, value]) => {
                  return <Typography key={key}>{CreateBlocks.Error[key]}</Typography>;
                })
              ) : (
                <Typography>{CreateBlocks.Error}</Typography>
              )}
            </Alert>
          </Fade>
        )}

        {CreateBlocks.Success && (
          <Fade timeout={1000} in={openAlert}>
            <Alert
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    dispatch(CreateReset())
                    setOpenAlert(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
              severity="success"
            >
              {CreateBlocks.Success.success}
            </Alert>
          </Fade>
        )}
      </Box>
    </React.Fragment>
  );
}

export default FormBlocks;
