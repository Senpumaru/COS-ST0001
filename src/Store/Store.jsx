import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import blockSlice from "./Slices/blockSlice.jsx";

import patientSlice from "./Slices/patientSlice";
import slideSlice from "./Slices/slideSlice";

const reducer = combineReducers({
  Patients: patientSlice,
  Blocks: blockSlice,
  Slides: slideSlice,
});

const store = configureStore({
  reducer,
});

export default store;
