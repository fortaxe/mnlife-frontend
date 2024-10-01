import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./_components/Admin/Sidebar";
import AdminLogin from "./_components/Admin/AdminLogin";
import MrForm from "./_components/MrForm/MrForm";
import ChangeCredentials from "./_components/Admin/ChangeCredentials";
import UserLogin from "./_components/User/UserLogin";
import UserSidebar from "./_components/User/UserSidebar";
import AddDoctorForm from "./_components/User/AddDoctorForm";
import DoctorList from "./_components/Admin/DoctorList";
import MrList from "./_components/Admin/MrList";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Appointments from "./_components/Admin/Appointments";
import CalledList from "./_components/Admin/CalledList";
import ArchiveList from "./_components/Admin/ArchiveList";
import ProtectedRoute from "./_components/Admin/ProtectedRoute";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLoginState } from "./redux/authSlice";
import UnarchiveMrList from "./_components/Admin/ArchivedMr";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // If token is found in localStorage, update the Redux state
      dispatch(setLoginState({ isLoggedIn: true, token }));
    }
  }, [dispatch]);

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/change-credentials" element={<ChangeCredentials />} />
          <Route path="/" element={<UserLogin />} />

          {/* Admin Dashboard*/}
          <Route path="/admin/dashboard" element={<ProtectedRoute><Sidebar /></ProtectedRoute>}>
            <Route path="doctor-list" element={<DoctorList />} />
            <Route path="add-mr" element={<MrForm />} />
            <Route path="mr-list" element={<MrList />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="called-list" element={<CalledList />} />
            <Route path="archived-mr" element={<UnarchiveMrList />} />
            <Route path="archive" element={<ArchiveList />} />
          </Route>

        {/* User Dashboard*/}
          <Route path="/dashboard" element={<UserSidebar />}>
            <Route path="/dashboard/add-doctor" element={<AddDoctorForm />} />
          </Route>   

        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </div>
  );
}

export default App;
