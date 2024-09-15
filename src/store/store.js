// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import sidebarReducer from "../redux/sidebarSlice";
import authReducer from "../redux/authSlice";

const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
    auth: authReducer 
  },
});

export default store;
