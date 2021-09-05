import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// State
export const initialState = {
  List: [],
  Create: {
    Patient:"",
    blockGroupCodes: [],
  },
  Loading: false,
  Success: false,
  Error: false,
};

/* Slices */
const blockSlice = createSlice({
  name: "Blocks",
  initialState,
  reducers: {
    blockList: (state, action) => {
      state.List = action.payload;
      state.Loading = false;
      state.Error = false;
    },
    Loading: (state, action) => {
      state.Loading = true;
      state.Error = false;
      state.Success = false;
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
      
      state.Loading = false;
    },
  },
});

export const { Loading, CreateStep, CreateSuccess, CreateError, CreateReset, DeleteSuccess, blockList } =
  blockSlice.actions;
export default blockSlice.reducer;

/* Actions */

const SERVER_URL = "http://localhost/api/ST0001/";

// Patients

export const resetBlocks = () => async (dispatch) => {
  dispatch(CreateReset());
};

export const fetchBlocks = (search) => async (dispatch) => {
  dispatch(Loading());
  try {
    await axios.get(SERVER_URL + `blocks?search=${search}`).then((response) => {
      setTimeout(() => {
        dispatch(blockList(response.data));
      }, 2000);
    });
  } catch (error) {
    return console.error(error.message);
  }
};

export const createBlocks = (instance) => async (dispatch) => {
  dispatch(Loading());
  try {
    // Success
    const { data } = await axios.post(SERVER_URL + "blocks/create/", instance);
    setTimeout(() => {
      dispatch(CreateSuccess(data));
    }, 2000);

    // Error
  } catch (error) {
    setTimeout(() => {
      console.log(error.response);
      dispatch(CreateError(error.response.data ? error.response.data.error : error.message));
    }, 2000);
  }
};
