import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeModal, setDate, setTime } from "@/redux/scheduleSlice";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { toast } from "react-toastify";
import axios from "axios";

const ScheduleModal = ({ selectedClinic, selectedType, scheduleCallId, onClose }) => {
    const dispatch = useDispatch();
    const { selectedDate, selectedTime } = useSelector((state) => state.schedule);
    const [hours, setHours] = useState("");
    const [minutes, setMinutes] = useState("");
    const [amPm, setAmPm] = useState("AM");

    useEffect(() => {
        if (selectedTime) {
            const date = new Date(selectedTime);
            setHours(format(date, "hh"));
            setMinutes(format(date, "mm"));
            setAmPm(format(date, "a"));
        }
    }, [selectedTime]);

    const handleDateChange = (date) => {
        dispatch(setDate(date));
    };

    const handleTimeChange = (h, m, a) => {
        if (h === "" || m === "") return;
        
        let adjustedHours = parseInt(h);
        if (a === "PM" && adjustedHours !== 12) {
            adjustedHours += 12;
        } else if (a === "AM" && adjustedHours === 12) {
            adjustedHours = 0;
        }
        const newTime = new Date(0, 0, 0, adjustedHours, parseInt(m));
        dispatch(setTime(newTime));
    };

    const handleHoursChange = (e) => {
        const value = e.target.value;
        setHours(value);
        handleTimeChange(value, minutes, amPm);
    };

    const handleMinutesChange = (e) => {
        const value = e.target.value;
        setMinutes(value);
        handleTimeChange(hours, value, amPm);
    };

    const handleAmPmChange = () => {
        const newAmPm = amPm === "AM" ? "PM" : "AM";
        setAmPm(newAmPm);
        handleTimeChange(hours, minutes, newAmPm);
    };

    const handleCloseModal = () => {
        dispatch(closeModal());
        if (onClose) {
            onClose();
        }
    };

    const handleScheduleCall = async () => {
        if (!selectedDate) {
            toast.error("Please select a date.");
            return;
        }
        if (!selectedTime) {
            toast.error("Please select a time.");
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const formattedDate = format(new Date(selectedDate), "yyyy-MM-dd");
           
            
             // Create a new Date object combining the selected date and time
        const combinedDateTime = new Date(selectedDate);
        combinedDateTime.setHours(selectedTime.getHours());
        combinedDateTime.setMinutes(selectedTime.getMinutes());

             const utcTime = new Date(combinedDateTime.getTime() - combinedDateTime.getTimezoneOffset() * 60000);

            const apiUrl = scheduleCallId
                ? `https://mnlifescience.vercel.app/api/schedule/reschedule`
                : selectedType === "doctor"
                    ? "https://mnlifescience.vercel.app/api/schedule/call/doctor"
                    : "https://mnlifescience.vercel.app/api/schedule/call/pharmacy";

            const requestBody = scheduleCallId
                ? { scheduleCallId, date: formattedDate, time: utcTime }
                : { clinicId: selectedClinic._id, date: formattedDate, time: utcTime };

            console.log("API URL:", apiUrl);
            console.log("Request Body:", requestBody);
            console.log("Token:", token);

            const response = scheduleCallId
                ? await axios.patch(apiUrl, requestBody, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                : await axios.post(apiUrl, requestBody, {
                    headers: { Authorization: `Bearer ${token}` }
                });

            console.log("Response:", response.data);
            toast.success(`Schedule ${scheduleCallId ? "rescheduled" : "created"} successfully!`);
            handleCloseModal();
        } catch (error) {
            console.error("Error:", error);
            if (error.response && error.response.status === 400) {
                toast.error("A schedule call already exists for this date and time.");
            } else {
                console.error("Error scheduling call:", error);
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
                    <label className="block mb-2">Select Date:</label>
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateChange}
                        className="rounded-md border"
                    />
                </div>

                <div className="mb-4 flex items-center">
                    <label className="block mr-2">Select Time:</label>
                    <input
                        type="text"
                        value={hours}
                        onChange={handleHoursChange}
                        placeholder="HH"
                        className="border border-gray-300 p-2 rounded mr-2 w-16 text-center"
                    />
                    :
                    <input
                        type="text"
                        value={minutes}
                        onChange={handleMinutesChange}
                        placeholder="MM"
                        className="border border-gray-300 p-2 rounded mr-2 w-16 text-center"
                    />
                    <button
                        onClick={handleAmPmChange}
                        className="bg-gray-200 px-2 py-1 rounded"
                    >
                        {amPm}
                    </button>
                </div>

                <button
                    onClick={handleScheduleCall}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    {scheduleCallId ? "Reschedule Call" : "Schedule Call"}
                </button>
                <button onClick={handleCloseModal} className="ml-2 bg-gray-500 text-white px-4 py-2 rounded">
                    Close
                </button>
            </div>
        </div>
    );
};

export default ScheduleModal;