import React from "react";

const Dailyreports = () => {
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
    a.download = "attendance-log.csv";
    a.click();
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 h-screen overflow-hidden flex flex-col font-sans">
      
      {/* 1. TOP TITLE SECTION */}
      <div className="flex justify-between items-center mb-6 shrink-0 border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Attendance Log</h2>
          <p className="text-sm text-gray-500 font-medium">
            Manage and track employee attendance
          </p>
        </div>

        <button
          onClick={handleExport}
          className="bg-[#8b2cf5] text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-[#7a26d9] flex items-center gap-2 transition-all shadow-md"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export CSV
        </button>
      </div>

      {/* 2. SEARCH & FILTER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 shrink-0">
        <div className="relative w-full md:max-w-md">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search by Employee Name..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all shadow-sm"
          />
        </div>

        <div className="flex items-center gap-3 bg-white border border-gray-200 px-4 py-2.5 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors shadow-sm w-full md:w-auto">
          <svg className="w-5 h-5 text-[#8b2cf5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span className="text-sm font-semibold text-gray-700">All Shifts</span>
        </div>
      </div>

      {/* 3. STATS CARDS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 shrink-0">
        {/* Total Employees */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-[#8b2cf5]">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 mb-1">Total Employees</p>
            <p className="text-3xl font-black text-gray-900">15</p>
          </div>
        </div>

        {/* Total Present */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 mb-1">Total Present</p>
            <p className="text-3xl font-black text-gray-900">11</p>
          </div>
        </div>

        {/* Total Absent */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-500">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 mb-1">Total Absent</p>
            <p className="text-3xl font-black text-gray-900">4</p>
          </div>
        </div>
      </div>

      {/* SCROLLABLE LIST OF CARDS (USER SECTION - NO CHANGES HERE) */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar pb-10">
        {data.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-5"
          >
            {/* CARD TOP INFO */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex gap-4 items-center">
                {/* Avatar */}
                <div className="w-14 h-14 rounded-full bg-[#8b2cf5] text-white flex items-center justify-center text-xl font-bold shadow-sm">
                  {item.staffName.charAt(0)}
                </div>

                {/* Employee Info */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {item.staffName}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                    <span className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {item.designation}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {item.hq}
                    </span>
                  </div>

                  {/* Tags */}
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

              {/* Status & Date */}
              <div className="flex flex-col items-end gap-2">
                {item.attendance.toLowerCase() === "present" ? (
                  <div className="px-3 py-1 rounded-full border border-green-200 bg-green-50 text-green-700 flex items-center gap-1.5 text-xs font-bold">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Present
                  </div>
                ) : (
                  <div className="px-3 py-1 rounded-full border border-red-200 bg-red-50 text-red-700 flex items-center gap-1.5 text-xs font-bold">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Absent
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {item.date} ({item.day})
                </div>
              </div>
            </div>

            {/* INNER GRID DETAILS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Box 1: Time Tracking */}
              <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/50">
                <h4 className="text-[11px] font-bold text-[#8b2cf5] flex items-center gap-1.5 mb-3 uppercase tracking-wider">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Time & Visits
                </h4>
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Scheduled Time</span>
                    <span className="font-semibold text-gray-800">{item.startTime} - {item.endTime}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Visits (Done/Total)</span>
                    <span className="font-semibold text-gray-800">{item.visitCompleted} / {item.visitSchedule}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 mt-2 border-t border-gray-100">
                    <span className="text-gray-500">Total Hours</span>
                    <span className="bg-purple-100 text-[#8b2cf5] text-xs px-2.5 py-1.5 rounded-md font-bold">{item.duration}</span>
                  </div>
                </div>
              </div>

              {/* Box 2: Travel Details */}
              <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/50">
                <h4 className="text-[11px] font-bold text-[#8b2cf5] flex items-center gap-1.5 mb-3 uppercase tracking-wider">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                  </svg>
                  Travel Details
                </h4>
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Route</span>
                    <span className="font-semibold text-gray-800 text-right">{item.startLocation} &rarr; {item.endLocation}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Odometer</span>
                    <span className="font-semibold text-gray-800">{item.startKm} &rarr; {item.endKm}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 mt-2 border-t border-gray-100">
                    <span className="text-gray-500">Total Distance</span>
                    <span className="font-bold text-gray-900">{item.totalOdo} KM <span className="text-xs font-normal text-gray-400 ml-1">(GPS: {item.gpsKm} KM)</span></span>
                  </div>
                </div>
              </div>

              {/* Box 3: Remarks */}
              <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/50">
                <h4 className="text-[11px] font-bold text-[#8b2cf5] flex items-center gap-1.5 mb-3 uppercase tracking-wider">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Remarks & Updates
                </h4>
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Morning</span>
                    <span className="font-semibold text-gray-800">{item.morningRemark}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Evening</span>
                    <span className="font-semibold text-gray-800">{item.eveningRemark}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 mt-2 border-t border-gray-100">
                    <span className="text-gray-500">General</span>
                    <span className="font-semibold text-gray-800 truncate w-24 text-right" title={item.remarks}>{item.remarks}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dailyreports;