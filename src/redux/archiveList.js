import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchArchivedClinics = createAsyncThunk(
    "archiveList/fetchArchivedClinics",
    async (_, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await axios.get(
            "https://mnlifescience.vercel.app/api/getArchives",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          return response.data;
          console.log(response)
        } else {
          return rejectWithValue("No token found in localStorage");
        }
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );

const archiveListSlice = createSlice({
  name: 'archiveList',
  initialState: {
    archivedClinics: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch archived clinics
      .addCase(fetchArchivedClinics.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchArchivedClinics.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.archivedClinics = action.payload;
      })
      .addCase(fetchArchivedClinics.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
  },
});

export default archiveListSlice.reducer;