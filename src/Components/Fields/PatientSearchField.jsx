import { faUser } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Autocomplete, Checkbox, CircularProgress, Grid, ListItem, TextField, Typography } from "@material-ui/core";
import { styled } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useDebounce from "../../Functions/useDebounce";
import { fetchBlocks } from "../../Store/Slices/blockSlice.jsx";
import { fetchPatients } from "../../Store/Slices/patientSlice";
import SpecTextField from "../SpecTextField";


function PatientSearchField() {
  const listBlocks = useSelector((state) => state.Blocks.List);

  const [name, setName] = useState("");
  const handleChange = (event) => {
    setName(event.target.value);
  };

  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchTerm = useDebounce(name, 2000);

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
    <SpecTextField
      fullWidth
      type="search"
      label="Поиск..."
      helperText="Параметры поиска: Амбуляторный номер, ФИО, номер блоков и МП"
      value={name}
      onChange={handleChange}
      
    />
  );
}

export default PatientSearchField;
