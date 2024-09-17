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
    },
    updateScheduleStatus: (state, action) => {
      const { scheduleCallId, updateStatus } = action.payload;

      // Update status in today's schedule
      state.todaysSchedule = state.todaysSchedule.map((schedule) =>
        schedule._id === scheduleCallId ? { ...schedule, updateStatus } : schedule
      );

      // Update status in upcoming schedule
      state.upcomingSchedule = state.upcomingSchedule.map((schedule) =>
        schedule._id === scheduleCallId ? { ...schedule, updateStatus } : schedule
      );
    },
  },
});

export const { setSchedules, setLoading, updateScheduleStatus  } = listScheduleSlice.actions;
export default listScheduleSlice.reducer;
