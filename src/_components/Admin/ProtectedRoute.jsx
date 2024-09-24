import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAdminLoggedIn = useSelector((state) => state.auth.isAdminLoggedIn);

  return isAdminLoggedIn ? children : <Navigate to="/admin" />;
};

export default ProtectedRoute;
