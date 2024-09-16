import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  todaysSchedule: [],
  upcomingSchedule: [],
  loading: false,
  error: null,
};

const listScheduleSlice = createSlice({
  name: 'listSchedule',
  initialState,
  reducers: {
    setSchedules: (state, action) => {
      state.todaysSchedule = action.payload.todaysSchedule;
      state.upcomingSchedule = action.payload.upcomingSchedule;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  },
});

export const { setSchedules, setLoading } = listScheduleSlice.actions;
export default listScheduleSlice.reducer;
