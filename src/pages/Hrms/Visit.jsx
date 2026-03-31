import React, { useState, useEffect } from "react";

const Visit = () => {
  // 📋 State for Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 📋 API State
  const [visitData, setVisitData] = useState([]);
  const [summary, setSummary] = useState({
    total_visits: 0,
    orders_placed: 0,
    total_expenses: "₹0",
  });
  const [loading, setLoading] = useState(true);

  // ✅ Fetch API Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://test.pearl-developer.com/Inbay_Innovations/public/api/daily-Summary",
          {
            method: "GET",
            headers: {
              Authorization:
                "Bearer 333|BCmQsOpo75ZUDVnm5tGYcoilP0NfNhIY3VoLhhTi7aa88f01",
              "Content-Type": "application/json",
            },
          },
        );
        const json = await response.json();

        if (json.success) {
          // Flattening the visits data from all dates
          const allVisits = [];
          json.data.forEach((day) => {
            day.visits.forEach((v) => {
              allVisits.push({
                salesRepEmail: v.user_details.email,
                salesRep: v.user_details.name,
                agenda: v.outcomes.remark || "N/A",
                customerCode: "N/A",
                customer: v.customer_details.customer,
                phone: v.customer_details.mobile,
                department: v.user_details.team || "N/A",
                contactPerson: v.customer_details.contact,
                address: v.customer_details.address,
                city: v.customer_details.address.split(" ").pop(), // Example logic
                state: v.user_details.state,
                order: `₹${v.outcomes.order}`,
                expense: `₹${v.outcomes.expense}`,
                route: "N/A",
                actualVisitDate: day.date,
                actualVisitStartTime: v.schedule_and_time.actual,
                actualVisitEndTime: v.schedule_and_time.actual_out,
                scheduleVisitDate: day.date,
                scheduleVisitStartTime: v.schedule_and_time.scheduled,
                scheduleVisitEndTime: "N/A",
                remark: v.outcomes.remark,
                location: v.location.checkin_address,
                visitDistance: "N/A",
                durationTime: v.schedule_and_time.duration,
              });
            });
          });

          setVisitData(allVisits);
          setSummary({
            total_visits: json.summary.total_visits,
            orders_placed: json.summary.orders_placed,
            total_expenses: json.summary.total_expenses,
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Logic for Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = visitData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(visitData.length / itemsPerPage);

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

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="p-4 md:p-8 bg-gray-50 h-screen overflow-hidden flex flex-col font-sans">
      {/* 1. TOP TITLE SECTION - FIXED */}
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

      {/* 3. SCROLLABLE AREA (Stats + Visit Cards) */}
      <div className="flex-1 overflow-y-auto space-y-8 pr-2 custom-scrollbar pb-10">
        {/* STATS CARDS - NOW INSIDE SCROLL */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <p className="text-sm font-bold text-gray-500 mb-1">
                Total Visits
              </p>
              <p className="text-3xl font-black text-gray-900">
                {summary.total_visits}
              </p>
            </div>
          </div>

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
              <p className="text-3xl font-black text-gray-900">
                {summary.orders_placed}
              </p>
            </div>
          </div>

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
              <p className="text-3xl font-black text-gray-900">
                {summary.total_expenses}
              </p>
            </div>
          </div>
        </div>

        {/* VISIT CARDS LIST */}
        <div className="space-y-4">
          {currentData.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-4 items-center">
                  <div className="w-14 h-14 rounded-full bg-[#8b2cf5] text-white flex items-center justify-center text-xl font-bold shadow-sm">
                    {item.salesRep.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {item.salesRep}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                      <span className="flex items-center gap-1.5">
                        {item.salesRepEmail}
                      </span>
                      <span className="flex items-center gap-1.5">
                        {item.route}
                      </span>
                    </div>
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
                <div className="flex flex-col items-end gap-2">
                  <div className="px-3 py-1 rounded-full border border-green-200 bg-green-50 text-green-700 flex items-center gap-1.5 text-xs font-bold">
                    Visited
                  </div>
                  <div className="text-xs text-gray-400">
                    {item.actualVisitDate || item.scheduleVisitDate}
                  </div>
                </div>
              </div>

              {/* Grid details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/50 flex flex-col justify-between">
                  <h4 className="text-[11px] font-bold text-[#8b2cf5] mb-3 uppercase tracking-wider">
                    Customer Details
                  </h4>
                  <div className="space-y-2.5 text-sm text-gray-800">
                    <div className="flex justify-between">
                      <span>Customer</span>
                      <span className="font-semibold">{item.customer}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Contact</span>
                      <span className="font-semibold">
                        {item.contactPerson}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-100">
                      <span>Address</span>
                      <span className="truncate w-32 text-right">
                        {item.address}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/50 flex flex-col justify-between">
                  <h4 className="text-[11px] font-bold text-[#8b2cf5] mb-3 uppercase tracking-wider">
                    Schedule & Time
                  </h4>
                  <div className="space-y-2.5 text-sm text-gray-800">
                    <div className="flex justify-between">
                      <span>Scheduled</span>
                      <span className="font-semibold">
                        {item.scheduleVisitStartTime}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Actual</span>
                      <span className="font-semibold">
                        {item.actualVisitStartTime}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-100">
                      <span>Duration</span>
                      <span className="bg-purple-100 text-[#8b2cf5] px-2 py-0.5 rounded font-bold">
                        {item.durationTime}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/50 flex flex-col justify-between">
                  <h4 className="text-[11px] font-bold text-[#8b2cf5] mb-3 uppercase tracking-wider">
                    Outcomes
                  </h4>
                  <div className="space-y-2.5 text-sm text-gray-800">
                    <div className="flex justify-between">
                      <span>Order</span>
                      <span className="text-green-600 font-semibold">
                        {item.order}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Expense</span>
                      <span className="text-red-500 font-semibold">
                        {item.expense}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-100">
                      <span>Remark</span>
                      <span className="truncate w-32 text-right">
                        {item.remark}
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

export default Visit;
