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


const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        // Remove token from localStorage
        localStorage.removeItem("token");
        // Dispatch logout action to update the state
        dispatch(logout());
        // Navigate to login page or wherever necessary
        navigate("/admin/signin");
    };

    return (
        <div>
            <nav className="bg-white border-gray-200 dark:bg-gray-900">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <div className="flex items-center justify-end space-x-3 rtl:space-x-reverse w-full">
                        <DropdownMenu>
                            <DropdownMenuTrigger><img
                                className="w-8 h-8 rounded-full"
                                src="/docs/images/people/profile-picture-3.jpg"
                                alt="user photo"
                            /></DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>Change Credentials</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout}>Sign Out</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
