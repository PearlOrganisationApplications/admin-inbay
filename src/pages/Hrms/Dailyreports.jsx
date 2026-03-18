import React, { useState, useEffect } from "react";

const Dailyreports = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const data = [
    {
      date: "2026-03-17",
      day: "Monday",
      group: "Uttarakhand",
      teamName: "Team A",
      staffName: "John Doe",
      reportingTo: "Manager 1",
      designation: "Sales Exec",
      hq: "Dehradun",
      attendance: "Present",
      startTime: "09:00 AM",
      endTime: "06:00 PM",
      duration: "9h",
      startKm: "1200",
      endKm: "1230",
      totalOdo: "30",
      gpsKm: "28",
      startLocation: "Office",
      endLocation: "Field",
      farmerMeeting: "Yes",
      fieldVisit: "Yes",
      remarks: "Followed up with clients",
      morningRemark: "On Time",
      eveningRemark: "Completed",
      visitSchedule: "5",
      visitCompleted: "4",
    },
    {
      date: "2026-03-16",
      day: "Sunday",
      group: "Uttarakhand",
      teamName: "Team B",
      staffName: "Aman Singh",
      reportingTo: "Manager 2",
      designation: "Field Officer",
      hq: "Rishikesh",
      attendance: "Absent",
      startTime: "09:00 AM",
      endTime: "06:00 PM",
      duration: "0h",
      startKm: "1300",
      endKm: "1300",
      totalOdo: "0",
      gpsKm: "0",
      startLocation: "Home",
      endLocation: "Home",
      farmerMeeting: "No",
      fieldVisit: "No",
      remarks: "On Leave",
      morningRemark: "-",
      eveningRemark: "-",
      visitSchedule: "3",
      visitCompleted: "0",
    },
    {
      date: "2026-03-15",
      day: "Saturday",
      group: "UP",
      teamName: "Team C",
      staffName: "Ravi Kumar",
      reportingTo: "Manager 3",
      designation: "Sales Exec",
      hq: "Haridwar",
      attendance: "Present",
      startTime: "10:00 AM",
      endTime: "05:00 PM",
      duration: "7h",
      startKm: "1100",
      endKm: "1130",
      totalOdo: "30",
      gpsKm: "29",
      startLocation: "Office",
      endLocation: "Market",
      farmerMeeting: "Yes",
      fieldVisit: "Yes",
      remarks: "Visited dealers",
      morningRemark: "Late",
      eveningRemark: "Done",
      visitSchedule: "4",
      visitCompleted: "4",
    },
    {
      date: "2026-03-14",
      day: "Friday",
      group: "Delhi",
      teamName: "Team D",
      staffName: "Neha Sharma",
      reportingTo: "Manager 4",
      designation: "Coordinator",
      hq: "Delhi",
      attendance: "Present",
      startTime: "09:30 AM",
      endTime: "06:30 PM",
      duration: "9h",
      startKm: "900",
      endKm: "940",
      totalOdo: "40",
      gpsKm: "38",
      startLocation: "Office",
      endLocation: "Client Site",
      farmerMeeting: "No",
      fieldVisit: "Yes",
      remarks: "Client meeting",
      morningRemark: "On Time",
      eveningRemark: "Good",
      visitSchedule: "6",
      visitCompleted: "5",
    },
    {
      date: "2026-03-13",
      day: "Thursday",
      group: "Punjab",
      teamName: "Team E",
      staffName: "Karan Verma",
      reportingTo: "Manager 5",
      designation: "Sales Rep",
      hq: "Chandigarh",
      attendance: "Absent",
      startTime: "-",
      endTime: "-",
      duration: "0h",
      startKm: "-",
      endKm: "-",
      totalOdo: "0",
      gpsKm: "0",
      startLocation: "-",
      endLocation: "-",
      farmerMeeting: "No",
      fieldVisit: "No",
      remarks: "Sick Leave",
      morningRemark: "-",
      eveningRemark: "-",
      visitSchedule: "2",
      visitCompleted: "0",
    },
    {
      date: "2026-03-12",
      day: "Wednesday",
      group: "Haryana",
      teamName: "Team F",
      staffName: "Pooja Gupta",
      reportingTo: "Manager 6",
      designation: "Executive",
      hq: "Gurgaon",
      attendance: "Present",
      startTime: "09:00 AM",
      endTime: "06:00 PM",
      duration: "9h",
      startKm: "800",
      endKm: "835",
      totalOdo: "35",
      gpsKm: "34",
      startLocation: "Office",
      endLocation: "Field",
      farmerMeeting: "Yes",
      fieldVisit: "Yes",
      remarks: "Field work",
      morningRemark: "On Time",
      eveningRemark: "Completed",
      visitSchedule: "5",
      visitCompleted: "5",
    },
  ];

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handleExport = () => {
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map((obj) => Object.values(obj).join(",")).join("\n");
    const csv = headers + "\n" + rows;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "attendance-log.csv";
    a.click();
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 h-screen overflow-hidden flex flex-col font-sans">
      {/* 1. TOP TITLE SECTION - FIXED */}
      <div className="flex justify-between items-center mb-6 shrink-0 border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
            Reports Logs
          </h2>
          <p className="text-sm text-gray-500 font-medium">
            Track employee field activities, visits, and daily work logs
          </p>
        </div>
        <button
          onClick={handleExport}
          className="bg-[#8b2cf5] text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-[#7a26d9] flex items-center gap-2 transition-all shadow-md"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Export CSV
        </button>
      </div>

      {/* 2. SEARCH & FILTER SECTION - FIXED */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 shrink-0">
        <div className="relative w-full md:max-w-md">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search by Employee Name..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all shadow-sm"
          />
        </div>
        <div className="flex items-center gap-3 bg-white border border-gray-200 px-4 py-2.5 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors shadow-sm w-full md:w-auto">
          <svg
            className="w-5 h-5 text-[#8b2cf5]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          <span className="text-sm font-semibold text-gray-700">
            All Shifts
          </span>
        </div>
      </div>

      {/* 3. SCROLLABLE AREA (Stats + Employee Cards) */}
      <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar pb-10">
        {/* STATS CARDS SECTION - NOW INSIDE SCROLL */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Employees */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-[#8b2cf5]">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500 mb-1">
                Total Employees
              </p>
              <p className="text-3xl font-black text-gray-900">15</p>
            </div>
          </div>

          {/* Total Present */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500 mb-1">
                Total Present
              </p>
              <p className="text-3xl font-black text-gray-900">11</p>
            </div>
          </div>

          {/* Total Absent */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-500">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500 mb-1">
                Total Absent
              </p>
              <p className="text-3xl font-black text-gray-900">4</p>
            </div>
          </div>
        </div>

        {/* EMPLOYEE CARDS LIST */}
        <div className="space-y-4">
          {currentData.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-4 items-center">
                  <div className="w-14 h-14 rounded-full bg-[#8b2cf5] text-white flex items-center justify-center text-xl font-bold shadow-sm">
                    {item.staffName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {item.staffName}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                      <span className="flex items-center gap-1.5">
                        {item.designation}
                      </span>
                      <span className="flex items-center gap-1.5">
                        {item.hq}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-2.5">
                      <span className="bg-purple-50 text-[#8b2cf5] text-[11px] px-2.5 py-1 rounded-md font-semibold tracking-wide">
                        {item.teamName}
                      </span>
                      <span className="bg-purple-50 text-[#8b2cf5] text-[11px] px-2.5 py-1 rounded-md font-semibold tracking-wide">
                        {item.group}
                      </span>
                      <span className="bg-gray-100 text-gray-600 text-[11px] px-2.5 py-1 rounded-md font-semibold tracking-wide border border-gray-200">
                        Reporting: {item.reportingTo}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div
                    className={`px-3 py-1 rounded-full border text-xs font-bold flex items-center gap-1.5 ${item.attendance.toLowerCase() === "present" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}
                  >
                    {item.attendance}
                  </div>
                  <div className="text-xs text-gray-400">
                    {item.date} ({item.day})
                  </div>
                </div>
              </div>

              {/* Grid details (Same as before) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/50">
                  <h4 className="text-[11px] font-bold text-[#8b2cf5] mb-3 uppercase tracking-wider">
                    Time & Visits
                  </h4>
                  <div className="space-y-2.5 text-sm text-gray-800">
                    <div className="flex justify-between">
                      <span>Scheduled Time</span>
                      <span className="font-semibold">
                        {item.startTime} - {item.endTime}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Visits</span>
                      <span className="font-semibold">
                        {item.visitCompleted} / {item.visitSchedule}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-100">
                      <span>Total Hours</span>
                      <span className="bg-purple-100 text-[#8b2cf5] px-2 py-0.5 rounded font-bold">
                        {item.duration}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/50">
                  <h4 className="text-[11px] font-bold text-[#8b2cf5] mb-3 uppercase tracking-wider">
                    Travel Details
                  </h4>
                  <div className="space-y-2.5 text-sm text-gray-800">
                    <div className="flex justify-between">
                      <span>Route</span>
                      <span className="font-semibold">
                        {item.startLocation} → {item.endLocation}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Odometer</span>
                      <span className="font-semibold">
                        {item.startKm} → {item.endKm}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-100">
                      <span>Distance</span>
                      <span className="font-bold">
                        {item.totalOdo} KM (GPS: {item.gpsKm})
                      </span>
                    </div>
                  </div>
                </div>
                <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/50">
                  <h4 className="text-[11px] font-bold text-[#8b2cf5] mb-3 uppercase tracking-wider">
                    Remarks
                  </h4>
                  <div className="space-y-2.5 text-sm text-gray-800">
                    <div className="flex justify-between">
                      <span>Morning</span>
                      <span className="font-semibold">
                        {item.morningRemark}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Evening</span>
                      <span className="font-semibold">
                        {item.eveningRemark}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-100">
                      <span>General</span>
                      <span className="font-semibold truncate w-24">
                        {item.remarks}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. PAGINATION - FIXED AT BOTTOM */}
      <div className="flex justify-center items-center gap-2 mt-4 pb-4 shrink-0 bg-gray-50">
        <button
          onClick={() => setCurrentPage((prev) => prev - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-md border bg-white text-sm disabled:opacity-50"
        >
          Prev
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded-md text-sm ${currentPage === i + 1 ? "bg-[#8b2cf5] text-white" : "bg-white border"}`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-md border bg-white text-sm disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Dailyreports;
