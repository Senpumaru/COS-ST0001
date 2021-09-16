import { faUser } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Autocomplete, Checkbox, CircularProgress, Grid, ListItem, TextField, Typography } from "@material-ui/core";
import { styled } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useDebounce from "../../Functions/useDebounce";
import { fetchPatients } from "../../Store/Slices/patientSlice";
import SpecTextField from "../SpecTextField";

function PatientAutocomplete() {
  const patientListState = useSelector((state) => state.Patients.List);
  const [value, setValue] = useState("");
  const [inputValue, setInputValue] = useState("");

  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchTerm = useDebounce(inputValue, 2000);

  const dispatch = useDispatch();

  useEffect(() => {
    if (debouncedSearchTerm) {
      setIsSearching(true);
      dispatch(fetchPatients(inputValue));
    } else {
      setIsSearching(false);
    }
  }, [debouncedSearchTerm]);

  return (
    <Autocomplete
      fullWidth
      id="PatientSearch-id"
      name="Patient"
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      getOptionLabel={(option) => value != "" ? option.full_name + " " + option.id_ambulatory : ""}
      renderOption={(props, option, { selected }) => (
        <ListItem key={option.uuid} {...props}>
          <Checkbox
            icon={<FontAwesomeIcon icon={faUser} />}
            checkedIcon={<FontAwesomeIcon icon={faUser} />}
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
          helperText="Параметры поиска: Амбуляторный номер, ФИО"
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

export default PatientAutocomplete;
