import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import approvalWorkflowService from '../services/approvalWorkflowService'

const initialState = {
  approvalWorkflows: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

// Get Data
export const getApprovalWorkflows = createAsyncThunk(
    'approvalWorkflows',
    async (_, thunkAPI) => {
      try {
        const token = thunkAPI.getState().auth.user.access_token
        return await approvalWorkflowService.getApprovalWorkflows(token)
      } catch (error) {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString()
        return thunkAPI.rejectWithValue(message)
      }
    }
)

// Create New
export const createApprovalWorkflow = createAsyncThunk(
  'approvalWorkflows/create',
  async (approvalWorkflowData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.access_token
      return await approvalWorkflowService.createApprovalWorkflow(approvalWorkflowData, token)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// update 
export const updateApprovalWorkflow = createAsyncThunk(
    'approvalWorkflows/update',
    async ({ id,newData }, thunkAPI) => {
      try {
        const token = thunkAPI.getState().auth.user.access_token
        return await approvalWorkflowService.updateApprovalWorkflow(id, newData, token)
      } catch (error) {
        console.log(error)
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString()
        return thunkAPI.rejectWithValue(message)
      }
    }
)

// Delete 
export const deleteApprovalWorkflow = createAsyncThunk(
  'approvalWorkflows/delete',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.access_token
      return await approvalWorkflowService.deleteApprovalWorkflow(id, token)
    } catch (error) {
      console.log(error)
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const approvalWorkflowSlice = createSlice({
  name: 'approvalWorkflows',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createApprovalWorkflow.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createApprovalWorkflow.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.approvalWorkflows.push(action.payload)
      })
      .addCase(createApprovalWorkflow.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getApprovalWorkflows.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getApprovalWorkflows.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.approvalWorkflows = action.payload.data
      })
      .addCase(getApprovalWorkflows.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(deleteApprovalWorkflow.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteApprovalWorkflow.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.approvalWorkflows = state.approvalWorkflows.filter(
          (approvalWorkflow) => approvalWorkflow._id !== action.payload.id
        )
      })
      .addCase(deleteApprovalWorkflow.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(updateApprovalWorkflow.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateApprovalWorkflow.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.approvalWorkflows = action.payload.data
      })
      .addCase(updateApprovalWorkflow.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { reset } = approvalWorkflowSlice.actions
export default approvalWorkflowSlice.reducer
