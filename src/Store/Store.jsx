import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import blockSlice from './Slices/blockSlice';

import patientSlice from "./Slices/patientSlice"


const reducer = combineReducers({
  Patients: patientSlice,
  Blocks: blockSlice

})

const store = configureStore({
    reducer
});

export default store;