import { Autocomplete, CircularProgress, List, ListItem, ListItemText, TextField, Typography } from "@material-ui/core";
import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PatientAuto from "../../Components/Form/Fields/PatientAuto";
import { fetchPatients } from "../../Store/Slices/patientSlice";

function PatientCard(props) {
  const { personData } = props;

  return (
    <ListItem alignItems="flex-start">
      <ListItemText>Name: {personData.first_name}</ListItemText>
    </ListItem>
  );
}

function Database() {
  const patientsState = useSelector((state) => state.Patients);

  return (
    <React.Fragment>
      Patients Testing ground
      <br />
      <PatientAuto/>
      <br />
      <List>
        {patientsState["List"].map((person) => (
          <PatientCard personData={person} key={person.uuid} />
        ))}
      </List>
    </React.Fragment>
  );
}

export default Database;
