import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as XLSX from 'xlsx';
import moment from "moment";
import { ChevronDown } from "lucide-react";
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { setDateRange, setSelectedGrade, setSelectedMR } from "@/redux/doctorList";

const AdminNavbar = () => {
  const dispatch = useDispatch();
  const { clinics, dateRange, selectedGrade, selectedMR } = useSelector((state) => state.doctorList);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isMRDropdownOpen, setIsMRDropdownOpen] = useState(false);
  const [isGradeDropdownOpen, setIsGradeDropdownOpen] = useState(false);
  const [localDateRange, setLocalDateRange] = useState({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    key: 'selection'
  });

  const handleExport = () => {
    if (clinics.length === 0) {
      alert("No data to export");
      return;
    }

    const exportData = clinics.map((clinic) => ({
      Date: moment(clinic.createdAt).format('D MMM YYYY'),
      Doctor_Name: clinic.doctorName,
      Doctor_Number: clinic.doctorNumber,
      Doctor_Whatsapp_Contacted: clinic.doctorWhatsAppContacted,
      Pharmacy_Name: clinic.pharmacyName,
      Pharmacy_Number: clinic.pharmacyNumber,
      Pharmacy_Whatsapp_Contacted: clinic.pharmacyWhatsAppContacted,
      Grade: clinic.grade,
      MR_Name: clinic.createdBy.name,
      Remarks: clinic.remarks,
      Notes: clinic.notes
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Clinics");
    XLSX.writeFile(wb, "doctor_list.xlsx");
  };

  const handleMRSelect = (mrName) => {
    dispatch(setSelectedMR(mrName));
    setIsMRDropdownOpen(false);
  };

  const handleGradeSelect = (grade) => {
    dispatch(setSelectedGrade(grade));
    setIsGradeDropdownOpen(false);
  };

  const handleDateRangeSelect = (ranges) => {
    const { startDate, endDate } = ranges.selection;
    setLocalDateRange({
      startDate,
      endDate,
      key: 'selection'
    });
  };

  const applyDateRange = () => {
    dispatch(setDateRange({
      startDate: localDateRange.startDate,
      endDate: localDateRange.endDate
    }));
    setIsDatePickerOpen(false);
  };

const mrList = [...new Set(clinics.map(clinic => clinic.createdBy.name))];

  return (
    <div>
      <nav class="bg-white border-gray-200 dark:bg-gray-900">
        <div class="max-w-screen-xl flex flex-wrap items-center justify-evenly mx-auto p-4">

          <div class="flex md:order-2">
            <button type="button" data-collapse-toggle="navbar-search" aria-controls="navbar-search" aria-expanded="false" class="md:hidden text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 me-1">
              <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
              </svg>
              <span class="sr-only">Search</span>
            </button>
            <div class="relative hidden md:block">
              <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                </svg>
                <span class="sr-only">Search icon</span>
              </div>
              <input type="text" id="search-navbar" class="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search..." />
            </div>
            <button data-collapse-toggle="navbar-search" type="button" class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-search" aria-expanded="false">
              <span class="sr-only">Open main menu</span>
              <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15" />
              </svg>
            </button>
          </div>
          <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-search">
            <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <button onClick={handleExport} className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500">
                  Export
                </button>
              </li>
              <li className="relative">
                <button onClick={() => setIsDatePickerOpen(!isDatePickerOpen)} className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">
                  Date Range Filter
                </button>
                {isDatePickerOpen && (
                  <div className="absolute z-10 mt-2">
                    <DateRangePicker
                      ranges={[localDateRange]}
                      onChange={handleDateRangeSelect}
                    />
                    <button 
                      onClick={applyDateRange}
                      className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </li>
              <li className="relative">
                <button onClick={() => setIsMRDropdownOpen(!isMRDropdownOpen)} className="flex items-center py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">
                {selectedMR || "Select MR"} <ChevronDown />
                </button>
                {isMRDropdownOpen && (
                  <div className="absolute z-10 mt-2 bg-white border rounded shadow-lg">
                    {mrList.map((mr, index) => (
                      <button key={index} onClick={() => handleMRSelect(mr)} className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                        {mr}
                      </button>
                    ))}
                  </div>
                )}
              </li>
              <li className="relative">
                <button onClick={() => setIsGradeDropdownOpen(!isGradeDropdownOpen)} className="flex items-center py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">
                {selectedGrade || "Grade"} <ChevronDown />
                </button>
                {isGradeDropdownOpen && (
                  <div className="absolute z-10 mt-2 bg-white border rounded shadow-lg">
                    <button onClick={() => handleGradeSelect('A')} className="block w-full text-left px-4 py-2 hover:bg-gray-100">A</button>
                    <button onClick={() => handleGradeSelect('B')} className="block w-full text-left px-4 py-2 hover:bg-gray-100">B</button>
                  </div>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default AdminNavbar;
