import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const ChangeCredentials = () => {
  const initialValues = {
    newEmail: "",
    newPassword: "",
  };

  const validationSchema = Yup.object({
    newEmail: Yup.string().email("Invalid email address").required("Email is required"),
    newPassword: Yup.string().required("Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {

      // Get the token from localStorage
      const token = localStorage.getItem("token");

      if (!token) {
        setErrors({ general: "You are not authenticated. Please log in again." });
        return;
      }

      // Decode the token to get the user ID
      const decodedToken = jwtDecode(token);
      const { id } = decodedToken; 

      // Define the API endpoint with the extracted id
      const endpoint = `https://mnlifescience.vercel.app/api/admin/edit/${id}`;

      // Make the POST request to change credentials
      const response = await axios.patch(
        endpoint,
        { newEmail: values.newEmail, newPassword: values.newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      );

      // Handle success
      if (response.status === 200) {
        toast.success("Credentials updated successfully!", { autoClose: 3000 });
      } else {
        setErrors({ general: "Unexpected response from the server." });
      }
    } catch (error) {
      setErrors({ general: "Failed to change credentials. Please try again." });
      toast.error("Failed to change credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen justify-center items-center">
      <div className="w-[500px] p-8 bg-white rounded-md">
        <h2 className="text-2xl font-bold mb-6 text-[#386D62]">Change Credentials</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors }) => (
            <Form>
              <div className="grid grid-cols-1 gap-6 mb-4">
                <div>
                  <label htmlFor="newEmail" className="block text-gray-700 mb-2">
                    Email
                  </label>
                  <Field
                    id="newEmail"
                    name="newEmail"
                    type="email"
                    className="w-full p-2 rounded bg-[#F2F2F2] border border-gray-300"
                    style={{ width: "366px" }}
                  />
                  <ErrorMessage
                    name="newEmail"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-gray-700 mb-2">
                    Password
                  </label>
                  <Field
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    className="w-full p-2 rounded bg-[#F2F2F2] border border-gray-300"
                    style={{ width: "366px" }}
                  />
                  <ErrorMessage
                    name="newPassword"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </div>

              {errors.general && (
                <div className="text-red-500 text-sm mb-4">{errors.general}</div>
              )}

              <button
                type="submit"
                className="w-[366px] p-2 bg-[#386D62] text-white rounded hover:bg-[#386D62]"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Changing..." : "Change Credentials"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ChangeCredentials;
