import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// State
export const initialState = {
  List: { Data: [], Loading: false, Success: false, Error: false },
  Create: {
    Loading: false,
    Success: false,
    Error: false,
    Data: {
      Patient:"",
      blockCodes: [],
    },
  },
  Details: { Data: null, Loading: false, Success: false, Error: false },
  Update: { Data: null, Loading: false, Success: false, Error: false },
};

/* Slices */

const blockSlice = createSlice({
  name: "Blocks",
  initialState,
  reducers: {
    ListFetch: (state, action) => {
      state.List.Data = action.payload;
      state.List.Loading = false;
      state.List.Error = false;
    },
    ListLoading: (state, action) => {
      state.List.Loading = true;
      state.List.Error = false;
    },
    CreateLoading: (state, action) => {
      state.Create.Loading = true;
      state.Create.Error = false;
      state.Create.Success = false;
    },
    CreateStep: (state, action) => {
      state.Create.Data = action.payload;
      state.Create.Loading = false;
      state.Create.Error = false;
      state.Create.Success = false;
    },
    CreateSuccess: (state, action) => {
      state.Create.Data = initialState.Create.Data;
      state.Create.Loading = false;
      state.Create.Error = false;
      state.Create.Success = action.payload;
    },
    CreateError: (state, action) => {
      state.Create.Loading = false;
      state.Create.Error = action.payload;
      state.Create.Success = false;
    },
    CreateReset: (state, action) => {
      state.Create.Loading = false;
      state.Create.Error = false;
      state.Create.Success = false;
    },
    DetailsLoading: (state, action) => {
      state.Details.Loading = true;
    },
    DetailsSuccess: (state, action) => {
      state.Details.Data = action.payload;
      state.Details.Loading = false;
      state.Details.Success = true;
    },
    DetailsError: (state, action) => {
      state.Details.Loading = false;
      state.Details.Error = action.payload;
      state.Details.Success = false;
    },
    DetailsReset: (state, action) => {
      state.Details.Data = initialState.Details.Data;
      state.Details.Loading = true;
      state.Details.Error = false;
      state.Details.Success = false;
    },
    UpdateLoading: (state, action) => {
      state.Update.Loading = true;
    },
    UpdateSuccess: (state, action) => {
      state.Update.Data = action.payload;
      state.Update.Loading = true;
      state.Update.Success = true;
    },
    UpdateError: (state, action) => {
      state.Update.Error = action.payload;
      state.Update.Loading = false;
    },
    UpdateReset: (state, action) => {
      state.Update.Data = initialState.Update.Data;
      state.Update.Loading = false;
      state.Update.Success = false;
      state.Update.Error = false;
    },
    DeleteSuccess: (state, action) => {
      state.Update.List.filter((patient) => patient.id !== action.payload.id);
      state.Update.Loading = false;
    },
  },
});

export const {
  ListLoading,
  ListFetch,
  CreateLoading,
  CreateStep,
  CreateSuccess,
  CreateError,
  CreateReset,
  UpdateLoading,
  UpdateSuccess,
  UpdateError,
  UpdateReset,
  DetailsLoading,
  DetailsSuccess,
  DetailsError,
  DetailsReset,
  DeleteSuccess,
} = blockSlice.actions;
export default blockSlice.reducer;

/* Actions */

const SERVER_URL = process.env.REACT_APP_API_SERVER;

// Blocks

export const resetBlocks = () => async (dispatch) => {
  dispatch(CreateReset());
};

export const fetchBlocks = (search) => async (dispatch) => {
  dispatch(ListLoading());
  try {
    await axios.get(SERVER_URL + `api/ST0001/blocks?search=${search}`).then((response) => {
      setTimeout(() => {
        dispatch(ListFetch(response.data));
      }, 2000);
    });
  } catch (error) {
    return console.error(error.message);
  }
};

export const createStep = (instance) => async (dispatch) => {
  dispatch(CreateLoading());
  setTimeout(() => {
    dispatch(CreateStep(instance));
  }, 2000);
};

export const createBlocks = (instance) => async (dispatch) => {
  dispatch(CreateLoading());
  try {
    // Success
    const { data } = await axios.post(SERVER_URL + "api/ST0001/blocks/create/", instance);
    setTimeout(() => {
      dispatch(CreateSuccess(data));
    }, 3000);

    // Error
  } catch (error) {
    setTimeout(() => {
      console.log("Error message:", error.message);
      console.log("Error response:", error.response);
      dispatch(CreateError(error.response.data.error ? error.response.data.error : error.message));
    }, 3000);
  }
};

export const detailBlock = (uuid) => async (dispatch) => {
  dispatch(DetailsLoading());
  try {
    // Success
    const { data } = await axios.get(SERVER_URL + `api/ST0001/blocks/${uuid}/`);
    setTimeout(() => {
      dispatch(DetailsSuccess(data));
    }, 3000);

    // Error
  } catch (error) {
    setTimeout(() => {
      console.log(error.message);
      console.log(error.response);
      dispatch(DetailsError(error.response.data.error ? error.response.data.error : error.message));
    }, 3000);
  }
};

export const updateBlock = (instance) => async (dispatch) => {
  dispatch(UpdateLoading());
  try {
    // Success
    const { data } = await axios.put(SERVER_URL + `api/ST0001/blocks/${instance["uuid"]}/update/`, instance);
    setTimeout(() => {
      dispatch(UpdateSuccess(data));
    }, 1000);

    setTimeout(() => {
      dispatch(DetailsReset());
    });

    // Error
  } catch (error) {
    setTimeout(() => {
      console.log(error.message);
      console.log(error.response);
      dispatch(UpdateError(error.response.data.error ? error.response.data.error : error.message));
    }, 3000);
  }
};
