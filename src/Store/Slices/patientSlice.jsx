import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// State

export const initialState = {
  List: [],
  Create: {
    ambulatoryNumber: "",
    orginization:"",
    gender:"",
    firstName: "",
    middleName: "",
    lastName: "",
    address: "",
    dateBirth: null,
    blockCodes: [],
  },
  Loading: false,
  Success: false,
  Error: false,
};

/* Slices */

const patientSlice = createSlice({
  name: "Patients",
  initialState,
  reducers: {
    patientList: (state, action) => {
      state.List = action.payload;
      state.Loading = false;
      state.Error = false;
    },
    Loading: (state, action) => {
      state.Loading = true;
      state.Error = false;
      state.Success = false;
    },
    CreateStep: (state, action) => {
      state.Create = action.payload;
      state.Loading = false;
    },
    CreateSuccess: (state, action) => {
      state.Create = initialState.Create;
      state.Loading = false;
      state.Success = true;
    },
    CreateError: (state, action) => {
      state.Error = action.payload;
      state.Loading = false;
    },
    CreateReset: () => initialState,
    DeleteSuccess: (state, action) => {
      state.List.filter((patient) => patient.id !== action.payload.id);
      state.Loading = false;
    },
  },
});

export const { Loading, CreateStep, CreateSuccess, CreateError, CreateReset, DeleteSuccess, patientList } =
  patientSlice.actions;
export default patientSlice.reducer;

/* Actions */

const SERVER_URL = "http://localhost/api/ST0001/";

// Patients

export const resetPatients = () => async (dispatch) => {
  dispatch(CreateReset());
};

export const fetchPatients = (search) => async (dispatch) => {
  dispatch(Loading());
  try {
    await axios.get(SERVER_URL + `patients?search=${search}`).then((response) => {
      setTimeout(() => {
        dispatch(patientList(response.data));
      }, 2000);
    });
  } catch (error) {
    return console.error(error.message);
  }
};

export const createStep = (instance) => async (dispatch) => {
  dispatch(Loading());
  setTimeout(() => {
    dispatch(CreateStep(instance));
  }, 2000);
};

export const createPatient = (instance) => async (dispatch) => {
  dispatch(Loading());
  try {
    // Success
    const { data } = await axios.post(SERVER_URL + "patients/create/", instance);
    setTimeout(() => {
      dispatch(CreateSuccess(data));
    }, 3000);

    // Error
  } catch (error) {
    setTimeout(() => {
      console.log(error.response);
      dispatch(CreateError(error.response.data ? error.response.data.error : error.message));
    }, 3000);
  }
};
