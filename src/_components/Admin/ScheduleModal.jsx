import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeModal, setDate, setTime } from "@/redux/scheduleSlice";
import Calendar from "react-calendar"; 
import 'react-calendar/dist/Calendar.css';
import { toast } from "react-toastify";
import axios from "axios";

const ScheduleModal = ({ selectedClinic, selectedType, scheduleCallId, onClose }) => {
    const dispatch = useDispatch();
    const { selectedDate, selectedTime } = useSelector((state) => state.schedule);

    const handleDateChange = (date) => {
        dispatch(setDate(date));
    };

    const handleTimeChange = (e) => {
        dispatch(setTime(e.target.value));
    };

    // Helper function to convert time to 24-hour format
    const convertTimeTo24HourFormat = (time12h) => {
        const [time, modifier] = time12h.split(' ');
        let [hours, minutes] = time.split(':');
        if (hours === '12') {
            hours = '00';
        }
        if (modifier === 'PM') {
            hours = parseInt(hours, 10) + 12;
        }
        return `${hours}:${minutes}`;
    };

    const handleScheduleCall = async () => {
        try {
            const token = localStorage.getItem("token");
    
            // Convert selected date to correct local time
            const localDate = new Date(selectedDate);
            const utcOffset = localDate.getTimezoneOffset() * 60000; 
            const adjustedDate = new Date(localDate.getTime() - utcOffset);
    
            const formattedTime = convertTimeTo24HourFormat(selectedTime);
    
            // API URLs for scheduling and rescheduling
            const apiUrl = scheduleCallId
                ? `https://mnlifescience.vercel.app/api/schedule/reschedule`
                : selectedType === "doctor"
                    ? "https://mnlifescience.vercel.app/api/schedule/call/doctor"
                    : "https://mnlifescience.vercel.app/api/schedule/call/pharmacy";
    
            const requestBody = scheduleCallId
                ? { scheduleCallId, date: adjustedDate, time: formattedTime }
                : { clinicId: selectedClinic._id, date: adjustedDate, time: formattedTime };
    
            const response = scheduleCallId
                ? await axios.patch(apiUrl, requestBody, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                : await axios.post(apiUrl, requestBody, {
                    headers: { Authorization: `Bearer ${token}` }
                });
    
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