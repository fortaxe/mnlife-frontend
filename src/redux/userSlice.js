import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    isUserLoggedIn: false,
    token: null,
  },
  reducers: {
    setUserLoginState(state, action) {
      state.isUserLoggedIn = action.payload.isLoggedIn;
      state.token = action.payload.token;
    },
    userLogout(state) {
      state.isUserLoggedIn = false;
      state.token = null;
    },
  },
});

export const { setUserLoginState, userLogout } = userSlice.actions;
export default userSlice.reducer;
