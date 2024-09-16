import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/authSlice";
import { useNavigate } from "react-router-dom";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 

const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = () => {
        navigate("/admin/change-credentials")
    }

    const handleLogout = () => {
        // Remove token from localStorage
        localStorage.removeItem("token");
        // Dispatch logout action to update the state
        dispatch(logout());
        // Navigate to login page or wherever necessary
        navigate("/admin/signin");
        toast.success("Signed out Successfully!", { autoClose: 3000 })
    };

    return (
        <div>
            <nav className="bg-white border-b-4 border-[#386D62]">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-2 border-b-[#48887B]">
                    <div className="flex items-center justify-end space-x-3 rtl:space-x-reverse w-full ">
                        <DropdownMenu className="">
                            <DropdownMenuTrigger><img
                                className="w-[55px] h-[55px] rounded-full"
                                src="/image.png"
                                alt="user photo"
                            /></DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel className="cursor-pointer" onClick={handleChange}>Change Credentials</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>Sign Out</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
