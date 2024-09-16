import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSchedules, setLoading } from "@/redux/listScheduleSlice";
import axios from 'axios';
import moment from "moment";

const Appointments = () => {
  const dispatch = useDispatch();
  const { todaysSchedule, upcomingSchedule, loading } = useSelector((state) => state.listSchedule);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const token = localStorage.getItem("token");
        dispatch(setLoading(true));
  
        const headers = {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        };
  
        const [todayResponse, upcomingResponse] = await Promise.all([
          axios.get('https://mnlifescience.vercel.app/api/schedule/today', { headers }),
          axios.get('https://mnlifescience.vercel.app/api/schedule/upcoming', { headers }),
        ]);
  
        dispatch(setSchedules({
          todaysSchedule: todayResponse.data.scheduleCalls,
          upcomingSchedule: upcomingResponse.data.scheduleCalls,
        }));
      } catch (error) {
        console.error('Failed to load schedules', error);
      } finally {
        dispatch(setLoading(false));
      }
    };
  
    fetchSchedules();
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-4 mt-5">
      {/* Today's Schedule */}
      <h2 className="font-bold text-[18px] text-[#386D62]">Today's Call Schedule</h2>
      <div className="grid grid-cols-3 gap-4">
        {todaysSchedule.map((call) => (
          <div key={call.id} className="p-4 bg-[#EEEEEE] shadow rounded-lg">
            {/* 2-column layout for details and buttons */}
            <div className="grid grid-cols-2 gap-4">
              {/* First Row: Name and Update Status */}
              <div>
                {call.doctorName && <p>Doctor: {call.doctorName}</p>}
                {call.pharmacyName && <p>Pharmacy: {call.pharmacyName}</p>}
              </div>
              <div>
                <button className="px-4 py-2 bg-blue-500 text-white rounded">Update Status</button>
              </div>

              {/* Second Row: Number and Update Notes */}
              <div>
                {call.doctorNumber && <p>Doctor No: {call.doctorNumber}</p>}
                {call.pharmacyNumber && <p>Pharmacy No: {call.pharmacyNumber}</p>}
              </div>
              <div>
                <button className="px-4 py-2 bg-yellow-500 text-white rounded">Update Notes</button>
              </div>

              {/* Third Row: Call Time/Date and Reschedule Call */}
              <div>
                {call.date && call.time && (
                  <p>{moment(call.date).format("D MMM YYYY")} - {call.time}</p>
                )}
              </div>
              <div>
                <button className="px-4 py-2 bg-green-500 text-white rounded">Reschedule Call</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming Schedule */}
      <h2 className="font-bold text-[18px] text-[#386D62] ">Upcoming Call Schedule</h2>
      <div className="grid grid-cols-3 gap-4">
        {upcomingSchedule.map((call) => (
          <div key={call.id} className="p-4 bg-[#EEEEEE] shadow rounded-lg">
            {/* 2-column layout for details and buttons */}
            <div className="grid grid-cols-2 gap-4">
              {/* First Row: Name and Update Status */}
              <div>
                {call.doctorName && <p>Doctor: {call.doctorName}</p>}
                {call.pharmacyName && <p>Pharmacy: {call.pharmacyName}</p>}
              </div>
              <div>
                <button className="px-4 py-2 bg-blue-500 text-white rounded">Update Status</button>
              </div>

              {/* Second Row: Number and Update Notes */}
              <div>
                {call.doctorNumber && <p>Doctor No: {call.doctorNumber}</p>}
                {call.pharmacyNumber && <p>Pharmacy No: {call.pharmacyNumber}</p>}
              </div>
              <div>
                <button className="px-4 py-2 bg-yellow-500 text-white rounded">Update Notes</button>
              </div>

              {/* Third Row: Call Time/Date and Reschedule Call */}
              <div>
                {call.date && call.time && (
                  <p>{moment(call.date).format("D MMM YYYY")} - {call.time}</p>
                )}
              </div>
              <div>
                <button className="px-4 py-2 bg-green-500 text-white rounded">Reschedule Call</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Appointments;
