import React from 'react';
import { useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { setLoginState } from "@/redux/authSlice";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminLogin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const initialValues = {
        email: '',
        password: '',
    };

    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email address').required('Required'),
        password: Yup.string().required('Required'),
    });

    const handleSubmit = async (values, { setSubmitting, setErrors }) => {
        try {
            const response = await axios.post('https://mnlifescience.vercel.app/api/admin/signin', values);
            const { token } = response.data;

            // Store the token in localStorage
            localStorage.setItem('token', token);
            navigate('/admin/dashboard/doctor-list');
            // Update the Redux state
            dispatch(setLoginState({ isLoggedIn: true, token }));
            toast.success("Signed In Successfully!", { autoClose: 3000 });
        } catch (error) {
            console.error('Error during login:', error);
    
            // Check if the error response is from the server and has a status code
            if (error.response && error.response.status === 400) {
                setErrors({ general: 'Invalid credentials. Please try again.' });
                toast.error("Invalid credentials. Please check your email and password.");
            } else {
                setErrors({ general: 'Login failed. Please try again.' });
                toast.error("Login failed. Please try again.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="w-full max-w-md p-8 bg-white rounded-md">
                <h2 className="text-2xl font-bold mb-6 text-[#386D62]">Admin Login</h2>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                <Field
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none bg-[#F2F2F2] focus:ring-[#386D62] focus:border-[#386D62] sm:text-sm"
                                />
                                <ErrorMessage name="email" component="div" className="text-red-600 text-sm mt-1" />
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

export default AdminLogin;
