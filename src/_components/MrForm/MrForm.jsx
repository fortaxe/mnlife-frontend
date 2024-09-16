import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Navbar from "../Admin/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MrForm = () => {
    const [aadhaarCard, setAadhaarCard] = useState(null);
    const [panCard, setPanCard] = useState(null);

    const initialValues = {
        name: "",
        mobileNumber: "",
        password: "",
        confirmPassword: "",
        areaName: "",
        joiningDate: "",
    };

    const validationSchema = Yup.object({
        name: Yup.string().required("Full Name is Required"),
        mobileNumber: Yup.string().required("Required"),
        password: Yup.string().required("Required"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("password"), null], "Passwords must match")
            .required("Required"),
        areaName: Yup.string().required("Required"),
        joiningDate: Yup.date().required("Required"),
    });

    const handleSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
        const token = localStorage.getItem("token");
        if (!token) {
            setErrors({ general: "No token found, please log in again." });
            setSubmitting(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("mobileNumber", values.mobileNumber);
            formData.append("password", values.password);
            formData.append("confirmPassword", values.confirmPassword);
            formData.append("areaName", values.areaName);
            formData.append("joiningDate", values.joiningDate);
            if (aadhaarCard) formData.append("aadhaarCard", aadhaarCard);
            if (panCard) formData.append("panCard", panCard);

            console.log([...formData.entries()]);

            const response = await axios.post(
                "https://mnlifescience.vercel.app/api/admin/create-mr",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            console.log("MR created:", response.data);
            // Show success toast notification
        toast.success("MR created successfully!");

        // Reset the form fields after successful submission
        resetForm();
        setAadhaarCard(null);
        setPanCard(null);
        } catch (error) {
            console.error("Error creating MR:", error);
            setErrors({ general: "Failed to create MR. Please try again." });
        } finally {
            setSubmitting(false);
        }
    };

    const handleFileSelect = (event, setFile) => {
        setFile(event.target.files[0]);
    };

    return (
        <div>
            <Navbar />

        <div className="flex h-screen">
            <div className="w-[900px] p-8 bg-white rounded-md">
                <h2 className="text-2xl font-bold mb-6 text-[#386D62]">Add New MR</h2>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, errors }) => (
                        <Form>
                            <div className="grid grid-cols-2 gap-6 mb-4">
                                <div>
                                    <label htmlFor="name" className="block text-gray-700 mb-2">
                                        Full Name
                                    </label>
                                    <Field
                                        id="name"
                                        name="name"
                                        type="text"
                                        className="w-full p-2 rounded bg-[#F2F2F2] border border-gray-300"
                                        style={{ width: "366px" }}
                                    />
                                    <ErrorMessage
                                        name="name"
                                        component="div"
                                        className="text-red-500 text-sm mt-1"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="mobileNumber" className="block text-gray-700 mb-2">
                                        Mobile Number
                                    </label>
                                    <Field
                                        id="mobileNumber"
                                        name="mobileNumber"
                                        type="text"
                                        className="w-full p-2 rounded bg-[#F2F2F2] border border-gray-300"
                                        style={{ width: "366px" }}
                                    />
                                    <ErrorMessage
                                        name="mobileNumber"
                                        component="div"
                                        className="text-red-500 text-sm mt-1"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 mb-4">
                                <div>
                                    <label htmlFor="password" className="block text-gray-700 mb-2">
                                        Password
                                    </label>
                                    <Field
                                        id="password"
                                        name="password"
                                        type="password"
                                        className="w-full p-2 rounded bg-[#F2F2F2] border border-gray-300"
                                        style={{ width: "366px" }}
                                    />
                                    <ErrorMessage
                                        name="password"
                                        component="div"
                                        className="text-red-500 text-sm mt-1"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">
                                        Confirm Password
                                    </label>
                                    <Field
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        className="w-full p-2 rounded bg-[#F2F2F2] border border-gray-300"
                                        style={{ width: "366px" }}
                                    />
                                    <ErrorMessage
                                        name="confirmPassword"
                                        component="div"
                                        className="text-red-500 text-sm mt-1"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 mb-4">
                                <div>
                                    <label htmlFor="areaName" className="block text-gray-700 mb-2">
                                        Area Name
                                    </label>
                                    <Field
                                        id="areaName"
                                        name="areaName"
                                        type="text"
                                        className="w-full p-2 rounded bg-[#F2F2F2] border border-gray-300"
                                        style={{ width: "366px" }}
                                    />
                                    <ErrorMessage
                                        name="areaName"
                                        component="div"
                                        className="text-red-500 text-sm mt-1"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="joiningDate" className="block text-gray-700 mb-2">
                                        Joining Date
                                    </label>
                                    <Field
                                        id="joiningDate"
                                        name="joiningDate"
                                        type="date"
                                        className="w-full p-2 rounded bg-[#F2F2F2] border border-gray-300"
                                        style={{ width: "366px" }}
                                    />
                                    <ErrorMessage
                                        name="joiningDate"
                                        component="div"
                                        className="text-red-500 text-sm mt-1"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 mb-4">
                                <div>
                                    <span
                                        className="text-gray-600 cursor-pointer"
                                        onClick={() => document.getElementById("aadhaarCard").click()}
                                    >
                                        Upload Aadhaar Card
                                    </span>
                                    <input
                                        id="aadhaarCard"
                                        type="file"
                                        className="hidden"
                                        onChange={(event) => handleFileSelect(event, setAadhaarCard)}
                                    />
                                    {aadhaarCard && (
                                        <span className="text-green-600 ml-2">Aadhaar selected</span>
                                    )}
                                </div>

                                <div>
                                    <span
                                        className="text-gray-600 cursor-pointer"
                                        onClick={() => document.getElementById("panCard").click()}
                                    >
                                        Upload PAN Card
                                    </span>
                                    <input
                                        id="panCard"
                                        type="file"
                                        className="hidden"
                                        onChange={(event) => handleFileSelect(event, setPanCard)}
                                    />
                                    {panCard && <span className="text-green-600 ml-2">PAN selected</span>}
                                </div>
                            </div>

                            {errors.general && (
                                <div className="text-red-500 text-sm mb-4">{errors.general}</div>
                            )}

                            <button
                                type="submit"
                                className="w-[169px] p-2 bg-[#386D62] text-white rounded hover:bg-[#386D62]"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Adding..." : "Add MR"}
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
        <ToastContainer />
        </div>
    );
};

export default MrForm;
