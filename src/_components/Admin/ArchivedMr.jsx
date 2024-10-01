import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import moment from "moment";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { fetchArchivedMrs, unarchieveMr, deleteMR } from "@/redux/mrSlice";
import Navbar from "./Navbar";
import { Button } from "@/components/ui/button";
import LoadingAnimation from "./LoadingAnimation";
import { Trash2 } from "lucide-react";

const UnarchiveMrList = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const archivedMrs = useSelector((state) => state.mr.archivedMrs);
    console.log(archivedMrs);
    useEffect(() => {
        const fetchArchivedMrList = async () => {
            setLoading(true);
            try {
                await dispatch(fetchArchivedMrs()).unwrap();
                console.log("archived mrs", archivedMrs);
            } catch (error) {
                console.error("Error fetching archived MRs:", error);
                toast.error("Failed to fetch archived MRs");
            } finally {
                setLoading(false);
            }
        };

        fetchArchivedMrList();
    }, [dispatch]);

    const handleUnarchiveMr = async (id) => {
        try {
            await dispatch(unarchieveMr({ id })).unwrap();
            toast.success("MR unarchived successfully");
            dispatch(fetchArchivedMrs());
        } catch (error) {
            console.error("Error unarchiving MR:", error);
            toast.error("Failed to unarchive MR");
        }
    };

    const handleDeleteMR = async (id) => {
        try {
            await dispatch(deleteMR({ id })).unwrap(); // Use unwrap to handle fulfilled/rejected actions directly
            toast.success("MR deleted successfully");
            dispatch(fetchArchivedMrs());
        } catch (err) {
            toast.error("Failed to delete MR");
        }
    };

    return (
        <div>
            <Navbar />
            <div className="overflow-x-auto mt-16">
                {loading ? (
                    <LoadingAnimation />
                ) : (
                    <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                        <thead className="text-left">
                            <tr>
                                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Delete</th>
                                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Unarchive</th>
                                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">MR Create Date</th>
                                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">MR Name</th>
                                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">MR Number</th>
                                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">MR Area</th>
                                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {archivedMrs?.map((mr, index) => (
                                <tr className="odd:bg-gray-50" key={index}>
                                     <td className="whitespace-nowrap px-4 py-2 text-gray-700"><Trash2 className="w-5 h-5 text-gray-700 cursor-pointer" onClick={() => handleDeleteMR(mr._id)} /></td>
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                        <button
                                            onClick={() => handleUnarchiveMr(mr._id)}
                                            className="block p-1 px-4 rounded-md mt-2 text-sm bg-[#FFD9BD] text-black hover:bg-[#FFD9BD]"
                                        >
                                            Unarchive
                                        </button>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                        {moment(mr?.joiningDate).format('D MMM YYYY')}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">{mr?.name}</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">{mr?.mobileNumber}</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">{mr?.areaName}</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">{mr?.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default UnarchiveMrList;