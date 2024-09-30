import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { Edit, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import ScheduleModal from "./ScheduleModal";
import MapPopup from "../Mapbox/MapboxMap";
import { Input } from "@/components/ui/input";
import EditClinicModal from "./EditClinicModal";
import { useDispatch, useSelector } from "react-redux";
import { fetchArchivedClinics, unArchiveClinic, deleteArchivedClinic } from "@/redux/archiveList";
import 'react-toastify/dist/ReactToastify.css';
import { deleteClinic } from "@/redux/doctorList";
import Navbar from "./Navbar";
import LoadingAnimation from "./LoadingAnimation";

const ArchiveList = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedClinic, setSelectedClinic] = useState(null);
    const [scheduleType, setScheduleType] = useState('');
    const [isMapPopupOpen, setIsMapPopupOpen] = useState(false);
    const [mapCoordinates, setMapCoordinates] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const dispatch = useDispatch();
    const { archivedClinics, status } = useSelector((state) => state.archiveList);

    useEffect(() => {
        dispatch(fetchArchivedClinics());
        console.log(fetchArchivedClinics)
    }, [dispatch]);

    const openScheduleModal = (clinic, type) => {
        setSelectedClinic(clinic);
        setScheduleType(type);
        setIsModalOpen(true);
    };

    const handleLocationClick = (coordinates) => {
        setMapCoordinates(coordinates);
        setIsMapPopupOpen(true);
    };

    const handleEditClick = (clinic) => {
        setSelectedClinic(clinic);
        setIsEditModalOpen(true);
    };

    const handleUpdateClinic = () => {
        dispatch(fetchArchivedClinics());
        toast.success("Clinic updated successfully");
    };

    const handleDeleteClinic = async (id) => {
        try {
            await dispatch(deleteArchivedClinic(id)).unwrap();
            toast.success("Clinic deleted successfully");
        } catch (err) {
            toast.error(err || "Failed to delete clinic");
        }
    };

    const handleUnarchiveClinic = async (clinicId) => {
        try {
            await dispatch(unArchiveClinic({ clinicId }));
            toast.success("Clinic unarchived successfully");
        } catch (err) {
            toast.error(err || "Failed to unarchive clinic");
        }
    };

    return (
        <div>
            <Navbar />
            <div className="overflow-x-auto mt-[80px] w-full p-0 m-0">
                <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                    <thead className="ltr:text-left rtl:text-right ">
                        <tr>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Delete</th>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Date</th>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Doctor Name</th>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Doctor Number</th>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Pharmacy Name</th>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Pharmacy Number</th>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Location</th>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Grade</th>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">MR Name</th>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Remarks</th>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Notes</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                        {archivedClinics?.map((clinic, index) => (
                            <tr className="odd:bg-gray-50" key={clinic?._id} style={{ height: "80px" }}>

                                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                    <Trash2 className="w-5 h-5 text-gray-700 cursor-pointer" onClick={() => handleDeleteClinic(clinic?._id)} />
                                </td>
                                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                    {clinic?.createdAt ? moment(clinic?.createdAt).format('D MMM YYYY') : ''}
                                    <button className="block p-1 px-4 rounded-md mt-2 text-sm bg-[#FFD9BD]" onClick={() => handleUnarchiveClinic(clinic?._id)}>
                                        Unarchive
                                    </button>
                                </td>
                                <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                                    {clinic?.doctorName}
                                    <button
                                        className="block p-1 px-4 rounded-md mt-2 text-sm bg-[#E2FFBD]"
                                        onClick={() => openScheduleModal(clinic, 'doctor')}
                                    >
                                        Schedule Call
                                    </button>
                                </td>
                                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                    {clinic.doctorNumber}

                                </td>
                                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                    {clinic.pharmacyName}
                                    <button
                                        className="block p-1 px-4 rounded-md mt-2 text-sm bg-[#E2FFBD]"
                                        onClick={() => openScheduleModal(clinic, 'pharmacy')}
                                    >
                                        Schedule Call
                                    </button>
                                </td>
                                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                    {clinic.pharmacyNumber}

                                </td>
                                <td
                                    className="whitespace-nowrap px-4 py-2 text-blue-500 cursor-pointer"
                                    onClick={() => clinic?.url && window.open(clinic?.url, "_blank")}
                                >
                                    {clinic?.url && clinic.url.length > 0 ? "Location" : "No Location"}
                                </td>
                                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                    {clinic?.grade}
                                </td>
                                <td className="whitespace-nowrap px-4 py-2 text-gray-700">  {clinic?.createdBy?.name}</td>
                                <td className="whitespace-nowrap px-4 py-2 text-gray-700">{clinic?.remarks}</td>
                                <td className="whitespace-nowrap px-4 py-2">
                                    <Input className="w-[300px] h-[50px]" value={clinic?.notes} readOnly />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {isModalOpen && (
                    <ScheduleModal
                        selectedClinic={selectedClinic}
                        selectedType={scheduleType}
                        onClose={() => setIsModalOpen(false)}
                    />
                )}

                {isMapPopupOpen && (
                    <MapPopup
                        coordinates={mapCoordinates}
                        onClose={() => setIsMapPopupOpen(false)}
                    />
                )}

                {isEditModalOpen && (
                    <EditClinicModal
                        clinic={selectedClinic}
                        onClose={() => setIsEditModalOpen(false)}
                        onUpdate={handleUpdateClinic}
                    />
                )}
            </div>
        </div>
    );
};

export default ArchiveList;