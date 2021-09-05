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
import { Alert, Collapse, Grid, IconButton, Paper, Fade, Snackbar } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { createPatient, CreateReset, createStep, initialState, resetPatients } from "../../Store/Slices/patientSlice";
import moment from "moment";
import CircularProgress from "@material-ui/core/CircularProgress";
import CloseIcon from "@material-ui/icons/Close";
import AlertMod from "../../Components/AlertMod";

/*** Material-UI Styles ***/
const useStyles = makeStyles((theme) => ({
  alertSuccess: {
    backgroundColor: "#edbc1c",
  },
}));

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

  /** Stepper ***/
  const steps = ["Личные данные", "Приписанные блоки", "Итог"];
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());

  /* Next */
  const handleNext = async () => {
    // Skip Check
    /* let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    } */

    // Next Check
    const isStepValid = await trigger();
    if (isStepValid) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);

      // Store data in Redux Store
      if (activeStep != 2) {
        dispatch(
          createStep({
            ambulatoryNumber: getValues("ambulatoryNumber"),
            orginization: getValues("orginization"),
            gender: getValues("gender"),
            firstName: getValues("firstName"),
            middleName: getValues("middleName"),
            lastName: getValues("lastName"),
            address: getValues("address"),
            
            blockCodes: [],
          })
        );
      }
    }
  };
  // Back
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  // Reset
  const handleReset = () => {
    setActiveStep(0);
    reset();
  };

  // Skip
  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
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
  
  /*** React Hook Form ***/
  /* React Hook Form - Defaults */
  const defaultValues = {
    ambulatoryNumber: Patients.Create.ambulatoryNumber,
    orginization: Patients.Create.orginization,
    gender: Patients.Create.gender,
    firstName: Patients.Create.firstName,
    middleName: Patients.Create.middleName,
    lastName: Patients.Create.lastName,
    address: Patients.Create.address,
    
    blockGroupCode: "",
    blockCodes: Patients.Create.blockCodes,
  };

  /* React Hook Form - Submit */
  const onSubmit = (data) => {
    handleNext();
    // Data Modification
    data["dateBirth"] = moment(data["dateBirth"]).format("YYYY-MM-DD");
    data["blockGroupYear"] = moment(data["blockGroupYear"]).format("YYYY-MM-DD");
    console.log(data)
    // React Hook Form Data Dispatch
    dispatch(createPatient(data));
    setOpenAlert(true);
  };


  /* React Hook Form - Form */
  const methods = useForm({
    shouldUnregister: false,
    defaultValues,
    mode: "onChange",
  });

  const { register, handleSubmit, setValue, formState, getValues, reset, trigger } = methods;

  /*** Alert ***/
  const [openAlert, setOpenAlert] = useState(false);

  return (
    <Box sx={{ flexGrow: 1, p: 1 }}>
      <Grid container justifyContent="space-between">
        <Grid xs={11} item>
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => {
              const stepProps = {};
              const labelProps = {};
              // Skip
              if (isStepOptional(index)) {
                labelProps.optional = <Typography variant="caption">Необязательный</Typography>;
              }
              if (isStepSkipped(index)) {
                stepProps.completed = false;
              }
              // Label
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
        </Grid>
        <Grid item xs={1}>
          <Box display="flex" justifyContent="center" alignItems="center">
            {Patients.Loading && <CircularProgress size={30} thickness={4.8} color="secondary" />}
          </Box>
        </Grid>
      </Grid>

      <Box mt={2}>
        {activeStep === steps.length ? (
          <React.Fragment>
            <Button onClick={handleReset} className={classes.button}>
              Повтор
            </Button>
          </React.Fragment>
        ) : (
          <FormProvider {...methods}>
            <form>
              <Box p={1} mt={1} className={classes.instructions}>
                {getStepContent(activeStep)}
              </Box>
              <hr />
              <Grid mt={1} container direction="row" justifyContent="flex-start" alignItems="flex-end" spacing={1}>
                {/* Back Button */}
                <Grid item>
                  <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                    Назад
                  </Button>
                </Grid>
                {/* Skip Button */}
                <Grid item>
                  {/* {isStepOptional(activeStep) && (
                  <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                    Пропустить
                  </Button>
                )} */}
                </Grid>
                <Grid item>
                  {/* Reset Button */}
                  <Button
                    color="secondary"
                    variant="contained"
                    onClick={() => {
                      reset(initialState.Create);
                    }}
                  >
                    Сброс всей формы
                  </Button>
                </Grid>

                {/* Next / Finish Button */}
                <Grid item>
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
                <Grid item></Grid>
              </Grid>
            </form>
          </FormProvider>
        )}
      </Box>

      <Box pt={2}>
        {Patients.Error && (
          <AlertMod open={openAlert} state={setOpenAlert} severity="error" text={Patients.Error}></AlertMod>
        )}
        {Patients.Success && (
          <AlertMod
            open={openAlert}
            state={setOpenAlert}
            severity="success"
            className={classes.myAlert}
            text="Пациент и блоки успешно зарегестрированы."
          ></AlertMod>
        )}
      </Box>
    </Box>
  );
}

export default PatientRegistry;
