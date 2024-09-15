import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    activeItem: "",
};

const sidebarSlice = createSlice({
    name: "sidebar",
    initialState,
    reducers: {
        setActiveItem: (state, action) => {
            state.activeItem = action.payload; 
        },
    },
});

export const { setActiveItem } = sidebarSlice.actions;

export default sidebarSlice.reducer;
