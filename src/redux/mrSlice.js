import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the initial state
const initialState = {
    mrs: [],
    loading: false,
    error: null,
};

export const deleteMR = createAsyncThunk(
  "doctorList/deleteMR",
  async ({ id }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await axios.post(
          "https://mnlifescience.vercel.app/api/admin/delete-mr",
          {
            id // MR ID to be deleted
          },
          {
            headers: {
              Authorization: `Bearer ${token}`, // Attach the token in the header
            }
          }
        );
        console.log(response);
        return id;
      } else {
        return rejectWithValue("No token found in localStorage");
      }
    } catch (error) {
      return rejectWithValue(error.message || "An error occurred while deleting the MR");
    }
  }
);

  

// Create the slice
const mrSlice = createSlice({
    name: 'mr',
    initialState,
    reducers: {
        setMRS: (state, action) => {
            state.mrs = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(deleteMR.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteMR.fulfilled, (state, action) => {
                state.loading = false;
                state.mrs = state.mrs.filter((mr) => mr._id !== action.payload._id);
            })
            .addCase(deleteMR.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

// Export actions and reducer
export const { setMRS } = mrSlice.actions;
export default mrSlice.reducer;
