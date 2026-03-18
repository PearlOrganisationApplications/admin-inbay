import React from "react";

const Visit = () => {
  // 📋 Client data
  const visitData = [
    {
      salesRepEmail: "john@test.com",
      salesRep: "John Doe",
      agenda: "Product Demo & Order Collection",
      customerCode: "CUST-001",
      customer: "Acme Traders",
      phone: "+91 9876543210",
      department: "Sales",
      contactPerson: "Mr. Sharma",
      address: "123 Business Hub",
      city: "Delhi",
      state: "Delhi",
      order: "₹50,000",
      expense: "₹500",
      route: "Route A (North)",
      actualVisitDate: "2026-03-17",
      actualVisitStartTime: "10:00 AM",
      actualVisitEndTime: "11:30 AM",
      scheduleVisitDate: "2026-03-17",
      scheduleVisitStartTime: "09:30 AM",
      scheduleVisitEndTime: "11:00 AM",
      remark: "Demo successful, order placed.",
      location: "Delhi Field",
      visitDistance: "15 KM",
      durationTime: "1h 30m",
    },
  ];

  // ✅ Export CSV Function
  const handleExport = () => {
    if (visitData.length === 0) return;
    const headers = Object.keys(visitData[0]).join(",");
    const rows = visitData
      .map((obj) => Object.values(obj).join(","))
      .join("\n");
    const csv = headers + "\n" + rows;

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "visit-logs.csv";
    a.click();
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 h-screen overflow-hidden flex flex-col font-sans">
      {/* 1. TOP TITLE SECTION - Same as Attendance Log */}
      <div className="flex justify-between items-center mb-6 shrink-0 border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
            Visit Logs
          </h2>
          <p className="text-sm text-gray-500 font-medium">
            Track sales rep visits, customer details, and outcomes
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

      {/* 2. SEARCH & FILTER SECTION - Same Style */}
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
            placeholder="Search by Sales Rep or Customer..."
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
            All Departments
          </span>
        </div>
      </div>

      {/* 3. STATS CARDS SECTION - Matching UI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 shrink-0">
        {/* Total Visits */}
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
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 mb-1">Total Visits</p>
            <p className="text-3xl font-black text-gray-900">42</p>
          </div>
        </div>

        {/* Total Orders */}
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
              Orders Placed
            </p>
            <p className="text-3xl font-black text-gray-900">28</p>
          </div>
        </div>

        {/* Pending/Cancelled */}
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
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 mb-1">
              Total Expenses
            </p>
            <p className="text-3xl font-black text-gray-900">₹12.5k</p>
          </div>
        </div>
      </div>

      {/* SCROLLABLE LIST OF CARDS (USER SECTION - NO CHANGES HERE) */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar pb-10">
        {visitData.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-5"
          >
            {/* CARD TOP INFO */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex gap-4 items-center">
                {/* Avatar */}
                <div className="w-14 h-14 rounded-full bg-[#8b2cf5] text-white flex items-center justify-center text-xl font-bold shadow-sm">
                  {item.salesRep.charAt(0)}
                </div>

                {/* Employee Info */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {item.salesRep}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                    <span className="flex items-center gap-1.5">
                      <svg
                        className="w-4 h-4 text-purple-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      {item.salesRepEmail}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <svg
                        className="w-4 h-4 text-purple-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                        />
                      </svg>
                      {item.route}
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="flex gap-2 mt-2.5">
                    <span className="bg-purple-50 text-[#8b2cf5] text-[11px] px-2.5 py-1 rounded-md font-semibold tracking-wide">
                      {item.department}
                    </span>
                    <span className="bg-gray-100 text-gray-600 text-[11px] px-2.5 py-1 rounded-md font-semibold tracking-wide border border-gray-200">
                      Location: {item.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status & Date */}
              <div className="flex flex-col items-end gap-2">
                <div className="px-3 py-1 rounded-full border border-green-200 bg-green-50 text-green-700 flex items-center gap-1.5 text-xs font-bold">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Visited
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {item.actualVisitDate || item.scheduleVisitDate}
                </div>
              </div>
            </div>

            {/* INNER GRID DETAILS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Box 1: Customer Details */}
              <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/50 flex flex-col justify-between">
                <div>
                  <h4 className="text-[11px] font-bold text-[#8b2cf5] flex items-center gap-1.5 mb-3 uppercase tracking-wider">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    Customer Details
                  </h4>
                  <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Customer</span>
                      <span className="font-semibold text-gray-800">
                        {item.customer} ({item.customerCode})
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Contact</span>
                      <span className="font-semibold text-gray-800">
                        {item.contactPerson}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Phone</span>
                      <span className="font-semibold text-gray-800">
                        {item.phone}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-start pt-2 mt-2 border-t border-gray-100 text-sm">
                  <span className="text-gray-500">Address</span>
                  <span
                    className="text-gray-800 text-right w-32 truncate"
                    title={`${item.address}, ${item.city}, ${item.state}`}
                  >
                    {item.address}, {item.city}
                  </span>
                </div>
              </div>

              {/* Box 2: Time Tracking */}
              <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/50 flex flex-col justify-between">
                <div>
                  <h4 className="text-[11px] font-bold text-[#8b2cf5] flex items-center gap-1.5 mb-3 uppercase tracking-wider">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Schedule & Time
                  </h4>
                  <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Scheduled Date</span>
                      <span className="font-semibold text-gray-800">
                        {item.scheduleVisitDate}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Scheduled Time</span>
                      <span className="font-semibold text-gray-800">
                        {item.scheduleVisitStartTime} -{" "}
                        {item.scheduleVisitEndTime}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Actual Time</span>
                      <span className="font-semibold text-gray-800">
                        {item.actualVisitStartTime} - {item.actualVisitEndTime}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2 mt-2 border-t border-gray-100 text-sm">
                  <span className="text-gray-500">Duration</span>
                  <span className="bg-purple-100 text-[#8b2cf5] text-xs px-2.5 py-1.5 rounded-md font-bold">
                    {item.durationTime}
                  </span>
                </div>
              </div>

              {/* Box 3: Outcomes */}
              <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/50 flex flex-col justify-between">
                <div>
                  <h4 className="text-[11px] font-bold text-[#8b2cf5] flex items-center gap-1.5 mb-3 uppercase tracking-wider">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                      />
                    </svg>
                    Visit & Outcomes
                  </h4>
                  <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Agenda</span>
                      <span
                        className="font-semibold text-gray-800 truncate w-24 text-right"
                        title={item.agenda}
                      >
                        {item.agenda}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Order Placed</span>
                      <span className="font-semibold text-green-600">
                        {item.order || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Expense Claimed</span>
                      <span className="font-semibold text-red-500">
                        {item.expense || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2 mt-2 border-t border-gray-100 text-sm">
                  <span className="text-gray-500">Remark / Dist.</span>
                  <span
                    className="font-bold text-gray-900 truncate w-24 text-right"
                    title={item.remark}
                  >
                    {item.remark}{" "}
                    <span className="text-xs font-normal text-gray-400 ml-1">
                      ({item.visitDistance})
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Visit;
