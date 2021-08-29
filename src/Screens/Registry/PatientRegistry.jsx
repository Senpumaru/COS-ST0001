import Box from "@material-ui/core/Box";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { useState } from "react";
import FormStep1 from "./Patient/FormStep1";
import { makeStyles } from "@material-ui/styles";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { useEffect } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import FormStep2 from "./Patient/FormStep2";
import FormStep3 from "./Patient/FormStep3";
import FormStep4 from "./Patient/FormStep4";
import { Alert, Grid, Paper } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { createPatient, CreateReset, createStep } from "../../Store/Slices/patientSlice";
import moment from "moment";
import CircularProgress from "@material-ui/core/CircularProgress";

/*** Material-UI Styles ***/
const useStyles = makeStyles((theme) => ({}));

// Steps (Forms)
function getStepContent(step) {
  switch (step) {
    case 0:
      return <FormStep1 />;
    case 1:
      return <FormStep2 />;
    case 2:
      return <FormStep3 />;
    default:
      return "Неизвестный шаг";
  }
}

/** Patient Registry **/
function PatientRegistry() {
  /*** Material-UI Styles ***/
  const classes = useStyles();

  /* Redux Toolkit */
  const dispatch = useDispatch();

  const Patients = useSelector((state) => state.Patients);

  /* Stepper */
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const steps = ["Личные данные", "Приписанные блоки", "Итог"];

  const handleNext = async () => {
    const isStepValid = await trigger();
    if (isStepValid) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      // Store data in Redux Store
      dispatch(
        createStep({
          ambulatoryNumber: getValues("ambulatoryNumber"),
          firstName: getValues("firstName"),
          middleName: getValues("middleName"),
          lastName: getValues("lastName"),
          address: getValues("address"),
        })
      );
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    reset();
  };

  /*** React Hook Form Defaults ***/
  const defaultValues = {
    ambulatoryNumber: Patients.Create.ambulatoryNumber,
    firstName: Patients.Create.firstName,
    middleName: Patients.Create.middleName,
    lastName: Patients.Create.lastName,
    address: Patients.Create.address,
    dateBirth: null,
    blockGroupCodes: Array(1).fill({ code: "", year: new Date() }),
  };

  /* React Hook Form - Submit */
  const onSubmit = (data) => {
    dispatch(createPatient(data));
    handleNext();
  };

  /* Yup - validation */
  const validationSchema = [
    // Validation for Step 1
    yup.object({
      first_name: yup.string().required(),
    }),
    // Validation for Step 2
    yup.object({}),
    // Validation for Step 3
    yup.object({}),
  ];
  const currentValidationSchema = validationSchema[activeStep];

  /* React Hook Form - Form */
  const methods = useForm({
    shouldUnregister: false,
    defaultValues,
    mode: "onChange",
  });

  const { register, handleSubmit, setValue, formState, getValues, reset, trigger } = methods;

  return (
    <Box sx={{ flexGrow: 1, p: 1 }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>

      <Box mt={4}>
        {activeStep === steps.length ? (
          <React.Fragment>
            <Button onClick={handleReset} className={classes.button}>
              Повтор
            </Button>
          </React.Fragment>
        ) : (
          <FormProvider {...methods}>
            <form>
              <Box m={2} className={classes.instructions}>
                {getStepContent(activeStep)}
              </Box>

              <Grid mt={2} container direction="row" justifyContent="space-between" alignItems="flex-end">
                <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                  Назад
                </Button>
                {activeStep === steps.length - 1 ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit(onSubmit)}
                    className={classes.button}
                  >
                    Завершить
                  </Button>
                ) : (
                  <Button variant="contained" color="primary" onClick={handleNext} className={classes.button}>
                    Вперед
                  </Button>
                )}
              </Grid>
            </form>
          </FormProvider>
        )}
      </Box>
      <Box display="flex" justifyContent="center" alignItems="center">
        {Patients.Loading && <CircularProgress />}
      </Box>
      {Patients.Error && <Alert severity="error">{Patients.Error}</Alert>}
      {Patients.Success && <Alert severity="success">Пациент и блоки успешно зарегестрированы.</Alert>}
    </Box>
  );
}

export default PatientRegistry;
