import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the initial state
const initialState = {
    mrs: [],
    loading: false,
    error: null,
   
};

export const uploadCard = createAsyncThunk(
  "doctorList/uploadCard",
  async ({ mrId, cardType, file }, { rejectWithValue }) => {
      try {
          const token = localStorage.getItem("token");
          if (token) {
              const formData = new FormData();
              formData.append(cardType, file);
              formData.append("mrId", mrId); // Add MR ID to the form data

              const endpoint = cardType === "aadhaarCard"
                  ? "https://mnlifescience.vercel.app/api/admin/update-aadhaar"
                  : "https://mnlifescience.vercel.app/api/admin/update-pan";

              const response = await axios.patch(endpoint, formData, {
                  headers: {
                      Authorization: `Bearer ${token}`,
                      "Content-Type": "multipart/form-data",
                  },
              });

              return { mrId, cardType, updatedMR: response.data.updatedMR };
          } else {
              return rejectWithValue("No token found in localStorage");
          }
      } catch (error) {
          return rejectWithValue(error.message || "An error occurred while uploading the file");
      }
  }
);


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

export const fetchArchivedMrs = createAsyncThunk(
  "doctorList/fetchArchivedMrs",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await axios.get(
          "https://mnlifescience.vercel.app/api/get-archived-mrs",
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
      console.log("unarchived", error);
      return rejectWithValue(error.message);
    }
  }
);

export const unarchieveMr = createAsyncThunk(
  "doctorList/unarchieveMR",
  async ({ id }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await axios.post(
          "https://mnlifescience.vercel.app/api/admin/unarchive-mr",
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
            })
            .addCase(uploadCard.pending, (state) => {
              state.loading = true;
              
              state.error = null;
          })
          .addCase(uploadCard.fulfilled, (state, action) => {
              state.loading = false;
              
              state.mrs = state.mrs.map(mr =>
                mr._id === action.payload.mrId
                ? action.payload.updatedMR
                : mr
              );
          })
          .addCase(uploadCard.rejected, (state, action) => {
              state.loading = false;
             
              state.error = action.payload;
          })
          .addCase(unarchieveMr.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(unarchieveMr.fulfilled, (state, action) => {
            state.loading = false;
            state.mrs = state.mrs.filter((mr) => mr._id !== action.payload._id);
        })
        .addCase(unarchieveMr.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(fetchArchivedMrs.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(fetchArchivedMrs.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.archivedClinics = action.payload;
        })
        .addCase(fetchArchivedMrs.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        })
    },
});

// Export actions and reducer
export const { setMRS } = mrSlice.actions;
export default mrSlice.reducer;
