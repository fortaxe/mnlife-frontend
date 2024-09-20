import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeModal, setDate, setTime } from "@/redux/scheduleSlice";
import Calendar from "react-calendar"; 
import 'react-calendar/dist/Calendar.css';
import { toast } from "react-toastify";
import axios from "axios";

const ScheduleModal = ({ selectedClinic, selectedType, scheduleCallId, onClose }) => {
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

    // Helper function to convert time to 24-hour format
    const convertTimeTo24HourFormat = (time, format) => {
        let [hours, minutes] = time.split(":").map(Number);
        if (format === "PM" && hours < 12) {
            hours += 12;
        } else if (format === "AM" && hours === 12) {
            hours = 0; 
        }
        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    };

    const handleScheduleCall = async () => {
        try {
            const token = localStorage.getItem("token");
    
            // Convert selected date to correct local time
            const localDate = new Date(selectedDate);
            const utcOffset = localDate.getTimezoneOffset() * 60000; 
            const adjustedDate = new Date(localDate.getTime() - utcOffset);
    
            const formattedTime = convertTimeTo24HourFormat(selectedTime, timeFormat);
    
            // API URLs for scheduling and rescheduling
            const apiUrl = scheduleCallId
                ? `https://mnlifescience.vercel.app/api/schedule/reschedule`  // PATCH route for rescheduling
                : selectedType === "doctor"
                    ? "https://mnlifescience.vercel.app/api/schedule/call/doctor"  // POST route for doctor call
                    : "https://mnlifescience.vercel.app/api/schedule/call/pharmacy";  // POST route for pharmacy call
    
            const requestBody = scheduleCallId
                ? { scheduleCallId, date: adjustedDate, time: formattedTime }  // Payload for rescheduling
                : { clinicId: selectedClinic._id, date: adjustedDate, time: formattedTime };  // Payload for scheduling
    
            const response = scheduleCallId
                ? await axios.patch(apiUrl, requestBody, {
                    headers: { Authorization: `Bearer ${token}` }
                })  // PATCH request for rescheduling
                : await axios.post(apiUrl, requestBody, {
                    headers: { Authorization: `Bearer ${token}` }
                });  // POST request for scheduling
    
            toast.success(`Schedule ${scheduleCallId ? "rescheduled" : "created"} successfully!`);
            onClose();
        } catch (error) {
            if (error.response && error.response.status === 400) {
                toast.error("A schedule call already exists for this date and time.");
            } else {
                console.log("Error scheduling call:", error);
                toast.error("Error scheduling call. Try again later.");
            }
        }
    };
    

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg">
                <h2 className="text-lg font-bold mb-4">
                    {scheduleCallId ? "Reschedule" : "Schedule"} {selectedType === "doctor" ? "Doctor" : "Pharmacy"} Call
                </h2>
                
                <div className="mb-4">
                    <Calendar onChange={handleDateChange} value={selectedDate} />
                </div>
                
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
                    {scheduleCallId ? "Reschedule Call" : "Schedule Call"}
                </button>
                <button onClick={onClose} className="ml-2 bg-gray-500 text-white px-4 py-2 rounded">
                    Close
                </button>
            </div>
        </div>
    );
};


export default ScheduleModal;
