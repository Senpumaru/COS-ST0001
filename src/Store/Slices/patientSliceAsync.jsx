import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

const BASE_URL = "http://localhost/api/ST0001";

export const GetPatients = createAsyncThunk(
  "patient/getPatients",
  async () => await axios.get(`${BASE_URL}/patients/`)
);

export const CreatePatient = createAsyncThunk(
  "patient/createPost",
  async (post) => await axios.post(`${BASE_URL}/patients/create`, post)
);



export const initialState = {
  posts: [],
  loading: false,
  error: null,
};
export const postSlice = createSlice({
name: "post",
initialState: initialState,
extraReducers: {
   [GetPatients.fulfilled]: (state, action) => {
     state.posts = action.payload.data;
   },
   [GetPatients.rejected]: (state, action) => {
    state.posts = [];
   },
   [CreatePatient.fulfilled]: (state, action) => {
   state.posts.unshift(action.payload.data);
   },
 },
});
export default postSlice.reducer;