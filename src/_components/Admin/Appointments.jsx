import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSchedules, setLoading, updateScheduleStatus } from "@/redux/listScheduleSlice";
import axios from 'axios';
import Navbar from "./Navbar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { toast } from "react-toastify";
import ScheduleModal from './ScheduleModal';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import CircularProgress from '@mui/material/CircularProgress';
import moment from "moment-timezone";

const Appointments = () => {
  const dispatch = useDispatch();
  const { todaysSchedule, upcomingSchedule, loading } = useSelector((state) => state.listSchedule);
  const [status, setStatus] = useState("Scheduled");
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [notes, setNotes] = useState("");
  const [isEditing, setIsEditing] = useState(false); // Editing mode managed by Dialog
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    fetchSchedules();
  }, [dispatch]);

  const fetchSchedules = async () => {
    try {
      const token = localStorage.getItem("token");
      dispatch(setLoading(true));

      const headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      // Fetch today's schedule first
      const todayResponse = await axios.get('https://mnlifescience.vercel.app/api/schedule/today', { headers });
      dispatch(setSchedules({
        todaysSchedule: todayResponse.data.scheduleCalls,
        upcomingSchedule: [],  // Keep upcoming empty initially
      }));

      // Fetch upcoming schedule next
      const upcomingResponse = await axios.get('https://mnlifescience.vercel.app/api/schedule/upcoming', { headers });
      dispatch(setSchedules({
        todaysSchedule: todayResponse.data.scheduleCalls,
        upcomingSchedule: upcomingResponse.data.scheduleCalls,
      }));

      console.log("API response time:", todayResponse);

    } catch (error) {
      console.error('Failed to load schedules', error);
    } finally {
      dispatch(setLoading(false));
    }
  };


  const handleStatusUpdate = async (scheduleCallId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      setLoadingId(scheduleCallId);

      await axios.patch(
        `https://mnlifescience.vercel.app/api/schedule/update-status`,
        { scheduleCallId, updateStatus: newStatus },
        { headers }
      );

      dispatch(updateScheduleStatus({ scheduleCallId, updateStatus: newStatus }));
      // Update local state to reflect the change immediately
      const updateScheduleList = (list) =>
        list.map(call =>
          call.scheduleCallId === scheduleCallId
            ? { ...call, status: newStatus }
            : call
        );

      dispatch(setSchedules({
        todaysSchedule: updateScheduleList(todaysSchedule),
        upcomingSchedule: updateScheduleList(upcomingSchedule),
      }));

      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    } finally {
      setLoadingId(null);
    }
  };
  const handleNotesChange = (event) => {
    setNotes(event.target.value);
  };

  const handleSaveNotes = async (scheduleCallId) => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      await axios.patch(
        `https://mnlifescience.vercel.app/api/admin/edit-notes`,
        { id: scheduleCallId, notes },
        { headers }
      );
      toast.success("Notes updated successfully!");

      setIsEditing(false); // Disable editing mode
    } catch (error) {
      console.error("Error updating notes:", error);
    }
  };

  const handleRescheduleClick = (scheduleCallId) => {
    setSelectedScheduleId(scheduleCallId);  // Use selectedScheduleId state
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedScheduleId(null);  // Clear selectedScheduleId when closing modal
    setIsModalOpen(false);
    fetchSchedules();
  };
  const formatTime = (utcTime) => {
    const date = new Date(utcTime);
    let hours = date.getUTCHours();
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    return `${hours}:${minutes} ${ampm}`;
  };

  const formatDateAndTime = (utcTime) => {
    const date = new Date(utcTime);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getUTCMonth()];
    const day = date.getUTCDate();
    const year = date.getUTCFullYear();
    const time = formatTime(utcTime);
    return `${month} ${day}, ${year} - ${time}`;
  };


  return (
    <div>
      <Navbar />
      <div className="space-x-4 space-y-4 mt-20 pr-4">
        {/* Today's Schedule */}
        <h2 className="font-bold text-[18px] ml-4 text-[#386D62]">Today's Call Schedule</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {todaysSchedule?.map((call) => (
            <div key={call?.scheduleCallId} className="bg-[#EEEEEE] shadow rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <div>
                  {<p>Dr. {call?.doctorName}</p>}
                  {<p>{call?.pharmacyName}</p>}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger className="px-4 py-2 bg-[#E2FFBD] text-black rounded">
                    {loadingId === call?.scheduleCallId ? (
                      <CircularProgress size={24} />
                    ) : (
                      call?.status === "Scheduled" ? "Update Status" : call?.status
                    )}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleStatusUpdate(call?.scheduleCallId, "Call Done")}>
                      Call Done
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusUpdate(call?.scheduleCallId, "Cancelled")}>
                      Cancelled
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex justify-between items-center mb-4">
                <div>
                  {<p>{call?.doctorNumber}</p>}
                  {<p>{call?.pharmacyNumber}</p>}
                </div>
                <Dialog onOpenChange={(open) => !open && setIsEditing(false)} open={isEditing}>
                  <DialogTrigger asChild>
                    <Button
                      className="px-4 py-2 bg-[#FFD9BD] rounded text-black hover:bg-[#FFD9BD]"
                      onClick={() => {
                        setNotes(call?.notes || "");
                        setSelectedScheduleId(call?.scheduleCallId);
                        setIsEditing(true);
                      }}
                    >
                      Update Notes
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>Edit Notes</DialogHeader>
                    <Input
                      type="text"
                      value={notes}
                      onChange={handleNotesChange}
                      className="mb-4"
                    />
                    <DialogFooter>
                      <Button onClick={() => handleSaveNotes(selectedScheduleId)} className="mr-2">
                        Save
                      </Button>
                      <DialogClose asChild>
                        <Button variant="secondary">Cancel</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="flex justify-between items-center">
                <p>{formatTime(call?.time)}</p>
                <button onClick={() => handleRescheduleClick(call?.scheduleCallId)} className=" py-2 text-blue-700 rounded">
                  Reschedule Call
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Upcoming Schedule */}
        <h2 className="font-bold text-[18px] text-[#386D62]">Upcoming Call Schedule</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcomingSchedule?.map((call) => (
            <div key={call?.scheduleCallId} className="bg-[#EEEEEE] shadow rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <div>
                  {<p>Dr.{call?.doctorName}</p>}
                  {<p>{call?.pharmacyName}</p>}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger className="px-4 py-2 bg-[#E2FFBD] text-black rounded">
                    {loadingId === call?.scheduleCallId ? (
                      <CircularProgress size={24} />
                    ) : (
                      call?.status === "Scheduled" ? "Update Status" : call?.status
                    )}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleStatusUpdate(call?.scheduleCallId, "Call Done")}>
                      Call Done
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusUpdate(call?.scheduleCallId, "Cancelled")}>
                      Cancelled
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex justify-between items-center mb-4">
                <div>
                  {<p>{call?.doctorNumber}</p>}
                  {<p>{call?.pharmacyNumber}</p>}
                </div>

                <Dialog onOpenChange={(open) => !open && setIsEditing(false)} open={isEditing}>
                  <DialogTrigger asChild>
                    <Button
                      className="px-4 py-2 bg-[#FFD9BD] rounded text-black hover:bg-[#FFD9BD]"
                      onClick={() => {
                        setNotes(call?.notes || "");
                        setSelectedScheduleId(call.scheduleCallId);
                        setIsEditing(true);
                      }}
                    >
                      Update Notes
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>Edit Notes</DialogHeader>
                    <Input
                      type="text"
                      value={notes}
                      onChange={handleNotesChange}
                      className="mb-4"
                    />
                    <DialogFooter>
                      <Button onClick={() => handleSaveNotes(selectedScheduleId)} className="mr-2">
                        Save
                      </Button>
                      <DialogClose asChild>
                        <Button variant="secondary">Cancel</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="flex justify-between items-center">
                <div>{call?.time && <p>{formatDateAndTime(call?.time)}</p>}</div>
                <button onClick={() => handleRescheduleClick(call?.scheduleCallId)} className=" py-2 text-blue-700 rounded">
                  Reschedule Call
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for Rescheduling */}
        {isModalOpen && (
          <ScheduleModal
            selectedType={"doctor"} // Or fetch the type dynamically
            scheduleCallId={selectedScheduleId}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  );
};

export default Appointments;
