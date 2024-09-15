import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./_components/Admin/Sidebar";
import AdminLogin from "./_components/Admin/AdminLogin";
import MrForm from "./_components/MrForm/MrForm";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/admin/signin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<Sidebar />}>
            {/* Nested routes will be rendered within the Sidebar */}
            <Route path="add-mr" element={<MrForm />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
