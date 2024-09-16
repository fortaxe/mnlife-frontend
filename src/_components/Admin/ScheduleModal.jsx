import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeModal, setDate, setTime } from "@/redux/scheduleSlice";
import Calendar from "react-calendar"; // Ensure this is installed
import 'react-calendar/dist/Calendar.css';
import { toast } from "react-toastify";
import axios from "axios";

const ScheduleModal = ({ selectedClinic, selectedType, onClose }) => {
    const dispatch = useDispatch();
    const { selectedDate, selectedTime } = useSelector((state) => state.schedule);

    const handleDateChange = (date) => {
        dispatch(setDate(date));
    };

    const handleTimeChange = (e) => {
        dispatch(setTime(e.target.value));
    };

    const handleScheduleCall = async () => {
        try {
            const token = localStorage.getItem("token");

            const apiUrl = selectedType === "doctor"
                ? "https://mnlifescience.vercel.app/api/schedule/call/doctor"
                : "https://mnlifescience.vercel.app/api/schedule/call/pharmacy";

            const response = await axios.post(apiUrl, {
                clinicId: selectedClinic._id,
                date: selectedDate,
                time: selectedTime,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            toast.success(`${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} schedule call created successfully!`);
            onClose();
        } catch (error) {
            toast.error("Error scheduling call. Try again later.");
            console.error(error);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg">
                <h2 className="text-lg font-bold mb-4">Schedule {selectedType === "doctor" ? "Doctor" : "Pharmacy"} Call</h2>
                
                {/* Calendar for selecting date */}
                <div className="mb-4">
                    <Calendar onChange={handleDateChange} value={selectedDate} />
                </div>
                
                {/* Time selection */}
                <div className="mb-4">
                    <label className="block mb-2">Select Time:</label>
                    <input
                        type="time"
                        value={selectedTime}
                        onChange={handleTimeChange}
                        className="border border-gray-300 p-2 rounded"
                    />
                </div>
                
                <button
                    onClick={handleScheduleCall}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Schedule Call
                </button>
                <button
                    onClick={onClose}
                    className="ml-2 bg-gray-500 text-white px-4 py-2 rounded"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default ScheduleModal;
