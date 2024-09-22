import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as XLSX from 'xlsx';
import moment from "moment";
import { ChevronDown, Menu, X } from "lucide-react";
import { setDateRange, setSelectedGrade, setSelectedMR, setFilteredClinics, clearDateRange } from "@/redux/doctorList";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNavigate } from "react-router-dom";
import { logout } from "@/redux/authSlice";
import { toast } from "react-toastify";
import { DateRangePicker } from "@react-spectrum/datepicker";
import { Provider, defaultTheme } from "@adobe/react-spectrum";
import { parseDate } from "@internationalized/date";
import { da, te } from "date-fns/locale";


const AdminNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { clinics, dateRange, selectedGrade, selectedMR, filteredClinics } = useSelector((state) => state.doctorList);
  const [isMRDropdownOpen, setIsMRDropdownOpen] = useState(false);
  const [isGradeDropdownOpen, setIsGradeDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 1024);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const datePickerRef = useRef(null);
  const [localStartDate, setLocalStartDate] = useState(moment(dateRange.startDate).format('YYYY-MM-DD'));
  const [localEndDate, setLocalEndDate] = useState(moment(dateRange.endDate).format('YYYY-MM-DD'));
  const [tempStartDate, setTempStartDate] = useState(dateRange.startDate ? moment(dateRange.startDate).format('YYYY-MM-DD') : '');
  const [tempEndDate, setTempEndDate] = useState(dateRange.endDate ? moment(dateRange.endDate).format('YYYY-MM-DD') : '');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchClinics());
    }
  }, [status, dispatch]);

  useEffect(() => {
    console.log("Filtered Clinics:", filteredClinics);
  }, [filteredClinics]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    const lowercaseValue = value.toLowerCase();

    const filtered = clinics.filter(clinic => {
      return (
        (clinic.doctorName?.toLowerCase() || '').includes(lowercaseValue) ||
        (clinic.pharmacyName?.toLowerCase() || '').includes(lowercaseValue) ||
        (clinic.doctorNumber?.toString() || '').includes(value) ||
        (clinic.pharmacyNumber?.toString() || '').includes(value) ||
        (clinic.grade?.toLowerCase() || '').includes(lowercaseValue) ||
        (clinic.createdBy?.name?.toLowerCase() || '').includes(lowercaseValue) ||
        (clinic.speciality?.toLowerCase() || '').includes(lowercaseValue) ||
        (clinic.remarks?.toLowerCase() || '').includes(lowercaseValue) ||
        (clinic.notes?.toLowerCase() || '').includes(lowercaseValue) ||
        (clinic.createdAt && moment(clinic.createdAt).isValid() ?
          moment(clinic.createdAt).format('D MMM YYYY').toLowerCase() : ''
        ).includes(lowercaseValue)
      );
    });

    console.log("Filtered Clinics:", filtered);
    dispatch(setFilteredClinics(filtered));
  };

  const handleExport = () => {
    const dataToExport = filteredClinics.length > 0 ? filteredClinics : clinics;

    if (dataToExport.length === 0) {
      toast.error("No data to export");
      return;
    }

    const exportData = dataToExport.map((clinic) => ({
      Date: moment(clinic.createdAt).format('D MMM YYYY'),
      Doctor_Name: clinic.doctorName,
      Doctor_Number: clinic.doctorNumber,
      Doctor_Whatsapp_Contacted: clinic.doctorWhatsAppContacted,
      Pharmacy_Name: clinic.pharmacyName,
      Pharmacy_Number: clinic.pharmacyNumber,
      Pharmacy_Whatsapp_Contacted: clinic.pharmacyWhatsAppContacted,
      Grade: clinic.grade,
      MR_Name: clinic?.createdBy?.name,
      Remarks: clinic.remarks,
      Notes: clinic.notes
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Clinics");
    XLSX.writeFile(wb, "doctor_list.xlsx");

    toast.success("Data exported successfully!");
  };

  const handleMRSelect = (mrName) => {
    dispatch(setSelectedMR(mrName));
    setIsMRDropdownOpen(false);
  };

  const handleGradeSelect = (grade) => {
    dispatch(setSelectedGrade(grade));
    setIsGradeDropdownOpen(false);
  };

  const handleChange = () => {
    navigate("/admin/change-credentials");
  };

  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem("token");
    // Dispatch logout action to update the state
    dispatch(logout());
    // Navigate to login page or wherever necessary
    navigate("/admin/signin");
    toast.success("Signed out Successfully!", { autoClose: 3000 });
  };

  const mrList = [...new Set(clinics.map(clinic => clinic.createdBy?.name || "MR Deleted"))];

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call once to set initial state

    return () => window.removeEventListener('resize', handleResize);
  }, []);



  const clearMRFilter = () => {
    dispatch(setSelectedMR(null));
  };

  const clearGradeFilter = () => {
    dispatch(setSelectedGrade(null));
  };



  // Apply filters whenever a filter changes
  useEffect(() => {
    applyFilters();
  }, [dateRange, selectedMR, selectedGrade]);

  // Function to apply all filters
  const applyFilters = () => {
    let filtered = [...clinics];

    console.log("Initial Clinics:", clinics); // Log initial clinics data
    console.log("Selected MR:", selectedMR); // Log MR filter
    console.log("Selected Grade:", selectedGrade); // Log Grade filter
    console.log("Selected Date Range:", dateRange); // Log date range

    // Apply MR filter
    if (selectedMR) {
      filtered = filtered.filter(clinic => clinic?.createdBy?.name === selectedMR);
    }

    // Apply Grade filter
    if (selectedGrade) {
      filtered = filtered.filter(clinic => clinic.grade === selectedGrade);
    }

    // Apply Date Range filter
    if (dateRange.startDate && dateRange.endDate) {
      const startDate = moment(dateRange.startDate).startOf('day');
      const endDate = moment(dateRange.endDate).endOf('day');

      console.log("Parsed Start Date:", startDate.format());
      console.log("Parsed End Date:", endDate.format());

      filtered = filtered.filter(clinic => {
        const clinicDate = moment(clinic.createdAt);
        console.log(`Clinic Date: ${clinicDate.format()}, Start Date: ${startDate.format()}, End Date: ${endDate.format()}`);
        const isInRange = clinicDate.isSameOrAfter(startDate, 'day') && clinicDate.isSameOrBefore(endDate, 'day');
        console.log(`Clinic ${clinic._id} is in date range:`, isInRange);
        return isInRange;
      });
    }
    console.log("Final Filtered Clinics:", filtered);
    dispatch(setFilteredClinics(filtered));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setIsDatePickerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleDateChange = (date, isStart) => {
    if (isStart) {
      setTempStartDate(date);
    } else {
      setTempEndDate(date);
    }
  };

  const applyDateFilter = () => {
    const newStartDate = tempStartDate ? moment(tempStartDate).startOf('day').toISOString() : null;
    const newEndDate = tempEndDate ? moment(tempEndDate).endOf('day').toISOString() : null;

    dispatch(setDateRange({ startDate: newStartDate, endDate: newEndDate }));
    setIsDatePickerOpen(false);
  };

  const clearDateFilter = () => {
    dispatch(clearDateRange());
    setTempStartDate('');
    setTempEndDate('');
  };

  const isDateRangeSelected = dateRange.startDate !== null || dateRange.endDate !== null;

  useEffect(() => {
    console.log("Current Local Start Date:", localStartDate);
    console.log("Current Local End Date:", localEndDate);
  }, [localStartDate, localEndDate]);

  return (
    <nav className={`bg-white border-b-4 border-b-[#48887B] dark:bg-gray-900 fixed top-0 right-0 ${isLargeScreen ? 'left-[200px]' : 'left-[30px]'
      } z-10 h-[80px]`}>
      <div className={`h-full flex flex-wrap items-center justify-between mx-auto ${isLargeScreen ? 'max-w-[calc(100vw-200px)]' : 'max-w-[calc(100vw-30px)]'
        }`}>
        {/* Left side: Export and Filters (visible only on larger screens) */}
        <div className="hidden lg:flex items-center space-x-6 overflow-x-auto p-4 ml-14 h-full">
          <button onClick={handleExport} className="text-black bg-[#FBFAD6]  border border-gray-300 font-medium rounded-lg text-sm px-3 py-2 text-center dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 whitespace-nowrap ">
            Export
          </button>

          {/* Date Range */}
          <div className="relative">
            <button
              onClick={() => {
                setIsDatePickerOpen(!isDatePickerOpen);

              }}
              className="text-gray-900 border border-gray-300 bg-[#FBFAD6] font-medium rounded-lg text-sm px-3 py-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 whitespace-nowrap"
            >
              {isDateRangeSelected ? `${moment(dateRange.startDate).format('DD/MM/YYYY')} - ${moment(dateRange.endDate).format('DD/MM/YYYY')}` : 'Date Range'}
            </button>
            {isDateRangeSelected && (
            <button
              onClick={clearDateFilter}
              className="absolute -right-2 -top-2 bg-red-500 text-white rounded-full p-1"
            >
              <X size={12} />
            </button>
          )}
          </div>

          <div className="relative">
            <button onClick={() => setIsMRDropdownOpen(!isMRDropdownOpen)} className="text-gray-900 border border-gray-300 hover:bg-gray-100 bg-[#FBFAD6] font-medium rounded-lg text-sm px-3 py-2 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 whitespace-nowrap">
              {selectedMR || "Select MR"} <ChevronDown className="inline ml-1" />
            </button>
            {selectedMR && (
              <button onClick={clearMRFilter} className="absolute -right-2 -top-2 bg-red-500 text-white rounded-full p-1">
                <X size={12} />
              </button>
            )}
          </div>

          <div className="relative">
            <button onClick={() => setIsGradeDropdownOpen(!isGradeDropdownOpen)} className="text-gray-900 border bg-[#FBFAD6] border-gray-300 hover:bg-gray-100 font-medium rounded-lg text-sm px-3 py-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 whitespace-nowrap">
              {selectedGrade || "Grade"} <ChevronDown className="inline ml-1" />
            </button>
            {selectedGrade && (
              <button onClick={clearGradeFilter} className="absolute -right-2 -top-2 bg-red-500 text-white rounded-full p-1">
                <X size={12} />
              </button>
            )}
          </div>

        </div>

        {/* Right side: Search, Profile, and Mobile Menu */}
        <div className="flex items-center ml-auto h-full">
          <div className="relative mr-2">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
              </svg>
            </div>
            <input
              type="text"
              id="search-navbar"
              className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger className="mr-1">
              <img
                className="w-10 h-10 rounded-full"
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
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            type="button"
            className="inline-flex items-center justify-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} lg:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-900 shadow-md z-20 `}>
        <ul className="flex flex-col font-medium p-4 space-y-2">
          <li>
            <button onClick={handleExport} className="w-full text-left py-2 px-4 text-white bg-blue-700 rounded">
              Export
            </button>
          </li>
          <li>
            <button onClick={() => { setIsDatePickerOpen(!isDatePickerOpen); setIsMobileMenuOpen(false); }} className="w-full text-left py-2 px-4 text-gray-900 rounded hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
              Date Range Filter
            </button>
          </li>
          <li>
            <button onClick={() => { setIsMRDropdownOpen(!isMRDropdownOpen); setIsMobileMenuOpen(false); }} className="w-full text-left py-2 px-4 text-gray-900 rounded hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
              {selectedMR || "Select MR"}
            </button>
          </li>
          <li>
            <button onClick={() => { setIsGradeDropdownOpen(!isGradeDropdownOpen); setIsMobileMenuOpen(false); }} className="w-full text-left py-2 px-4 text-gray-900 rounded hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
              {selectedGrade || "Grade"}
            </button>
          </li>
        </ul>
      </div>

      {/* MR Dropdown (Positioned absolutely) */}
      {isMRDropdownOpen && (
        <div className="  mt-2 bg-white border rounded shadow-lg">
          {mrList.map((mr, index) => (
            <button key={index} onClick={() => { handleMRSelect(mr); setIsMRDropdownOpen(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-100">
              {mr}
            </button>
          ))}
        </div>
      )}

      {/* Grade Dropdown (Positioned ly) */}
      {isGradeDropdownOpen && (
        <div className="  mt-2 bg-white border rounded shadow-lg">
          <button onClick={() => { handleGradeSelect('A'); setIsGradeDropdownOpen(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-100">A</button>
          <button onClick={() => { handleGradeSelect('B'); setIsGradeDropdownOpen(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-100">B</button>
        </div>
      )}

{isDatePickerOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border rounded shadow-lg z-50 p-4 min-w-[250px]">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">Start Date:</label>
            <input
              type="date"
              value={tempStartDate}
              onChange={(e) => handleDateChange(e.target.value, true)}
              className="border rounded px-2 py-1"
            />
            <label className="text-sm font-medium text-gray-700">End Date:</label>
            <input
              type="date"
              value={tempEndDate}
              onChange={(e) => handleDateChange(e.target.value, false)}
              className="border rounded px-2 py-1"
            />
            <button
              onClick={applyDateFilter}
              className="mt-2 bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar;
