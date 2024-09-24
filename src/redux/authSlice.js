import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAdminLoggedIn: !!localStorage.getItem("token"), // Check if token exists in localStorage
    token: localStorage.getItem("token"),
  },
  reducers: {
    setLoginState(state, action) {
      state.isAdminLoggedIn = action.payload.isLoggedIn;
      state.token = action.payload.token;
    },
    logout(state) {
      state.isAdminLoggedIn = false;
      state.token = null;
    },
  },
});

export const { setLoginState, logout } = authSlice.actions;
export default authSlice.reducer;
