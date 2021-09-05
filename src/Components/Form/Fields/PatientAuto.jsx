import { Autocomplete, CircularProgress, List, ListItem, ListItemText, TextField, Typography } from "@material-ui/core";
import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPatients } from "../../../Store/Slices/patientSlice";

function PatientAuto(props) {
  const patientsState = useSelector((state) => state.Patients);

  const [inputValue, setInputValue] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    if (inputValue.length >= 4) {
      dispatch(fetchPatients(inputValue));
    }
  }, [dispatch, inputValue]);

  return (
    <Autocomplete
      autoSelect
      sx={{ width: 600 }}
      id="PatientSearch-id"

      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      getOptionLabel={(option) => option.id_ambulatory + " " + option.first_name + " " + option.last_name}
      // renderOption
      options={patientsState["List"]}
      loading={patientsState["Loading"]}
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
  );
}

export default PatientAuto;
