import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeModal, setDate, setTime } from "@/redux/scheduleSlice";
import Calendar from "react-calendar"; // Ensure this is installed
import 'react-calendar/dist/Calendar.css';
import { toast } from "react-toastify";
import axios from "axios";

const ScheduleModal = ({ selectedClinic, selectedType, onClose }) => {
    const dispatch = useDispatch();
    const { selectedDate, selectedTime } = useSelector((state) => state.schedule);
    const [timeFormat, setTimeFormat] = useState("AM");

    const handleDateChange = (date) => {
        dispatch(setDate(date));
    };

    const handleTimeChange = (e) => {
        dispatch(setTime(e.target.value));
    };

    const handleTimeFormatChange = (e) => {
        setTimeFormat(e.target.value);
    };

    // Helper function to combine time with AM/PM and convert to 24-hour format
    const convertTimeTo24HourFormat = (time, format) => {
        let [hours, minutes] = time.split(":").map(Number);
        
        if (format === "PM" && hours < 12) {
            hours += 12;
        } else if (format === "AM" && hours === 12) {
            hours = 0; // Convert 12 AM to 00:00 in 24-hour format
        }

        // Return the formatted time string in 24-hour format
        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    };

    const handleScheduleCall = async () => {
        try {
            const token = localStorage.getItem("token");

            // Convert selected date to correct local time (IST) before sending
            const localDate = new Date(selectedDate);
            const utcOffset = localDate.getTimezoneOffset() * 60000; // Get timezone offset in milliseconds
            const adjustedDate = new Date(localDate.getTime() - utcOffset); // Adjust to local timezone

            // Convert the selected time to 24-hour format based on AM/PM selection
            const formattedTime = convertTimeTo24HourFormat(selectedTime, timeFormat);

            console.log("Adjusted Date (to be sent):", adjustedDate);
            console.log("Time being sent (24-hour format):", formattedTime);

            const apiUrl = selectedType === "doctor"
                ? "https://mnlifescience.vercel.app/api/schedule/call/doctor"
                : "https://mnlifescience.vercel.app/api/schedule/call/pharmacy";

            const response = await axios.post(apiUrl, {
                clinicId: selectedClinic._id,
                date: adjustedDate,
                time: formattedTime,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            toast.success(`${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} schedule call created successfully!`);
            onClose();
        } catch (error) {
            if (error.response && error.response.status === 400) {
                toast.error("A schedule call already exists for this date and time.");
            } else {
                toast.error("Error scheduling call. Try again later.");
            }
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
                    <select
                        value={timeFormat}
                        onChange={handleTimeFormatChange}
                        className="border border-gray-300 p-2 rounded ml-2"
                    >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                    </select>
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
