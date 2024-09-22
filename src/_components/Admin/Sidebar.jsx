import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // State to control sidebar toggle
  const location = useLocation(); // Get the current location

  const toggleSidebar = () => {
    setIsOpen(!isOpen); // Toggle the sidebar open/close
  };

  // Helper function to check if a route is active
  const isActiveRoute = (route) => location.pathname === route;

  return (
    <div className="flex">
      {/* Sidebar Toggle Button for small screens */}
      <button
  aria-controls="default-sidebar"
  type="button"
  className="absolute mt-4 inline-flex items-center p-2 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 z-50"
  onClick={toggleSidebar}
>
  <span className="sr-only">Toggle Sidebar</span>
  <svg
    className="w-6 h-6"
    aria-hidden="true"
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      clipRule="evenodd"
      fillRule="evenodd"
      d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
    ></path>
  </svg>
</button>


      {/* Sidebar */}
      <aside
  id="default-sidebar"
  className={`fixed top-0 left-0 z-40 w-[200px] h-screen bg-white transition-transform border-r-4 border-[#CCA66B] ${
    isOpen ? "translate-x-0" : "-translate-x-full"
  } lg:translate-x-0`}
  aria-label="Sidebar"
>
        <div className="h-full overflow-y-auto bg-white">
          <img src="/logo.png"  alt="MN Life Science" className="w-full mt-14" />
          <ul className="font-medium">
            <li>
              <Link
                to="/admin/dashboard/doctor-list"
                className={`flex items-center text-white p-2 ${
                  isActiveRoute("/admin/dashboard/doctor-list")
                    ? "bg-[#386D62]"
                    : "bg-[#CCA66B] hover:bg-[#386D62]"
                }`}
              >
                <span className="ms-3">Doctor List</span>
              </Link>
            </li>
            <li className="mt-3">
              <Link
                to="/admin/dashboard/appointments"
                className={`flex items-center text-white p-2 ${
                  isActiveRoute("/admin/dashboard/appointments")
                    ? "bg-[#386D62]"
                    : "bg-[#CCA66B] hover:bg-[#386D62]"
                }`}
              >
                <span className="ms-3">Appointments</span>
              </Link>
            </li>
            <li className="mt-3">
              <Link
                to="/admin/dashboard/called-list"
                className={`flex items-center text-white p-2 ${
                  isActiveRoute("/admin/dashboard/called-list")
                    ? "bg-[#386D62]"
                    : "bg-[#CCA66B] hover:bg-[#386D62]"
                }`}
              >
                <span className="ms-3">Called List</span>
              </Link>
            </li>
            <li className="mt-3">
              <Link
                to="/admin/dashboard/mr-list"
                className={`flex items-center text-white p-2 ${
                  isActiveRoute("/admin/dashboard/mr-list")
                    ? "bg-[#386D62]"
                    : "bg-[#CCA66B] hover:bg-[#386D62]"
                }`}
              >
                <span className="ms-3">MR List</span>
              </Link>
            </li>
            <li className="mt-3">
              <Link
                to="/admin/dashboard/add-mr"
                className={`flex items-center text-white p-2 ${
                  isActiveRoute("/admin/dashboard/add-mr")
                    ? "bg-[#386D62]"
                    : "bg-[#CCA66B] hover:bg-[#386D62]"
                }`}
              >
                <span className="ms-3">Add MR</span>
              </Link>
            </li>
          </ul>

          <div className="mt-[182px]">
            <Link
              to="/admin/dashboard/archive"
              className={`flex items-center text-white p-2 ${
                isActiveRoute("/admin/dashboard/archive")
                  ? "bg-[#386D62]"
                  : "bg-[#CCA66B] hover:bg-[#386D62]"
              }`}
            >
              <span className="ms-3">Archive</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main content area with margin to prevent overlap */}
      <div className="flex-1 lg:ml-[200px] "> {/* Added margin to the left */}
        <Outlet /> {/* This is where nested components will render */}
      </div>
    </div>
  );
};

export default Sidebar;
