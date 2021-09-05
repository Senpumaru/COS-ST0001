import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Grid,
  ListItem,
  MenuItem,
  Popper,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import { DatePicker, LocalizationProvider } from "@material-ui/lab";
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";
import { makeStyles } from "@material-ui/styles";
import React from "react";
import { useState } from "react";
import { Controller } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import ruLocale from "date-fns/locale/ru";

import { createBlocks } from "../../../Store/Slices/blockSlice";
import FormStep2 from "../Patient/FormStep2";
import moment from "moment";
import { useEffect } from "react";
import { fetchPatients } from "../../../Store/Slices/patientSlice";
import AlertMod from "../../../Components/AlertMod";
import { CheckBoxOutlineBlank, CheckBoxOutlined } from "@material-ui/icons";

/*** Material-UI Styles ***/
const useStyles = makeStyles((theme) => ({
  alertSuccess: {
    backgroundColor: "#edbc1c",
  },
}));

function BlockForm() {
  /*** Material-UI Styles ***/
  const classes = useStyles();

  /* Redux Toolkit */
  const dispatch = useDispatch();

  const Patients = useSelector((state) => state.Patients);
  const Blocks = useSelector((state) => state.Blocks);

  /*** React Hook Form ***/
  /* React Hook Form - Defaults */
  const defaultValues = {
    Patient: "",
    blockCodes: [],
  };

  /* React Hook Form - Submit */
  const onSubmit = (data) => {
    console.log(data);
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
    name: "blockGroupCodes",
  });

  // Watch
  const watchCodes = watch("blockGroupCodes");

  /*** Alert ***/
  const [openAlert, setOpenAlert] = useState(false);

  /*** Local Functions ***/
  // BlockGroup Function
  function codeGroup(index) {
    const startCode = watchCodes[index].code;
    const amount = watchCodes[index].amount;
    const year = String(moment(watchCodes[index].year).format("YYYY")).slice(-2);
    const lastCode = parseFloat(startCode) + parseFloat(amount) - 1;
    const groupCode = String(startCode) + "-" + String(lastCode).slice(-2) + "/" + year;
    return { startCode, groupCode };
  }

  // Patient Function - Autocomplete
  const patientsState = useSelector((state) => state.Patients);
  const [inputSearch, setSearchValue] = useState("");

  useEffect(() => {
    if (inputSearch.length >= 2) {
      dispatch(fetchPatients(inputSearch));
    }
  }, [dispatch, inputSearch]);

  const CustomPopper = function (props) {
    const classes = useStyles();
    return <Popper {...props} className={classes.root} placement="bottom" />;
  };

  return (
    <React.Fragment>
      <form>
        <Controller
          render={(props) => (
            <Autocomplete
              autoSelect
              sx={{ width: 600 }}
              id="PatientSearch-id"
              inputValue={inputSearch}
              onInputChange={(event, newInputValue) => {
                setSearchValue(newInputValue);
              }}
              getOptionLabel={(option) => option.first_name + " " + option.last_name + " " + option.middle_name}
              renderOption={(props, option, { selected }) => (
                <ListItem {...props}>
                  <Checkbox
                    icon={<CheckBoxOutlineBlank fontSize="small" />}
                    checkedIcon={<CheckBoxOutlined fontSize="small" />}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  <React.Fragment>
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <Typography>ID: {option.id_ambulatory}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography>
                          ФИО: {option.first_name} {option.last_name} {option.middle_name}
                        </Typography>
                      </Grid>
                    </Grid>
                  </React.Fragment>
                </ListItem>
              )}
              options={patientsState["List"]}
              loading={patientsState["Loading"]}
              // Redux Hook Form - Support
              onChange={(event, search) => setValue("Patient", search)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {patientsState["Loading"] ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                  label="Поиск пациента"
                />
              )}
            />
          )}
          PopperComponent={CustomPopper}
          control={control}
          name="Patient"
        />
        <Typography>
          На основании номеров блоков (по умолчанию) автоматически будут созданы соответсвующие МП
        </Typography>
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
                        inputProps={{ min: 0, max: 1000000, type: "number" }}
                        label="Номер первого блока"
                        variant="outlined"
                        error={!!errors.blockGroupCodes?.[index]?.code}
                        helperText={errors.blockGroupCodes?.[index]?.code?.message}
                      />
                    )}
                    rules={{
                      required: "Обязательное поле",
                      max: {
                        value: 1000000,
                        message: "Слишком большое число",
                      },
                    }}
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
              variant="outlined"
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
        </Grid>
        <Button onClick={handleSubmit(onSubmit)}>Завершить</Button>
      </form>
      <Box pt={2}>
        {Blocks.Error && (
          <AlertMod open={openAlert} state={setOpenAlert} severity="error" text={Blocks.Error}></AlertMod>
        )}
        {Blocks.Success && (
          <AlertMod
            open={openAlert}
            state={setOpenAlert}
            severity="success"
            className={classes.myAlert}
            text="Блоки успешно зарегестрированы."
          ></AlertMod>
        )}
      </Box>
    </React.Fragment>
  );
}

export default BlockForm;
