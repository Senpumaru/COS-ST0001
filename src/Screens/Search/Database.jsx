import { List, ListItem, ListItemText } from "@material-ui/core";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPatients());
  }, [dispatch]);

  return (
    <React.Fragment>
      Patients Testing ground
      <List>
        {patientsState["List"].map((person) => (
          <PatientCard personData={person} key={person.uuid} />
        ))}
      </List>
    </React.Fragment>
  );
}

export default Database;
