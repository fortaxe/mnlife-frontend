import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import moment from "moment";

export const fetchClinics = createAsyncThunk(
  "doctorList/fetchClinics",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await axios.get(
          "https://mnlifescience.vercel.app/api/getClinics",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
        return response.data;

      } else {
        return rejectWithValue("No token found in localStorage");
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteClinic = createAsyncThunk(
  "doctorList/deleteClinic",
  async ({id}, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await axios.delete(
          "https://mnlifescience.vercel.app/api/admin/delete-clinic",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            data: { id } // Move the id to the data property
          }
        );
        return id;
      } else {
        return rejectWithValue("No token found in localStorage");
      }
    } catch (error) {
      return rejectWithValue(error.message || "An error occurred while deleting the clinic");
    }
  }
);

export const updateClinic = createAsyncThunk(
  "doctorList/updateClinic",
  async (updatedClinic, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await axios.patch(
          "https://mnlifescience.vercel.app/api/admin/edit-clinic",
          updatedClinic,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return updatedClinic;
      } else {
        return rejectWithValue("No token found in localStorage");
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update clinic");
    }
  }
);

// Archive clinic thunk with console logs
export const archiveClinic = createAsyncThunk(
  "doctorList/archiveClinic",
  async ({ clinicId }, { rejectWithValue, getState }) => {
    try {
      // Retrieve token from localStorage (or Redux state if you use it for auth)
      const token = localStorage.getItem("token"); 

      // Check if token is missing
      if (!token) {
        throw new Error("No token found! Please log in.");
      }

      const response = await axios.post(
        `https://mnlifescience.vercel.app/api/admin/archieve-clinic`,
        { clinicId },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the request headers
          },
        }
      );

      return { clinicId };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to archive clinic");
    }
  }
);

export const initialDateRange = {
  startDate: null,
  endDate: null
};

const doctorListSlice = createSlice({
  name: "doctorList",
  initialState: {
    clinics: [],
    filteredClinics: [],
    dateRange: initialDateRange,
    selectedMR: null,
    selectedGrade: null,
    status: "idle",
    error: null,
  },
  reducers: {
    setDateRange: (state, action) => {
      console.log("Setting date range:", action.payload);
      state.dateRange = action.payload;
      state.filteredClinics = filterClinics(state);
    },
    clearDateRange: (state) => {
      state.dateRange = initialDateRange;
      state.filteredClinics = filterClinics(state);
    },
    setSelectedMR: (state, action) => {
      state.selectedMR = action.payload;
      state.filteredClinics = filterClinics(state);
    },
    setSelectedGrade: (state, action) => {
      state.selectedGrade = action.payload;
      state.filteredClinics = filterClinics(state);
    },
    setFilteredClinics: (state, action) => {
      state.filteredClinics = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClinics.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchClinics.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.clinics = action.payload;
        console.log("Filtering clinics with date range:", state.dateRange);
        state.filteredClinics = filterClinics(state);
      })
      .addCase(fetchClinics.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deleteClinic.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteClinic.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Use the ID from the action payload to remove the deleted clinic
        state.clinics = state.clinics.filter(clinic => clinic._id !== action.payload);
        state.filteredClinics = state.filteredClinics.filter(clinic => clinic._id !== action.payload);
      })
      .addCase(deleteClinic.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(archiveClinic.pending, (state) => {
        state.status = "loading";
      })
      .addCase(archiveClinic.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Remove the archived clinic using the clinicId from the action payload
        state.clinics = state.clinics.filter(clinic => clinic._id !== action.payload.clinicId);
        state.filteredClinics = state.filteredClinics.filter(clinic => clinic._id !== action.payload.clinicId);
      })
      .addCase(archiveClinic.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateClinic.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateClinic.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.clinics.findIndex(clinic => clinic._id === action.payload._id);
        if (index !== -1) {
          state.clinics[index] = action.payload; // Update the specific clinic
        }
        state.filteredClinics = filterClinics(state);
      })
      .addCase(updateClinic.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  }
  
});

const filterClinics = (state) => {
  if (!state.dateRange.startDate && !state.dateRange.endDate && !state.selectedMR && !state.selectedGrade) {
    return state.clinics; // Return all clinics if no filters are applied
  }

  return state.clinics.filter(clinic => {
    const clinicDate = moment(clinic.createdAt);
    const startDate = state.dateRange.startDate ? moment(state.dateRange.startDate) : null;
    const endDate = state.dateRange.endDate ? moment(state.dateRange.endDate) : null;

    const isInDateRange = (startDate && endDate) ? 
      clinicDate.isBetween(startDate, endDate, null, '[]') : 
      true;

    const matchesGrade = state.selectedGrade ? clinic.grade === state.selectedGrade : true;
    const matchesMR = state.selectedMR ? clinic?.createdBy?.name === state.selectedMR : true;

    return isInDateRange && matchesGrade && matchesMR;
  });
};

export const { setDateRange, setSelectedMR, setSelectedGrade, setFilteredClinics, clearDateRange } = doctorListSlice.actions;

export default doctorListSlice.reducer;