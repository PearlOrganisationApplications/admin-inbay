import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchVisitSummary } from "./visitApis";
import { CustomDatePopup, DailyFilterPopup, MonthlyFilterPopup, WeeklyFilterPopup } from "./Modals";
import VisitFilters from "./VisitFilters";


const Visit = () => {
  // dropdown + select filter
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const today = new Date();



  // ✅ FIX: missing states added
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());

  const [reportType, setReportType] = useState("daily");

  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  const [showCustomPopup, setShowCustomPopup] = useState(false);
  const [showMonthlyPopup, setShowMonthlyPopup] = useState(false);
  const [showDailyPopup, setShowDailyPopup] = useState(false);
  const [showWeeklyPopup, setShowWeeklyPopup] = useState(false);

  const [weeklyStartDate, setWeeklyStartDate] = useState("");
  const [weeklyEndDate, setWeeklyEndDate] = useState("");

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setShowEmployeeDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // ======================
  // HANDLERS
  // ======================

  const handleMonthlyApply = (month, year) => {
    setSelectedMonth(month);
    setSelectedYear(year);
    setReportType("monthly");
    setCurrentPage(1);
  };

  const handleCustomApply = (start, end) => {
    setCustomStartDate(start);
    setCustomEndDate(end);
    setReportType("custom");
    setCurrentPage(1);
  };

  const handleDailyApply = (day, month, year) => {
    setSelectedDay(day);
    setSelectedMonth(month);
    setSelectedYear(year);
    setReportType("daily");
    setCurrentPage(1);
  };

  const handleWeeklyApply = (endDate) => {
    const end = new Date(endDate);
    const start = new Date(end);
    start.setDate(end.getDate() - 6);

    setWeeklyEndDate(endDate);
    setWeeklyStartDate(start.toISOString().split("T")[0]);

    setReportType("weekly");
    setCurrentPage(1);
  };

  // ======================
  // API STATE
  // ======================

  const [visitData, setVisitData] = useState([]);
  const [summary, setSummary] = useState({
    total_visits: 0,
    orders_placed: 0,
    total_expenses: "₹0",
  });
  const [loading, setLoading] = useState(true);
  const [rawResponse, setRawResponse] = useState(null);


  // ======================
  // FETCH DATA
  // ======================

  useEffect(() => {
    fetchVisitSummary(
      reportType,
      selectedDay,
      selectedMonth,
      selectedYear,
      weeklyStartDate,
      weeklyEndDate,
      customStartDate,
      customEndDate,
      setVisitData,
      setSummary,
      setRawResponse,
      setLoading
    );
  }, [
    reportType,
    selectedDay,
    selectedMonth,
    selectedYear,
    weeklyStartDate,
    weeklyEndDate,
    customStartDate,
    customEndDate,
  ]);



  // Logic for Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const filteredData = visitData.filter((item) => {
    return (
      selectedEmployees.length === 0 ||
      selectedEmployees.includes(item.salesRep)
    );
  });

  const navigate = useNavigate()


  const renderImageLink = (url, label) => {
    if (!url) return <span className="text-gray-400">{label}</span>;

    return (
      <button
        onClick={() =>
          navigate("/image-viewer", {
            state: { url },
          })
        }
        className="text-purple-600 hover:underline font-medium"
      >
        {label}
      </button>
    );
  };
  const currentData = filteredData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const uniqueEmployees = [
    ...new Set(visitData.map((item) => item.salesRep))
  ];

  const filteredEmployeeOptions = uniqueEmployees.filter((name) =>
    name.toLowerCase().includes(employeeSearch.toLowerCase())
  );

  const handleEmployeeSelect = (employeeName) => {
    setSelectedEmployees((prev) => {
      if (prev.includes(employeeName)) {
        return prev.filter((item) => item !== employeeName);
      }

      return [...prev, employeeName];
    });

    setCurrentPage(1);
  };

  const handleSelectAllEmployees = () => {
    if (selectedEmployees.length === uniqueEmployees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(uniqueEmployees);
    }

    setCurrentPage(1);
  };


  const pagesPerGroup = 5;

  const startPage =
    Math.floor((currentPage - 1) / pagesPerGroup) * pagesPerGroup + 1;

  const endPage = Math.min(
    startPage + pagesPerGroup - 1,
    totalPages
  );

  // ✅ Export CSV Function

  const handleExport = () => {
    if (!rawResponse?.data?.length) return;

    const headers = [
      "Date",
      "Day",
      "Visit Status",

      "User ID",
      "User Name",
      "User Email",
      "Team",
      "Designation",
      "State",

      "Customer Name",
      "Customer Contact",
      "Customer Address",
      "Customer Mobile",
      "Customer Email",
      "Customer Designation",

      "Scheduled Time",
      "Actual Check In",
      "Actual Check Out",
      "Duration",

      "Order",
      "Expense",
      "Remark",
      "Follow Up Date",
      "Follow Up Time",

      "Checkin Address",
      "Checkout Address",
      "Checkin Latitude",
      "Checkin Longitude",

      "Client Type",
      "Signature",
    ];

    const rows = [];

    rawResponse.data.forEach((dayData) => {
      dayData.visits.forEach((visit) => {
        rows.push([
          dayData?.date || "-",
          dayData?.day || "-",

          visit?.status || "-",

          visit?.user_details?.id || "-",
          visit?.user_details?.name || "-",
          visit?.user_details?.email || "-",
          visit?.user_details?.team || "-",
          visit?.user_details?.designation || "-",
          visit?.user_details?.state || "-",

          visit?.customer_details?.customer || "-",
          visit?.customer_details?.contact || "-",
          visit?.customer_details?.address || "-",
          visit?.customer_details?.mobile || "-",
          visit?.customer_details?.email || "-",
          visit?.customer_details?.designation || "-",

          visit?.schedule_and_time?.scheduled || "-",
          visit?.schedule_and_time?.actual || "-",
          visit?.schedule_and_time?.actual_out || "-",
          visit?.schedule_and_time?.duration || "-",

          visit?.outcomes?.order || 0,
          visit?.outcomes?.expense || 0,
          visit?.outcomes?.remark || "-",
          visit?.outcomes?.follow_up_date || "-",
          visit?.outcomes?.follow_up_time || "-",

          visit?.location?.checkin_address || "-",
          visit?.location?.checkout_address || "-",
          visit?.location?.checkin_lat || "-",
          visit?.location?.checkin_lng || "-",

          visit?.client_type || "-",
          visit?.signature || "-",
        ]);
      });
    });

    const csvContent = [
      headers.join(","),

      ...rows.map((row) =>
        row
          .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "visit-report.csv");

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      <VisitFilters
        selectedEmployees={selectedEmployees}
        showEmployeeDropdown={showEmployeeDropdown}
        setShowEmployeeDropdown={setShowEmployeeDropdown}
        employeeSearch={employeeSearch}
        setEmployeeSearch={setEmployeeSearch}
        uniqueEmployees={uniqueEmployees}
        filteredEmployeeOptions={filteredEmployeeOptions}
        handleEmployeeSelect={handleEmployeeSelect}
        handleSelectAllEmployees={handleSelectAllEmployees}
        reportType={reportType}
        setShowDailyPopup={setShowDailyPopup}
        setShowWeeklyPopup={setShowWeeklyPopup}
        setShowMonthlyPopup={setShowMonthlyPopup}
        setShowCustomPopup={setShowCustomPopup}
        dropdownRef={dropdownRef}
      />

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
          {currentData.length === 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
              <p className="text-gray-500 font-medium">
                No employee records found
              </p>
            </div>
          )}
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
                  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <h4 className="text-xs font-bold text-purple-600 uppercase mb-3">
                      Images
                    </h4>

                    <div className="space-y-2 text-sm">
                      <div>
                        {renderImageLink(item.signature, "Check OUT image")}
                      </div>
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

        {/* Prev */}

        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-md border bg-white text-sm disabled:opacity-50"
        >
          Prev
        </button>

        {/* Page Numbers */}

        {Array.from(
          { length: endPage - startPage + 1 },
          (_, i) => {
            const page = startPage + i;

            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded-md text-sm ${currentPage === page
                  ? "bg-[#8b2cf5] text-white"
                  : "bg-white border"
                  }`}
              >
                {page}
              </button>
            );
          }
        )}

        {/* Next */}

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-md border bg-white text-sm disabled:opacity-50"
        >
          Next
        </button>

      </div>

      <CustomDatePopup
        open={showCustomPopup}
        onClose={() => setShowCustomPopup(false)}
        onApply={handleCustomApply}
      />
      <MonthlyFilterPopup
        open={showMonthlyPopup}
        onClose={() => setShowMonthlyPopup(false)}
        onApply={handleMonthlyApply}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
      />
      <DailyFilterPopup
        open={showDailyPopup}
        onClose={() => setShowDailyPopup(false)}
        onApply={handleDailyApply}
        selectedDay={selectedDay}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
      />
      <WeeklyFilterPopup
        open={showWeeklyPopup}
        onClose={() => setShowWeeklyPopup(false)}
        onApply={handleWeeklyApply}
        selectedEndDate={weeklyEndDate}
      />
    </div>
  );
};

export default Visit;
