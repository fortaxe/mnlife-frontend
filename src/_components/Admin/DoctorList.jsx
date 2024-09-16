import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment"; 
import { Edit, Archive } from "lucide-react"; 
import { toast } from "react-toastify"; 
import ScheduleModal from "./ScheduleModal"; // Import the ScheduleModal component

const DoctorList = () => {
    const [clinics, setClinics] = useState([]);
    const [editingNote, setEditingNote] = useState({}); // To track which note is being edited
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedClinic, setSelectedClinic] = useState(null);
    const [scheduleType, setScheduleType] = useState('');

    // Fetch the clinics from the API when the component loads
    useEffect(() => {
        const fetchClinics = async () => {
            try {
                const token = localStorage.getItem("token");

                if (token) {
                    const response = await axios.get("https://mnlifescience.vercel.app/api/getClinics", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    setClinics(response.data); // Assuming the clinics are returned in response.data
                    console.log(response.data);
                } else {
                    console.error("No token found in localStorage");
                }
            } catch (error) {
                console.error("Error fetching clinics:", error);
            }
        };

        fetchClinics();
    }, []);

    const handleNoteChange = (index, value) => {
        setEditingNote(prevState => ({ ...prevState, [index]: value }));
    };

    const openScheduleModal = (clinic, type) => {
        setSelectedClinic(clinic);
        setScheduleType(type);
        setIsModalOpen(true);
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                <thead className="ltr:text-left rtl:text-right">
                    <tr>
                        <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Edit</th>
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
                        <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">WhatsApp Contacted</th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                    {clinics.map((clinic, index) => (
                        <tr className="odd:bg-gray-50" key={index} style={{ height: "80px" }}>
                            <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                <Edit className="w-5 h-5 text-gray-700" />
                            </td>
                            <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                {moment(clinic.createdAt).format('D MMM YYYY')}
                                <button className="block p-1 px-4 rounded-md mt-2 text-sm  bg-[#FFD9BD]">
                                    Archive
                                </button>
                            </td>
                            <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                                {clinic.doctorName}
                                <button
                                    className="block p-1 px-4 rounded-md mt-2 text-sm  bg-[#E2FFBD]"
                                    onClick={() => openScheduleModal(clinic, 'doctor')}
                                >
                                    Schedule Call
                                </button>
                            </td>
                            <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                {clinic.doctorNumber}
                                <input type="checkbox" className="block mt-2" />
                            </td>
                            <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                {clinic.pharmacyName}
                                <button
                                    className="block p-1 px-4 rounded-md mt-2 text-sm  bg-[#E2FFBD]"
                                    onClick={() => openScheduleModal(clinic, 'pharmacy')}
                                >
                                    Schedule Call
                                </button>
                            </td>
                            <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                {clinic.pharmacyNumber}
                                <input type="checkbox" className="block mt-2" />
                            </td>
                            <td className="whitespace-nowrap px-4 py-2 text-blue-500 cursor-pointer" onClick={() => console.log(`Clicked on location: ${clinic.location.coordinates}`)}>
                                Location
                            </td>
                            <td className="whitespace-nowrap px-4 py-2 text-gray-700">{clinic.grade}</td>
                            <td className="whitespace-nowrap px-4 py-2 text-gray-700">{clinic.createdBy.name}</td>
                            <td className="whitespace-nowrap px-4 py-2 text-gray-700">{clinic.remarks}</td>
                            <td className="whitespace-nowrap px-4 py-2">
                                <input
                                    type="text"
                                    className="w-[250px] h-[66px] p-2 border border-gray-300"
                                    value={editingNote[index] || clinic.notes}
                                    onChange={(e) => handleNoteChange(index, e.target.value)}
                                />
                                {editingNote[index] && <Edit className="w-5 h-5 text-gray-700" />}
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
        </div>
    );
};

export default DoctorList;
