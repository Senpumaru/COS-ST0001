import Box from "@material-ui/core/Box";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";

import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { useState } from "react";
import FormPatient from "./FormPatient";
import { makeStyles } from "@material-ui/styles";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { useEffect } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import FormBlockChoice from "./FormBlockChoice";
import Outcome from "./Outcome";
import { Alert, Collapse, Grid, IconButton, Paper, Fade, Snackbar, Divider } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import {
  createPatient,
  CreateReset,
  createStep,
  initialState,
  resetPatients,
} from "../../../Store/Slices/patientSlice";
import moment from "moment";
import CircularProgress from "@material-ui/core/CircularProgress";
import CloseIcon from "@material-ui/icons/Close";
import AlertMod from "../../../Components/AlertMod";
import FormSlide from "./Slide/FormSlides";
import FormSlideChoice from "./FormSlideChoice";

// Steps (Forms)
function getStepContent(step) {
  if (step === 0) {
    return <FormPatient />;
  }

  if (step === 1) {
    return <FormBlockChoice />;
  }

  if (step === 2) {
    return <FormSlideChoice />;
  }

  if (step === 3) {
    return <Outcome />;
  }
}

/** Patient Registry **/
function PatientRegistry() {
  /* Redux Toolkit */
  const dispatch = useDispatch();

  const Patients = useSelector((state) => state.Patients);

  /** Stepper ***/
  const steps = ["Личные данные", "Присвоить Блоки", "Присвоить МП", "Итог"];
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());

  /* Next */
  const handleNext = async () => {
    // Skip Check
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    // Next Check
    const isStepValid = await trigger();
    if (isStepValid) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);

      // Store data in Redux Store
      if (activeStep === 0) {
        dispatch(
          createStep({
            ambulatoryNumber: getValues("ambulatoryNumber"),
            orginization: getValues("orginization"),
            department: getValues("department"),
            gender: getValues("gender"),
            dateBirth: getValues("dateBirth"),
            firstName: getValues("firstName"),
            middleName: getValues("middleName"),
            lastName: getValues("lastName"),
            country: getValues("country"),
            city: getValues("city"),
            street: getValues("street"),
            house: getValues("house"),
            flat: getValues("flat"),
            blockCodes: [],
            slideCodes: [],
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
    if (Patients.Success) {
      reset();
    }
    setActiveStep(0);
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
    return step === 1 || step === 2;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  /*** React Hook Form ***/
  /* React Hook Form - Defaults */
  const defaultValues = {
    ambulatoryNumber: Patients.Create.ambulatoryNumber,
    orginization: "РНПЦ ОМР им.Александрова",
    department: Patients.Create.department,
    gender: Patients.Create.gender,
    firstName: Patients.Create.firstName,
    middleName: Patients.Create.middleName,
    lastName: Patients.Create.lastName,
    country: Patients.Create.country,
    city: Patients.Create.city,
    street: Patients.Create.street,
    house: Patients.Create.house,
    flat: Patients.Create.flat,
    dateBirth: Patients.Create.dateBirth,
    blockGroupCode: "",
    blockGroupCount: "",
    blockCodes: Patients.Create.blockCodes,
    slideGroupCode: "",
    slideGroupCount: "",
    slideCodes: Patients.Create.slideCodes,
  };

  /* React Hook Form - Submit */
  const onSubmit = (data) => {
    handleNext();
    console.log(data);
    // Data Modification
    data["dateBirth"] = moment(data["dateBirth"]).format("YYYY-MM-DD");
    data["blockGroupYear"] = moment(data["blockGroupYear"]).format("YYYY-MM-DD");
    data["slideGroupYear"] = moment(data["slideGroupYear"]).format("YYYY-MM-DD");
    console.log(data);
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

  const { register, handleSubmit, watch, setValue, formState, getValues, reset, trigger } = methods;

  /*** Alert ***/
  const [openAlert, setOpenAlert] = useState(false);

  return (
    <Box sx={{ flexGrow: 1, pt: 1 }}>
      <Grid container justifyContent="space-between">
        <Grid item xs={11}>
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

      <Box>
        {activeStep === steps.length ? (
          <React.Fragment>
            <Button onClick={handleReset}>Повтор</Button>
          </React.Fragment>
        ) : (
          <FormProvider {...methods}>
            <form>
              <Box mt={1}>{getStepContent(activeStep)}</Box>
              <Divider />
              <Grid mt={1} container direction="row" justifyContent="flex-start" alignItems="flex-end" spacing={1}>
                {/* Back Button */}
                <Grid item>
                  <Button disabled={activeStep === 0} onClick={handleBack}>
                    Назад
                  </Button>
                </Grid>
                {/* Skip Button */}
                <Grid item>
                  {isStepOptional(activeStep) && (
                    <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                      Пропустить
                    </Button>
                  )}
                </Grid>

                {/* Reset Button */}
                <Grid item>
                  <Button
                    color="secondary"
                    variant="contained"
                    onClick={() => {
                      dispatch(resetPatients());
                      reset();
                      setActiveStep(0);
                    }}
                  >
                    Сброс всей формы
                  </Button>
                </Grid>

                {/* Next / Finish Button */}
                <Grid item>
                  {activeStep === steps.length - 1 ? (
                    <Button variant="contained" color="primary" onClick={handleSubmit(onSubmit)}>
                      Завершить
                    </Button>
                  ) : (
                    <Button variant="contained" color="primary" onClick={handleNext}>
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
            text="Пациент и блоки успешно зарегестрированы."
          ></AlertMod>
        )}
      </Box>
    </Box>
  );
}

export default PatientRegistry;
