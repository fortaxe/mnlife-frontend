import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  import { toast } from "react-toastify";
  import "react-toastify/dist/ReactToastify.css"; 
  import { logout } from "@/redux/authSlice";
  

const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = () => {
        navigate("/admin/change-credentials");
    };

    const handleLogout = () => {
        // Remove token from localStorage
        localStorage.removeItem("token");
        // Dispatch logout action to update the state
        dispatch(logout());
        // Navigate to login page or wherever necessary
        navigate("/admin");
        toast.success("Signed out Successfully!", { autoClose: 3000 });
    };

    return (
        <div className="flex m-0 p-0">
        {/* Adjust navbar width and padding */}
        <nav className="bg-white border-b-4 border-[#386D62] w-full fixed left-0 right-0 top-0 p-2">
          <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-0 m-0">
            <div className="flex items-center justify-end space-x-3 rtl:space-x-reverse w-full">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <img
                    className="w-[40px] h-[40px] rounded-full"
                    src="/image.png"
                    alt="user photo"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel className="cursor-pointer" onClick={handleChange}>
                    Change Credentials
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </nav>
      </div>
      
    );
};

export default Navbar;
