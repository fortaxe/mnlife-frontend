import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UpdateNotes = ({ scheduleId, onClose }) => {
  const [notes, setNotes] = useState('');
  const [editingNote, setEditingNote] = useState('');

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        };
        const response = await axios.post('https://mnlifescience.vercel.app/api/admin/get-notes', { id: scheduleId }, { headers });
        setNotes(response.data.notes);
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    };

    fetchNotes();
  }, [scheduleId]);

  const handleNoteChange = (newNote) => {
    setEditingNote(newNote);
  };

  const handleUpdateNotes = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
      await axios.patch('https://mnlifescience.vercel.app/api/admin/edit-otes', {
        id: scheduleId,
        notes: editingNote || notes, // Use edited note or the existing one
      }, { headers });

      onClose(); // Close the popup after the notes are updated
    } catch (error) {
      console.error('Error updating notes:', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Update Notes</h2>
        <textarea
          className="w-full h-[100px] p-2 border border-gray-300"
          value={editingNote || notes}
          onChange={(e) => handleNoteChange(e.target.value)}
        />
        <div className="mt-4 flex justify-end space-x-2">
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>Cancel</button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleUpdateNotes}>Update Notes</button>
        </div>
      </div>
    </div>
  );
};

export default UpdateNotes;
