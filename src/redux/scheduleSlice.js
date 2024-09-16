import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isModalOpen: false,
    selectedClinic: null,
    selectedType: null, // 'doctor' or 'pharmacy'
    selectedDate: null,
    selectedTime: null,
};

const scheduleSlice = createSlice({
    name: "schedule",
    initialState,
    reducers: {
        openModal: (state, action) => {
            state.isModalOpen = true;
            state.selectedClinic = action.payload.clinic;
            state.selectedType = action.payload.type;
        },
        closeModal: (state) => {
            state.isModalOpen = false;
            state.selectedClinic = null;
            state.selectedType = null;
        },
        setDate: (state, action) => {
            state.selectedDate = action.payload;
        },
        setTime: (state, action) => {
            state.selectedTime = action.payload;
        },
    },
});

export const { openModal, closeModal, setDate, setTime } = scheduleSlice.actions;
export default scheduleSlice.reducer;
