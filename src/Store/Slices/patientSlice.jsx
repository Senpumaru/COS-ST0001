import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// State

export const initialState = {
  List: [],
  Create: {
    ambulatoryNumber: "",
    firstName: "",
    middleName: "",
    lastName: "",
    address: "",
    dateBirth: null,
  },
  Loading: false,
  Success: false,
  Error: false,
};

// Slice

const patientSlice = createSlice({
  name: "Patients",
  initialState,
  reducers: {
    patientList: (state, action) => {
      state.List = action.payload;
      state.Loading = true;
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
      state.Create = action.payload;
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

// Actions

const SERVER_URL = "http://localhost/api/ST0001/";

export const fetchPatients = () => async (dispatch) => {
  try {
    await axios.get(SERVER_URL + "patients/").then((response) => {
      dispatch(patientList(response.data));
    });
  } catch (error) {
    return console.error(error.message);
  }
};

export const createStep = (instance) => async (dispatch) => {
  dispatch(Loading());
  setTimeout(() => {
    dispatch(CreateStep(instance));
  }, 1000);
};

export const createPatient = (instance) => async (dispatch) => {
  dispatch(Loading());
  try {
    const { data } = await axios.post(SERVER_URL + "patients/create/", instance);
    setTimeout(() => {
      dispatch(CreateSuccess(data));
    }, 2000);

    setTimeout(() => {
      dispatch(CreateReset());
    }, 10000);
  } catch (error) {
    setTimeout(() => {
      dispatch(CreateError(error.response.data.error));
    }, 2000);

    setTimeout(() => {
      dispatch(CreateReset());
    }, 10000);
  }
};
