import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'

import patientSlice from "./Slices/patientSlice"


const reducer = combineReducers({
  Patients: patientSlice

})

const store = configureStore({
    reducer
});

export default store;