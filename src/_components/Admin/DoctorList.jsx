import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { Edit, ChevronDown, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import ScheduleModal from "./ScheduleModal";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditClinicModal from "./EditClinicModal";
import AdminNavbar from "./AdminNavbar";
import { useDispatch, useSelector } from "react-redux";
import { fetchClinics, deleteClinic, archiveClinic, updateClinic } from "@/redux/doctorList";
import 'react-toastify/dist/ReactToastify.css';
import LocationModal from "./LocationModal";
import FollowUpModal from "./FollowupModal";
import LoadingAnimation from "./LoadingAnimation";

const DoctorList = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedClinic, setSelectedClinic] = useState(null);
    const [scheduleType, setScheduleType] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [loadingClinicId, setLoadingClinicId] = useState(null);
    const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
    const [selectedFollowUps, setSelectedFollowUps] = useState([]);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [clinicToDelete, setClinicToDelete] = useState(null);

    const dispatch = useDispatch();
    const { filteredClinics, status, error } = useSelector((state) => state.doctorList);

    useEffect(() => {
        // Dispatch the fetchClinics action when the component loads
        dispatch(fetchClinics());
    }, [dispatch]);

    const openScheduleModal = (clinic, type) => {
        setSelectedClinic(clinic);
        setScheduleType(type);
        setIsModalOpen(true);
    };

    const confirmDelete = (id) => {
        setClinicToDelete(id);
        setIsDeleteConfirmOpen(true);
    };

    const handleEditClick = (clinic) => {
        setSelectedClinic(clinic);
        setIsEditModalOpen(true);
    };

    const handleUpdateClinic = (updatedClinic) => {
        dispatch(updateClinic(updatedClinic))
            .unwrap()
            .then(() => {
                toast.success("Clinic updated successfully");

                // Update only the selected clinic in local state
                setSelectedClinic(updatedClinic);

                // Optionally, you can also update the filteredClinics state
                const updatedClinics = filteredClinics.map(clinic =>
                    clinic._id === updatedClinic._id ? updatedClinic : clinic
                );
                // Update the local state if you want to reflect changes in the table
                dispatch(fetchClinics(updatedClinics)); // If you have a way to set this in your redux store
                setIsEditModalOpen(false);
            })
            .catch((error) => {
                toast.error(error || "Failed to update clinic");
            });
    };

    const handleDeleteClinic = async (id) => {
        try {
            await dispatch(deleteClinic({ id: clinicToDelete }));
            toast.success("Clinic deleted successfully");
            setIsDeleteConfirmOpen(false);
            setClinicToDelete(null);
        } catch (err) {
            toast.error(err || "Failed to delete clinic");
        }
    };

    const handleArchiveClinic = async (clinicId) => {
        setLoadingClinicId(clinicId);
        try {
            await dispatch(archiveClinic({ clinicId }));
            toast.success("Doctor Archived successfully");
        } catch (err) {
            toast.error(err || "Failed to Archive clinic");
        } finally {
            setLoadingClinicId(null);
        }
    };

    const openFollowUpModal = (followUps) => {
        setSelectedFollowUps(followUps);
        setIsFollowUpModalOpen(true);
    };

    const closeFollowUpModal = () => {
        setIsFollowUpModalOpen(false);
        setSelectedFollowUps([]);
    };

    const openImageModal = (clinic) => {
        setSelectedClinic(clinic);
        setIsImageModalOpen(true); // Open modal when clicked
    };

    const closeImageModal = () => {
        setIsImageModalOpen(false); // Close modal
        setSelectedClinic(null); // Reset the selected clinic
    };

    return (
        <div>
            <AdminNavbar />
            <div className="overflow-x-auto mt-[80px] w-full p-0 m-0">
                <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                    <thead className="ltr:text-left rtl:text-right ">
                        <tr>
                            <th className="whitespace-nowrap px-3 py-2 font-medium text-gray-900 text-left">Sr. No.</th>
                            <th className="whitespace-nowrap px-3 py-2 font-medium text-gray-900 text-left">MR Name</th>
                            <th className="whitespace-nowrap px-3 py-2 font-medium text-gray-900 text-left">Date</th>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-left">Grade</th>
                            <th className="whitespace-nowrap px-3 py-2 font-medium text-gray-900 text-left">Pharmacy Name</th>
                            <th className="whitespace-nowrap px-3 py-2 font-medium text-gray-900 text-left">Pharmacy Person Name</th>
                            <th className="whitespace-nowrap px-3 py-2 font-medium text-gray-900 text-left">Pharmacy Person Contact</th>
                            <th className="whitespace-nowrap px-3 py-2 font-medium text-gray-900 text-left">Doctor Name</th>
                            <th className="whitespace-nowrap px-3 py-2 font-medium text-gray-900 text-left">Doctor Number</th>
                            <th className="whitespace-nowrap px-3 py-2 font-medium text-gray-900 text-left">Speciality</th>
                            <th className="whitespace-nowrap px-3 py-2 font-medium text-gray-900 text-left">Address</th>
                            <th className="whitespace-nowrap px-3 py-2 font-medium text-gray-900 text-left">Remarks</th>
                            <th className="whitespace-nowrap px-3 py-2 font-medium text-gray-900 text-left">Notes</th>
                           
                            <th className="whitespace-nowrap px-3 py-2 font-medium text-gray-900 text-left">Location</th>
                            <th className="whitespace-nowrap px-3 py-2 font-medium text-gray-900 text-left">Visit Image</th>

                            <th className="whitespace-nowrap px-3 py-2 font-medium text-gray-900 text-left">Edit</th>
                            <th className="whitespace-nowrap px-3 py-2 font-medium text-gray-900 text-left">Delete</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                        {filteredClinics?.map((clinic, index) => (
                            <tr className="odd:bg-gray-50" key={clinic?._id} style={{ height: "80px" }}>
                                <td className="whitespace-nowrap px-3 py-2 text-gray-700">
                                    {index + 1}
                                </td>
                                <td className="whitespace-nowrap px-3 py-2 text-gray-700">
                                    {clinic?.createdBy?.name}
                                </td>
                                <td className="whitespace-nowrap px-3 py-2 text-gray-700">
                                    <div className="py-1">
                                        {clinic?.createdAt ? moment(clinic?.createdAt).format('D MMM YYYY') : ''}
                                    </div>
                                    <div className="py-1">
                                        {clinic?.createdAt ? moment(clinic?.createdAt).format('hh:mm A') : ''}
                                    </div>
                                </td>
                                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                    {clinic?.grade}
                                </td>
                                <td className="whitespace-nowrap px-3 py-2 text-gray-700">
                                    {clinic?.hospitalName}
                                    <button className="block p-1 px-3 rounded-md mt-2 text-sm bg-[#FFD9BD]" onClick={() => handleArchiveClinic(clinic?._id)}>
                                        Archive
                                    </button>
                                </td>
                                <td className="whitespace-nowrap px-3 py-2 text-gray-700">
                                    {clinic?.pharmacyName}
                                    <button
                                        className="block p-1 px-3 rounded-md mt-2 text-sm bg-[#E2FFBD]"
                                        onClick={() => openScheduleModal(clinic, 'pharmacy')}
                                    >
                                        Schedule Call
                                    </button>
                                </td>
                                <td className="whitespace-nowrap px-3 py-2 text-gray-700">
                                    {clinic?.pharmacyNumber}
                                    <div className="flex items-center mt-2">
                                        <input
                                            type="checkbox"
                                            id={`pharmacy-contacted-${clinic._id}`}
                                            checked={clinic?.pharmacyWhatsAppContacted}
                                            readOnly
                                            className="mr-2"
                                        />
                                        <label htmlFor={`pharmacy-contacted-${clinic?._id}`} className="text-sm">
                                            Pharmacy Contacted
                                        </label>
                                    </div>
                                </td>

                                <td className="whitespace-nowrap px-3 py-2 text-gray-900">
                                    {clinic?.doctorName}
                                    <button
                                        className="block p-1 px-3 rounded-md mt-2 text-sm bg-[#E2FFBD]"
                                        onClick={() => openScheduleModal(clinic, 'doctor')}
                                    >
                                        Schedule Call
                                    </button>
                                </td>
                                <td className="whitespace-nowrap px-3 py-2 text-gray-700">
                                    {clinic?.doctorNumber}
                                    <div className="flex items-center mt-2">
                                        <input
                                            type="checkbox"
                                            id={`doctor-contacted-${clinic?._id}`}
                                            checked={clinic?.doctorWhatsAppContacted}
                                            readOnly
                                            className="mr-2"
                                        />
                                        <label htmlFor={`doctor-contacted-${clinic?._id}`} className="text-sm">
                                            What's App Contacted
                                        </label>
                                    </div>
                                </td>
                                <td className="whitespace-nowrap px-3 py-2 text-gray-700">
                                    {clinic?.speciality}
                                    <button
                                        className="block p-1 px-3 rounded-md mt-2 text-sm bg-[#FBFAD6]"
                                        onClick={() => openFollowUpModal(clinic?.followUps)}
                                    >
                                        View Follow-up
                                    </button>
                                </td>
                                <td className="whitespace-nowrap px-3 py-2 text-gray-700">
                                    {clinic?.areaName}
                                </td>
                                <td className="whitespace-nowrap px-3 py-2 text-gray-700">
                                    <Input className="w-[300px] h-[50px]" value={clinic?.remarks}  />
                                </td>
                                <td className="whitespace-nowrap px-3 py-2">
                                    <Input className="w-[300px] h-[50px]" value={clinic?.notes}  />
                                </td>
                                <td
                                    className="whitespace-nowrap px-3 py-2 text-blue-500 cursor-pointer"
                                    onClick={() => clinic?.url && window.open(clinic?.url, "_blank")}
                                >
                                    {clinic?.url && clinic.url.length > 0 ? "Location" : "No Location"}
                                </td>
                                <td className="whitespace-nowrap px-3 py-2">
                                    {clinic?.doctorImage ? (
                                        <span
                                            className="text-blue-500 cursor-pointer"
                                            onClick={() => openImageModal(clinic)}
                                        >
                                            View Image
                                        </span>
                                    ) : (
                                        <span className="text-gray-500">No Image</span>
                                    )}
                                </td>
                                <td className="whitespace-nowrap px-3 py-2 text-gray-700">
                                    <Edit className="w-5 h-5 text-gray-700 cursor-pointer" onClick={() => handleEditClick(clinic)} />
                                </td>
                                <td className="whitespace-nowrap px-3 py-2 text-gray-700">
                                    <Trash2 className="w-5 h-5 text-gray-700 cursor-pointer" onClick={() => confirmDelete(clinic?._id)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {isImageModalOpen && selectedClinic?.doctorImage && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                        <div className="bg-white p-4 rounded-lg shadow-lg w-auto h-[600px] flex flex-col items-center justify-between"> {/* Flex column layout */}
                            <img
                                src={selectedClinic?.doctorImage}
                                alt="Doctor"
                                className="max-h-[500px] w-full" // Adjust to max-height and maintain aspect ratio
                            />
                            <button
                                className="mt-4 bg-red-500 text-white px-4 py-2 rounded self-center" // Center the button
                                onClick={closeImageModal}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}

                {/* Confirmation Modal */}
                {isDeleteConfirmOpen && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                        <div className="bg-white p-4 rounded-lg shadow-lg">
                            <p>Do you really want to delete?</p>
                            <div className="flex justify-between mt-4">
                                <button
                                    className="bg-red-500 text-white px-4 py-2 rounded"
                                    onClick={handleDeleteClinic}
                                >
                                    Yes
                                </button>
                                <button
                                    className="bg-gray-300 px-4 py-2 rounded"
                                    onClick={() => setIsDeleteConfirmOpen(false)}
                                >
                                    No
                                </button>
                            </div>
                        </div>
                    </div>
                )}


                {isModalOpen && (
                    <ScheduleModal
                        selectedClinic={selectedClinic}
                        selectedType={scheduleType}
                        onClose={() => setIsModalOpen(false)}
                    />
                )}

                {isEditModalOpen && (
                    <EditClinicModal
                        clinic={selectedClinic}
                        onClose={() => setIsEditModalOpen(false)}
                        onUpdate={handleUpdateClinic}
                        isLoading={loadingClinicId === selectedClinic?._id}
                    />
                )}

                {isFollowUpModalOpen && (
                    <FollowUpModal
                        isOpen={isFollowUpModalOpen}
                        onClose={closeFollowUpModal}
                        followUps={selectedFollowUps}
                    />
                )}
            </div>
        </div>
    );
};

export default DoctorList;