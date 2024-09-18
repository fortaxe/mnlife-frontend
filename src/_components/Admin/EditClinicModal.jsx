import React, { useState } from 'react';
import axios from 'axios';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const EditClinicModal = ({ clinic, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        id: clinic._id,
        doctorName: clinic.doctorName,
        doctorNumber: clinic.doctorNumber,
        pharmacyName: clinic.pharmacyName,
        pharmacyNumber: clinic.pharmacyNumber,
        grade: clinic.grade,
        remarks: clinic.remarks,
        notes: clinic.notes,
        doctorWhatsAppContacted: clinic.doctorWhatsAppContacted,
        pharmacyWhatsAppContacted: clinic.pharmacyWhatsAppContacted,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleCheckboxChange = (name) => {
        setFormData(prevState => ({
            ...prevState,
            [name]: !prevState[name]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            await axios.patch(
                "https://mnlifescience.vercel.app/api/admin/edit-clinic",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            onUpdate(); // Call onUpdate without parameters
            onClose();
        } catch (error) {
            console.error("Error updating clinic:", error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-96">
                <h2 className="text-xl font-bold mb-4">Edit Clinic</h2>
                <form onSubmit={handleSubmit}>
                    <Input
                        name="doctorName"
                        value={formData.doctorName}
                        onChange={handleChange}
                        placeholder="Doctor Name"
                        className="mb-2"
                    />
                    <Input
                        name="doctorNumber"
                        value={formData.doctorNumber}
                        onChange={handleChange}
                        placeholder="Doctor Number"
                        className="mb-2"
                    />
                    <Input
                        name="pharmacyName"
                        value={formData.pharmacyName}
                        onChange={handleChange}
                        placeholder="Pharmacy Name"
                        className="mb-2"
                    />
                    <Input
                        name="pharmacyNumber"
                        value={formData.pharmacyNumber}
                        onChange={handleChange}
                        placeholder="Pharmacy Number"
                        className="mb-2"
                    />
                    <Select
                        name="grade"
                        value={formData.grade}
                        onValueChange={(value) => handleChange({ target: { name: 'grade', value } })}
                    >
                        <SelectTrigger className="mb-2">
                            <SelectValue placeholder="Select Grade" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="A">A</SelectItem>
                            <SelectItem value="B">B</SelectItem>
                        </SelectContent>
                    </Select>
                    <Input
                        name="remarks"
                        value={formData.remarks}
                        onChange={handleChange}
                        placeholder="Remarks"
                        className="mb-2"
                    />
                    <Input
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="Notes"
                        className="mb-2"
                    />
                    <div className="flex items-center mb-2">
                        <Checkbox
                            id="doctorWhatsAppContacted"
                            checked={formData.doctorWhatsAppContacted}
                            onCheckedChange={() => handleCheckboxChange('doctorWhatsAppContacted')}
                        />
                        <label htmlFor="doctorWhatsAppContacted" className="ml-2">
                            Doctor WhatsApp Contacted
                        </label>
                    </div>
                    <div className="flex items-center mb-4">
                        <Checkbox
                            id="pharmacyWhatsAppContacted"
                            checked={formData.pharmacyWhatsAppContacted}
                            onCheckedChange={() => handleCheckboxChange('pharmacyWhatsAppContacted')}
                        />
                        <label htmlFor="pharmacyWhatsAppContacted" className="ml-2">
                            Pharmacy WhatsApp Contacted
                        </label>
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" className="mr-2">Save</Button>
                        <Button onClick={onClose} variant="outline">Cancel</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditClinicModal;