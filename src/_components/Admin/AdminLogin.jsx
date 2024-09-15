import React from 'react';
import { useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { setLoginState } from "@/redux/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"

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

            // Update the Redux state
            dispatch(setLoginState({ isLoggedIn: true, token }));
            navigate('/admin/dashboard');
            toast("Signed In Successfully!")
        } catch (error) {
            console.error('Error during login:', error);
            setErrors({ general: 'Login failed. Please check your credentials.' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white shadow-md rounded-md">
                <h2 className="text-2xl font-bold mb-6">Admin Login</h2>
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
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                                <ErrorMessage name="email" component="div" className="text-red-600 text-sm mt-1" />
                            </div>

                            <div className="mb-6">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                <Field
                                    type="password"
                                    id="password"
                                    name="password"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                                <ErrorMessage name="password" component="div" className="text-red-600 text-sm mt-1" />
                            </div>
                           
                            <div className="mb-4">
                                <ErrorMessage name="general" component="div" className="text-red-600 text-sm mb-2" />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-indigo-600 text-white py-2 px-4 border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                {isSubmitting ? 'Logging in...' : 'Login'}
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default AdminLogin;
