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
        return response.data;
      } else {
        return rejectWithValue("No token found in localStorage");
      }
    } catch (error) {
      return rejectWithValue(error.message || "An error occurred while deleting the clinic");
    }
  }
);


const initialDateRange = {
  startDate: moment().startOf('month').toDate(),
  endDate: moment().endOf('month').toDate()
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
      // Ensure we have valid date range values
      const newStartDate = action.payload?.startDate || state.dateRange.startDate;
      const newEndDate = action.payload?.endDate || state.dateRange.endDate;
      
      state.dateRange = {
        startDate: moment(newStartDate).isValid() ? newStartDate : state.dateRange.startDate,
        endDate: moment(newEndDate).isValid() ? newEndDate : state.dateRange.endDate
      };
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
        // Remove the deleted clinic from the state using the returned ID
        state.clinics = state.clinics.filter(clinic => clinic._id !== action.payload);
        state.filteredClinics = state.filteredClinics.filter(clinic => clinic._id !== action.payload);
      })
      .addCase(deleteClinic.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

const filterClinics = (state) => {
  return state.clinics.filter(clinic => {
    const clinicDate = moment(clinic.createdAt);
    const startDate = moment(state.dateRange.startDate || initialDateRange.startDate);
    const endDate = moment(state.dateRange.endDate || initialDateRange.endDate);
    
    const isInDateRange = clinicDate.isBetween(startDate, endDate, null, '[]');
    const matchesGrade = state.selectedGrade ? clinic.grade === state.selectedGrade : true;
    const matchesMR = state.selectedMR ? clinic.createdBy.name === state.selectedMR : true;

    return isInDateRange && matchesGrade && matchesMR;
  });
};

export const { setDateRange, setSelectedMR, setSelectedGrade, setFilteredClinics } = doctorListSlice.actions;

export default doctorListSlice.reducer;