import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 1. Use createAsyncThunk to fetch clinics
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
        console.log(response.data);
      } else {
        return rejectWithValue("No token found in localStorage");
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const doctorListSlice = createSlice({
  name: "doctorList",
  initialState: {
    clinics: [],
    filteredClinics: [],
    dateRange: { startDate: null, endDate: null },
    selectedMR: null,
    selectedGrade: null,
    status: "idle",
    error: null,
  },
  reducers: {
    setDateRange: (state, action) => {
      state.dateRange = action.payload;
    },
    setSelectedMR: (state, action) => {
      state.selectedMR = action.payload;
    },
    setSelectedGrade: (state, action) => {
      state.selectedGrade = action.payload;
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
        state.clinics = action.payload; // Clinics data stored here
      })
      .addCase(fetchClinics.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload; // Error is handled here
      });
  },
});

export const { setDateRange, setSelectedMR, setSelectedGrade, setFilteredClinics } =
  doctorListSlice.actions;

export default doctorListSlice.reducer;
