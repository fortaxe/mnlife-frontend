import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import moment from "moment";


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
        console.log("completed calls", response.data);
      } catch (error) {
        console.error("Error fetching completed schedule calls:", error);
      }
    };

    fetchCompletedCalls();
  }, []);

  return (
    <div>
      <Navbar />

      <div className="overflow-x-auto mt-16">
        <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
          <thead className="text-left">
            <tr>
              <th className="p-2 font-medium text-gray-900">Last Called Date</th>
              <th className="p-2 font-medium text-gray-900">Doctor Name</th>
              <th className="p-2 font-medium text-gray-900">Doctor Number</th>
              <th className="p-2 font-medium text-gray-900">Pharmacy Name</th>
              <th className="p-2 font-medium text-gray-900">Pharmacy Number</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {completedCalls.map((call, index) => (
              <tr key={index} className="odd:bg-gray-50">
                 {/* <td className="p-2 text-gray-700">{moment(call.lastCalledDate).format('D MMM YYYY')}</td> */}
                <td className="p-2 text-gray-700">{call?.updatedAt ? moment(call.updatedAt).format('D MMM YYYY') : ''} </td>
                <td className="p-2 text-gray-700">{call?.clinic?.doctorName || ''}</td>
                <td className="p-2 text-gray-700">
                  {call?.clinic?.doctorNumber || ''}
                </td>
                <td className="p-2 text-gray-700">
                {call?.clinic?.pharmacyName || ''}
                </td>
                <td className="p-2 text-gray-700">{call?.clinic?.pharmacyNumber || ''}</td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default CalledList;
