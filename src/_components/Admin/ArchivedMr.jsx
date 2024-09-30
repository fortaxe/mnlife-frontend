// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import moment from "moment";
// import { toast } from "react-toastify";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchArchivedMrs, unarchieveMr } from "@/redux/mrSlice";
// import Navbar from "./Navbar";
// import { Button } from "@/components/ui/button";
// import CircularProgress from '@mui/material/CircularProgress';

// const UnarchiveMrList = () => {
//     const dispatch = useDispatch();
//     const [loading, setLoading] = useState(false);
//     const archivedMrs = useSelector((state) => state.mr.archivedMrs);

//     useEffect(() => {
//         const fetchArchivedMrList = async () => {
//             setLoading(true);
//             try {
//                 await dispatch(fetchArchivedMrs()).unwrap();
//             } catch (error) {
//                 console.error("Error fetching archived MRs:", error);
//                 toast.error("Failed to fetch archived MRs");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchArchivedMrList();
//     }, [dispatch]);

//     const handleUnarchiveMr = async (id) => {
//         try {
//             await dispatch(unarchieveMr({ id })).unwrap();
//             toast.success("MR unarchived successfully");
//         } catch (error) {
//             console.error("Error unarchiving MR:", error);
//             toast.error("Failed to unarchive MR");
//         }
//     };

//     return (
//         <div>
//             <Navbar />
//             <div className="overflow-x-auto mt-16">
//                 <h2 className="text-2xl font-bold mb-4">Archived MR List</h2>
//                 {loading ? (
//                     <div className="flex justify-center items-center h-64">
//                         <CircularProgress />
//                     </div>
//                 ) : (
//                     <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
//                         <thead className="text-left">
//                             <tr>
//                                 <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Unarchive</th>
//                                 <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">MR Create Date</th>
//                                 <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">MR Name</th>
//                                 <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">MR Number</th>
//                                 <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">MR Area</th>
//                                 <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Status</th>
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-200">
//                             {archivedMrs?.map((mr, index) => (
//                                 <tr className="odd:bg-gray-50" key={index}>
//                                     <td className="whitespace-nowrap px-4 py-2 text-gray-700">
//                                         <Button
//                                             onClick={() => handleUnarchiveMr(mr._id)}
//                                             className="block p-1 px-4 rounded-md mt-2 text-sm bg-green-500 text-white hover:bg-green-600"
//                                         >
//                                             Unarchive
//                                         </Button>
//                                     </td>
//                                     <td className="whitespace-nowrap px-4 py-2 text-gray-700">
//                                         {moment(mr?.joiningDate).format('D MMM YYYY')}
//                                     </td>
//                                     <td className="whitespace-nowrap px-4 py-2 text-gray-700">{mr?.name}</td>
//                                     <td className="whitespace-nowrap px-4 py-2 text-gray-700">{mr?.mobileNumber}</td>
//                                     <td className="whitespace-nowrap px-4 py-2 text-gray-700">{mr?.areaName}</td>
//                                     <td className="whitespace-nowrap px-4 py-2 text-gray-700">{mr?.status}</td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default UnarchiveMrList;