import { faUser } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Autocomplete, Checkbox, CircularProgress, Grid, ListItem, TextField, Typography } from "@material-ui/core";
import { styled } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPatients } from "../../Store/Slices/patientSlice";
import SpecTextField from "../SpecTextField";


// Hook
function useDebounce(value, delay) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay] // Only re-call effect if value or delay changes
  );
  return debouncedValue;
}

function PatientSearch() {
  const patientListState = useSelector((state) => state.Patients.List);
  
  const [inputValue, setInputValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchTerm = useDebounce(inputValue, 2000);

  const dispatch = useDispatch();

  useEffect(() => {
    if (debouncedSearchTerm) {
      setIsSearching(true);
      dispatch(fetchPatients(debouncedSearchTerm));
    } else {
      setIsSearching(false);
    }
  }, [debouncedSearchTerm]);

  return (
    <Autocomplete
      fullWidth
      id="PatientSearch-id"
      name="Patient"
      onChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      getOptionLabel={(option) => option.last_name + " " + option.first_name + " " +  option.middle_name}
      renderOption={(props, option, { selected }) => (
        <ListItem {...props}>
          <Checkbox
            icon={<FontAwesomeIcon icon={faUser}/>}
            checkedIcon={<FontAwesomeIcon icon={faUser}/>}
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
      // renderOption
      options={patientListState["Data"]}
      loading={patientListState["Loading"]}
      renderInput={(params) => (
        <SpecTextField
          {...params}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {patientListState["Loading"] ? <CircularProgress color="inherit" size={20} /> : null}
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

export default PatientSearch;
