import { Alert, Divider, Grid } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Stepper from "@material-ui/core/Stepper";
import Typography from "@material-ui/core/Typography";
import { Collapse, Fade } from "@mui/material";
import moment from "moment";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { createPatient, createStep, resetPatients } from "../../../Store/Slices/patientSlice";
import FormBlockChoice from "./FormBlockChoice";
import FormPatient from "./FormPatient";
import FormSlideChoice from "./FormSlideChoice";
import Outcome from "./Outcome";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { CreateReset } from "../../../Store/Slices/patientSlice";
import SpecTextField from "../../../Components/SpecTextField";


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

  const PatientState = useSelector((state) => state.Patients.Create);

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
    if (PatientState.Success) {
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
    ambulatoryNumber: PatientState.Data.ambulatoryNumber,
    orginization: "РНПЦ ОМР им.Александрова",
    department: PatientState.Data.department,
    gender: PatientState.Data.gender,
    firstName: PatientState.Data.firstName,
    middleName: PatientState.Data.middleName,
    lastName: PatientState.Data.lastName,
    country: PatientState.Data.country,
    city: PatientState.Data.city,
    street: PatientState.Data.street,
    house: PatientState.Data.house,
    flat: PatientState.Data.flat,
    dateBirth: PatientState.Data.dateBirth,
    blockGroupOrgan: "",
    blockGroupDepartment: "",
    blockGroupCode: "",
    blockGroupCount: "",
    blockCodes: [],
    slideGroupCode: "",
    slideGroupCount: "",
    slideCodes: [],
  };

  /* React Hook Form - Submit */
  const onSubmit = (data) => {
    handleNext();
    // Data Modification
    data["dateBirth"] = moment(data["dateBirth"]).format("YYYY-MM-DD");
    data["blockGroupYear"] = moment(data["blockGroupYear"]).format("YYYY-MM-DD");
    data["slideGroupYear"] = moment(data["slideGroupYear"]).format("YYYY-MM-DD");
    
    // React Hook Form Data Dispatch
    dispatch(createPatient(data));
    if (PatientState.Success) {
      reset();
    }
    // Alert Set
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
            {PatientState.Loading && <CircularProgress size={30} thickness={3.2} color="secondary" />}
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
                      reset();
                      dispatch(resetPatients());
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

      {/* Errors */}
      <Box pt={2}>
        {PatientState.Error && (
          <Fade timeout={1000} in={openAlert}>
            <Alert
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    dispatch(CreateReset());
                    setOpenAlert(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
              severity="error"
              color="error"
            >
              {typeof PatientState.Error === "object" ? (
                Object.entries(PatientState.Error).map(([key, value]) => {
                  return <Typography key={key}>{PatientState.Error[key]}</Typography>;
                })
              ) : (
                <Typography>{PatientState.Error}</Typography>
              )}
            </Alert>
          </Fade>
        )}

        {PatientState.Success && (
          <Fade timeout={500} in={openAlert}>
            <Alert
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setOpenAlert(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
              severity="success"
            >
              {PatientState.Success.success}
            </Alert>
          </Fade>
        )}
      </Box>
    </Box>
  );
}

export default PatientRegistry;
