import React, { useEffect, useState } from "react";
import axios from "axios";

const CalledList = () => {
  const [completedCalls, setCompletedCalls] = useState([]);

  useEffect(() => {
    const fetchCompletedCalls = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://mnlifescience.vercel.app/api/schedule/completed",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCompletedCalls(response.data.completedCalls);
      } catch (error) {
        console.error("Error fetching completed schedule calls:", error);
      }
    };

    fetchCompletedCalls();
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
        <thead className="text-left">
          <tr>
            <th className="p-2 font-medium text-gray-900">Last Called Date</th>
            <th className="p-2 font-medium text-gray-900">Doctor Info</th>
            <th className="p-2 font-medium text-gray-900">Pharmacy Name</th>
            <th className="p-2 font-medium text-gray-900">Pharmacy Number</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {completedCalls.map((call, index) => (
            <tr key={index} className="odd:bg-gray-50">
              <td className="p-2 text-gray-700">{call.lastCallDate}</td>
              <td className="p-2 text-gray-700">
                <div className="grid grid-cols-2 gap-4">
                  <span>{call.doctorName || "-"}</span>
                  <span>{call.doctorNumber || "-"}</span>
                </div>
              </td>
              <td className="p-2 text-gray-700">{call.pharmacyName || "-"}</td>
              <td className="p-2 text-gray-700">{call.pharmacyNumber || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CalledList;
