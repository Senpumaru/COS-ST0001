import {
  Autocomplete,
  Checkbox,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from "@material-ui/core";
import { CheckBoxOutlineBlank, CheckBoxOutlined } from "@material-ui/icons";
import React, { useEffect } from "react";
import { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import patientSlice, { fetchPatients } from "../../Store/Slices/patientSlice";
import { alpha, styled } from "@mui/material/styles";

const SpecTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "#f57f17",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#f57f17",
  },
  "& .MuiOutlinedInput-root": {
    "&:hover fieldset": {
      borderColor: "#263238",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#f57f17",
    },
  },
});

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

function PatientAuto(props) {
  const patientsState = useSelector((state) => state.Patients);
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
      onChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
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
      // renderOption
      options={patientsState["List"]}
      loading={patientsState["Loading"]}
      renderInput={(params) => (
        <SpecTextField
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
