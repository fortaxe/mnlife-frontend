import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment"; // For formatting dates
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"; // Import Popover from ShadCN
import Navbar from "./Navbar";

const MrList = () => {
    const [mrs, setMrs] = useState([]);

    // Fetch the MRs from the API when the component loads
    useEffect(() => {
        const fetchMrs = async () => {
            try {
                const token = localStorage.getItem("token");

                if (token) {
                    const response = await axios.get("https://mnlifescience.vercel.app/api/getMrs", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    setMrs(response.data); // Assuming the MRs are returned in response.data
                    console.log(response.data);
                } else {
                    console.error("No token found in localStorage");
                }
            } catch (error) {
                console.error("Error fetching MRs:", error);
            }
        };

        fetchMrs();
    }, []);

    return (
        <div>
            <Navbar />
        <div className="overflow-x-auto mt-2">
            <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                <thead className="ltr:text-left rtl:text-right">
                    <tr>
                        <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Name</th>
                        <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Mobile Number</th>
                        <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Area Name</th>
                        <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Joining Date</th>
                        <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Aadhaar Card</th>
                        <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">PAN Card</th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                    {mrs.map((mr, index) => (
                        <tr className="odd:bg-gray-50" key={index}>
                            <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{mr.name}</td>
                            <td className="whitespace-nowrap px-4 py-2 text-gray-700">{mr.mobileNumber}</td>
                            <td className="whitespace-nowrap px-4 py-2 text-gray-700">{mr.areaName}</td>
                            <td className="whitespace-nowrap px-4 py-2 text-gray-700">{moment(mr.joiningDate).format('D MMM YYYY')}</td>
                            
                            {/* Aadhaar Card Popover */}
                            <td className="whitespace-nowrap px-4 py-2 text-blue-500 cursor-pointer">
                                {mr.aadhaarCard ? (
                                    <Popover>
                                        <PopoverTrigger>
                                            <span className="text-blue-500 cursor-pointer">View Aadhaar</span>
                                        </PopoverTrigger>
                                        <PopoverContent>
                                            <img src={mr.aadhaarCard} alt="Aadhaar Card" className="w-full h-auto" />
                                        </PopoverContent>
                                    </Popover>
                                ) : (
                                    "Not Provided"
                                )}
                            </td>

                            {/* PAN Card Popover */}
                            <td className="whitespace-nowrap px-4 py-2 text-blue-500 cursor-pointer">
                                {mr.panCard ? (
                                    <Popover>
                                        <PopoverTrigger>
                                            <span className="text-blue-500 cursor-pointer">View PAN</span>
                                        </PopoverTrigger>
                                        <PopoverContent>
                                            <img src={mr.panCard} alt="PAN Card" className="w-full h-auto" />
                                        </PopoverContent>
                                    </Popover>
                                ) : (
                                    "Not Provided"
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </div>
    );
};

export default MrList;
