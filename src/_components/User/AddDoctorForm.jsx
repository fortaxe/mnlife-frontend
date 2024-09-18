import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Navbar from "../Admin/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddDoctorForm = () => {
    const [location, setLocation] = useState({ lat: '', lon: '' });
    const initialValues = {
        doctorName: "",
        doctorNumber: "",
        pharmacyName: "",
        pharmacyNumber: "",
        grade: "",
        location: "",
        remarks: "",
    };

    const validationSchema = Yup.object({
        doctorName: Yup.string().required("Doctor Name is Required"),
        doctorNumber: Yup.string().required("Doctor Number is Required"),
        pharmacyName: Yup.string().required("Pharmacy Name is Required"),
        pharmacyNumber: Yup.string().required("Pharmacy Number is Required"),
        grade: Yup.string().required("Grade is Required"),
        location: Yup.string(),
        remarks: Yup.string(),
    });

    const handleSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
        const token = localStorage.getItem("token");
        if (!token) {
            setErrors({ general: "No token found, please log in again." });
            setSubmitting(false);
            return;
        }
    
        try {
            const data = {
                ...values,
                location: {
                    type: 'Point',
                    coordinates: [location.lon, location.lat]
                }
            };
            // Directly send values as JSON
            const response = await axios.post(
                "https://mnlifescience.vercel.app/api/createClinic",
                data, // send values directly
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json", // use application/json
                    },
                }
            );
            console.log("Doctor added:", response.data);
            toast.success("Doctor added successfully!");
    
            // Reset the form fields after successful submission
            resetForm();
        } catch (error) {
            console.error("Error adding doctor:", error);
            setErrors({ general: "Failed to add doctor. Please try again." });
        } finally {
            setSubmitting(false);
        }
    };

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    });
                },
                (error) => {
                    console.error("Error getting location:", error);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    };
    
    return (
        <div>
            <Navbar />

            <div className="flex h-screen">
                <div className="w-[900px] p-8 bg-white rounded-md">
                    <h2 className="text-2xl font-bold mb-6 text-[#386D62]">Add New Doctor</h2>
                    <button
                        type="button"
                        onClick={getCurrentLocation}
                        className="p-2 bg-[#386D62] text-white rounded mb-4"
                    >
                        Get Current Location
                    </button>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting, errors }) => (
                            <Form>
                                <div className="grid grid-cols-2 gap-6 mb-4">
                                    <div>
                                        <label htmlFor="doctorName" className="block text-gray-700 mb-2">
                                            Doctor Name
                                        </label>
                                        <Field
                                            id="doctorName"
                                            name="doctorName"
                                            type="text"
                                            className="w-full p-2 rounded bg-[#F2F2F2] border border-gray-300"
                                            style={{ width: "366px" }}
                                        />
                                        <ErrorMessage
                                            name="doctorName"
                                            component="div"
                                            className="text-red-500 text-sm mt-1"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="doctorNumber" className="block text-gray-700 mb-2">
                                            Doctor Number
                                        </label>
                                        <Field
                                            id="doctorNumber"
                                            name="doctorNumber"
                                            type="text"
                                            className="w-full p-2 rounded bg-[#F2F2F2] border border-gray-300"
                                            style={{ width: "366px" }}
                                        />
                                        <ErrorMessage
                                            name="doctorNumber"
                                            component="div"
                                            className="text-red-500 text-sm mt-1"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6 mb-4">
                                    <div>
                                        <label htmlFor="pharmacyName" className="block text-gray-700 mb-2">
                                            Pharmacy Name
                                        </label>
                                        <Field
                                            id="pharmacyName"
                                            name="pharmacyName"
                                            type="text"
                                            className="w-full p-2 rounded bg-[#F2F2F2] border border-gray-300"
                                            style={{ width: "366px" }}
                                        />
                                        <ErrorMessage
                                            name="pharmacyName"
                                            component="div"
                                            className="text-red-500 text-sm mt-1"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="pharmacyNumber" className="block text-gray-700 mb-2">
                                            Pharmacy Number
                                        </label>
                                        <Field
                                            id="pharmacyNumber"
                                            name="pharmacyNumber"
                                            type="text"
                                            className="w-full p-2 rounded bg-[#F2F2F2] border border-gray-300"
                                            style={{ width: "366px" }}
                                        />
                                        <ErrorMessage
                                            name="pharmacyNumber"
                                            component="div"
                                            className="text-red-500 text-sm mt-1"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6 mb-4">
                                    <div>
                                        <label htmlFor="grade" className="block text-gray-700 mb-2">
                                            Grade
                                        </label>
                                        <Field
                                            id="grade"
                                            name="grade"
                                            type="text"
                                            className="w-full p-2 rounded bg-[#F2F2F2] border border-gray-300"
                                            style={{ width: "366px" }}
                                        />
                                        <ErrorMessage
                                            name="grade"
                                            component="div"
                                            className="text-red-500 text-sm mt-1"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="location" className="block text-gray-700 mb-2">
                                            Location
                                        </label>
                                        <Field
                                            id="location"
                                            name="location"
                                            type="text"
                                            className="w-full p-2 rounded bg-[#F2F2F2] border border-gray-300"
                                            style={{ width: "366px" }}
                                            value={`Latitude: ${location.lat}, Longitude: ${location.lon}`}
                                            disabled
                                        />
                                        <ErrorMessage
                                            name="location"
                                            component="div"
                                            className="text-red-500 text-sm mt-1"
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="remarks" className="block text-gray-700 mb-2">
                                        Remarks
                                    </label>
                                    <Field
                                        id="remarks"
                                        name="remarks"
                                        as="textarea"
                                        className="w-full p-2 rounded bg-[#F2F2F2] border border-gray-300"
                                        rows="4"
                                    />
                                    <ErrorMessage
                                        name="remarks"
                                        component="div"
                                        className="text-red-500 text-sm mt-1"
                                    />
                                </div>

                                {/* File input example (optional) */}


                                {errors.general && (
                                    <div className="text-red-500 text-sm mb-4">{errors.general}</div>
                                )}

                                <button
                                    type="submit"
                                    className="w-[169px] p-2 bg-[#386D62] text-white rounded hover:bg-[#386D62]"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Adding..." : "Add Doctor"}
                                </button>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
            
        </div>
    );
};

export default AddDoctorForm;
