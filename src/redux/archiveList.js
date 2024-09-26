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
        console.log("unarchived", error);
        return rejectWithValue(error.message);
      }
    }
  );

  export const deleteArchivedClinic = createAsyncThunk(
    "archiveList/deleteArchivedClinic",
    async (id, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          await axios.delete(
            "https://mnlifescience.vercel.app/api/admin/delete-clinic",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              data: { id }
            }
          );
          return id;
        } else {
          return rejectWithValue("No token found in localStorage");
        }
      } catch (error) {
        return rejectWithValue(error.message || "An error occurred while deleting the archived clinic");
      }
    }
  );

  export const unArchiveClinic = createAsyncThunk(
    "doctorList/unArchiveClinic",
    async ({ clinicId }, { rejectWithValue, getState }) => {
      try {
        // Retrieve token from localStorage (or Redux state if you use it for auth)
        const token = localStorage.getItem("token"); 
  
        // Check if token is missing
        if (!token) {
          throw new Error("No token found! Please log in.");
        }
        console.log("Unarchiving clinic with ID:", clinicId);
        const response = await axios.patch(
          `https://mnlifescience.vercel.app/api/admin/unarchieve-clinic`,
          { clinicId },
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the request headers
            },
          }
        );
  
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to archive clinic");
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
      .addCase(unArchiveClinic.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(unArchiveClinic.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Optionally, you might want to remove the unarchived clinic from the archivedClinics array
        state.archivedClinics = state.archivedClinics.filter(clinic => clinic._id !== action.payload.clinic._id);
      })
      .addCase(unArchiveClinic.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(deleteArchivedClinic.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteArchivedClinic.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.archivedClinics = state.archivedClinics.filter(clinic => clinic._id !== action.payload);
      })
      .addCase(deleteArchivedClinic.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default archiveListSlice.reducer;