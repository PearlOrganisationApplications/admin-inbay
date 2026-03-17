import React from "react";
import { 
  CheckCircle, 
  XCircle, 
  Download, 
  MapPin, 
  Mail, 
  Clock, 
  Car, 
  MessageSquare, 
  Calendar 
} from "lucide-react";

const Attendance = () => {
  // Added a second dummy record to show both Present and Absent states
  const data =[
    {
      date: "2026-03-17",
      day: "Tuesday",
      name: "John Doe",
      email: "john@test.com",
      group: "A",
      department: "Sales",
      attendance: "Present",
      scheduledStart: "09:00 AM",
      scheduledEnd: "06:00 PM",
      actualStart: "09:10 AM",
      actualEnd: "05:50 PM",
      totalHours: "8h 40m",
      location: "Office",
      endLocation: "Home",
      remarks: "Followed up with 5 clients.",
      distance: "12",
      morningRemark: "On Time",
      eveningRemark: "Left Early",
      morningOdo: "1200",
      eveningOdo: "1212",
      totalOdo: "12",
    },
    {
      date: "2026-03-17",
      day: "Tuesday",
      name: "Sarah Smith",
      email: "sarah@test.com",
      group: "B",
      department: "Marketing",
      attendance: "Absent",
      scheduledStart: "09:30 AM",
      scheduledEnd: "06:30 PM",
      actualStart: "-",
      actualEnd: "-",
      totalHours: "0h 0m",
      location: "Remote",
      endLocation: "-",
      remarks: "Sick Leave",
      distance: "0",
      morningRemark: "-",
      eveningRemark: "-",
      morningOdo: "-",
      eveningOdo: "-",
      totalOdo: "0",
    }
  ];

  // ✅ Export CSV
  const handleExport = () => {
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map((obj) => Object.values(obj).join(",")).join("\n");
    const csv = headers + "\n" + rows;

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "attendance.csv";
    a.click();
  };

  return (
    <div className="bg-gray-50 h-screen flex flex-col font-sans">
      {/* HEADER */}
      <div className="bg-white px-6 py-4 shadow-sm border-b border-gray-200 flex justify-between items-center z-10">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-800">Attendance Log</h2>
          <p className="text-sm text-gray-500 mt-1">Daily employee tracking and tracking</p>
        </div>

        <button
          onClick={handleExport}
          className="bg-purple-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors shadow-sm flex items-center gap-2"
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {/* CARD LIST WRAPPER */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {data.map((item, index) => {
            const isPresent = item.attendance.toLowerCase() === "present";

            return (
              <div 
                key={index} 
                className="bg-white rounded-2xl shadow-sm border border-purple-100 hover:shadow-md transition-shadow duration-200 overflow-hidden"
              >
                {/* TOP PROFILE SECTION */}
                <div className="p-5 md:p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  
                  {/* Avatar, Name, Email, Location */}
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 flex-shrink-0 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-bold text-xl shadow-sm">
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                      <div className="text-sm text-gray-500 flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                        <span className="flex items-center gap-1">
                          <Mail size={14} className="text-purple-500"/> {item.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={14} className="text-purple-500"/> {item.location}
                        </span>
                      </div>
                      <div className="mt-2 inline-flex items-center gap-2 text-xs font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-100">
                        {item.department} <span className="text-purple-300">•</span> Group {item.group}
                      </div>
                    </div>
                  </div>

                  {/* Date & Present/Absent Icon */}
                  <div className="flex flex-col items-start md:items-end w-full md:w-auto mt-2 md:mt-0">
                    {isPresent ? (
                      <span className="flex items-center gap-1.5 px-4 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-bold border border-green-200">
                        <CheckCircle size={18} className="text-green-600" /> Present
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 px-4 py-1.5 bg-red-50 text-red-700 rounded-full text-sm font-bold border border-red-200">
                        <XCircle size={18} className="text-red-600" /> Absent
                      </span>
                    )}
                    <span className="text-xs text-gray-400 mt-2 font-medium flex items-center gap-1">
                      <Calendar size={13}/> {item.date} ({item.day})
                    </span>
                  </div>
                </div>

                {/* BOTTOM DETAILS GRID */}
                <div className="p-5 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50/50">
                  
                  {/* Card 1: Timings */}
                  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <h4 className="text-xs font-bold text-purple-600 uppercase mb-3 flex items-center gap-2">
                      <Clock size={14}/> Time Tracking
                    </h4>
                    <div className="space-y-2.5 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Scheduled</span> 
                        <span className="font-medium text-gray-800">{item.scheduledStart} - {item.scheduledEnd}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Actual</span> 
                        <span className="font-medium text-gray-800">{item.actualStart} - {item.actualEnd}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2.5 border-t border-gray-100">
                        <span className="text-gray-500">Total Hours</span> 
                        <span className="font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded">{item.totalHours}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Travel & Location */}
                  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <h4 className="text-xs font-bold text-purple-600 uppercase mb-3 flex items-center gap-2">
                      <Car size={14}/> Travel Details
                    </h4>
                    <div className="space-y-2.5 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">End Location</span> 
                        <span className="font-medium text-gray-800">{item.endLocation}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Odometer</span> 
                        <span className="font-medium text-gray-800">{item.morningOdo} → {item.eveningOdo}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2.5 border-t border-gray-100">
                        <span className="text-gray-500">Total Distance</span> 
                        <span className="font-bold text-gray-800">{item.distance} KM</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Remarks */}
                  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <h4 className="text-xs font-bold text-purple-600 uppercase mb-3 flex items-center gap-2">
                      <MessageSquare size={14}/> Remarks
                    </h4>
                    <div className="space-y-2.5 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Morning</span> 
                        <span className="font-medium text-gray-800 truncate max-w-[120px]" title={item.morningRemark}>{item.morningRemark}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Evening</span> 
                        <span className="font-medium text-gray-800 truncate max-w-[120px]" title={item.eveningRemark}>{item.eveningRemark}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2.5 border-t border-gray-100">
                        <span className="text-gray-500">General</span> 
                        <span className="font-medium text-gray-800 truncate max-w-[120px]" title={item.remarks}>{item.remarks}</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Attendance;