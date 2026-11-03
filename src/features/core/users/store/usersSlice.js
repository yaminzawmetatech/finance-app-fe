import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import usersService from "../services/usersService";
// import Cookies from "js-cookie";
const initialState = {
  users: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
  user: [],
  cmcoUsers: [],
  CMCO: [],
  agents: []
};

// Create new user
export const createUser = createAsyncThunk(
  "users/create",
  async (userData, thunkAPI) => {
    try {
      return await usersService.createUser(userData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get user users
export const getUsers = createAsyncThunk(
  "users",
  async (userRole, thunkAPI) => {
    try {
      return await usersService.getUsers(userRole);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get user users
export const getAllUsers = createAsyncThunk(
  "users/getAllUsers",
  async (userRole, thunkAPI) => {
    try {
      return await usersService.getAllUsers(userRole);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get cmco
export const getCMCO = createAsyncThunk(
  "cmco",
  async (userRole, thunkAPI) => {
    try {
      return await usersService.getUsers(userRole);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);


// Get agent
export const getAgents = createAsyncThunk(
  "agents",
  async (userRole, thunkAPI) => {
    try {
      return await usersService.getUsers(userRole);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete user
export const deleteUser = createAsyncThunk(
  "users/delete",
  async (id, thunkAPI) => {
    try {
      return await usersService.deleteUser(id);
    } catch (error) {
      console.log(error);
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateUser = createAsyncThunk(
  "users/update",
  async ({ id, newData }, thunkAPI) => {
    try {
      return await usersService.updateUser(id, newData);
    } catch (error) {
      console.log(error);
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get user users
export const getUserByUuid = createAsyncThunk("user", async (_, thunkAPI) => {
  try {
    const user = localStorage.getItem("user");
    return await usersService.getUserByUuid(JSON.parse(user).uuid);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const assignCMCOUser = createAsyncThunk(
  "cmco/assign",
  async (data, thunkAPI) => {
    try {
      return await usersService.assignCMCOUser(data);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getCMCOUserByTownshipId = createAsyncThunk(
  "cmco/get",
  async (id, thunkAPI) => {
    try {
      return await usersService.getCMCOUserByTownshipId(id);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getAgentsByDealerId = createAsyncThunk(
  "agent/get",
  async (id, thunkAPI) => {
    try {
      return await usersService.getAgentsByDealerId(id);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteCMCOUser = createAsyncThunk(
  "cmco/delete",
  async ({ district_id, user_id }, thunkAPI) => {
    try {
      return await usersService.deleteCMCOUser(district_id, user_id);
    } catch (error) {
      console.log(error);
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users = action.payload.data;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAllUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users = action.payload.data;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getCMCO.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCMCO.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.CMCO = action.payload.data;
      })
      .addCase(getCMCO.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAgents.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAgents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.agents = action.payload.data;
      })
      .addCase(getAgents.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users = state.users.filter(
          (user) => user._id !== action.payload.id
        );
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users = action.payload.data;
        // state.users = state.users.filter(
        //   (department) => department._id !== action.payload.id
        // )
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getUserByUuid.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserByUuid.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.data;
      })
      .addCase(getUserByUuid.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(assignCMCOUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(assignCMCOUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.cmcoUsers.push(action.payload);
      })
      .addCase(assignCMCOUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getCMCOUserByTownshipId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCMCOUserByTownshipId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.cmcoUsers = action.payload.data;
      })
      .addCase(getCMCOUserByTownshipId.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteCMCOUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCMCOUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.cmcoUsers = state.cmcoUsers.filter(
          (user) => user._id !== action.payload.id
        );
      })
      .addCase(deleteCMCOUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAgentsByDealerId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAgentsByDealerId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.agents = action.payload.data;
      })
      .addCase(getAgentsByDealerId.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      ;
  },
});

export const { reset } = userSlice.actions;
export default userSlice.reducer;
