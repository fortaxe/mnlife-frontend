import React from 'react';
import { useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { setUserLoginState } from "@/redux/userSlice";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserLogin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const initialValues = {
        mobileNumber: '',
        password: '',
    };

    const validationSchema = Yup.object({
        mobileNumber: Yup.string()
            .required('Mobile number is required'),
            // .matches(/^[0-9]+$/, 'Must be only digits')
            // .min(10, 'Mobile number must be at least 10 digits')
            // .max(10, 'Mobile number must be 10 digits'),
        password: Yup.string().required('Password is required'),
    });

    const handleSubmit = async (values, { setSubmitting, setErrors }) => {
        try {
            const response = await axios.post('https://mnlifescience.vercel.app/api/user/signin', values);
            const { token } = response.data;

            // Store the token in localStorage
            localStorage.setItem('token', token);
            navigate('/dashboard');

            // Update the Redux state
            dispatch(setUserLoginState({ isLoggedIn: true, token }));
            toast.success("Signed In Successfully!", { autoClose: 3000 });
        } catch (error) {
            console.error('Error during login:', error);
            setErrors({ general: 'Login failed. Please check your credentials.' });
            toast.error("Login failed. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="w-full max-w-md p-8 bg-white rounded-md">
                <h2 className="text-2xl font-bold mb-6 text-[#386D62]">User Login</h2>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <div className="mb-4">
                                <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">
                                    Mobile Number
                                </label>
                                <Field
                                    type="text"
                                    id="mobileNumber"
                                    name="mobileNumber"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none bg-[#F2F2F2] focus:ring-[#386D62] focus:border-[#386D62] sm:text-sm"
                                />
                                <ErrorMessage name="mobileNumber" component="div" className="text-red-600 text-sm mt-1" />
                            </div>

                            <div className="mb-6">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                <Field
                                    type="password"
                                    id="password"
                                    name="password"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none bg-[#F2F2F2] focus:ring-[#386D62] focus:border-[#386D62] sm:text-sm"
                                />
                                <ErrorMessage name="password" component="div" className="text-red-600 text-sm mt-1" />
                            </div>

                            <div className="mb-4">
                                <ErrorMessage name="general" component="div" className="text-red-600 text-sm mb-2" />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-[#386D62] text-white py-2 px-4 border border-transparent rounded-md shadow-sm hover:bg-[#2C524C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#386D62]"
                            >
                                {isSubmitting ? 'Logging in...' : 'Login'}
                            </button>
                        </Form>
                    )}
                </Formik>
                <ToastContainer />
            </div>
        </div>
    );
};

export default UserLogin;
