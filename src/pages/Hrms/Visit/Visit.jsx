import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { fetchVisitSummary } from "./visitApis";
import { CustomDatePopup, MonthlyFilterPopup } from "./Modals";
import VisitFilters from "./VisitFilters";

const ITEMS_PER_PAGE = 5;
const PAGE_WINDOW = 5;

const Visit = () => {
  const navigate = useNavigate();
  const today = new Date();

  // dropdown + select filter
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [reportType, setReportType] = useState("monthly");

  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  const [showCustomPopup, setShowCustomPopup] = useState(false);
  const [showMonthlyPopup, setShowMonthlyPopup] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowEmployeeDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

  // ======================
  // API STATE
  // ======================

  const [visitData, setVisitData] = useState([]);
  const [summary, setSummary] = useState({
    total_visits: 0,
    orders_placed: 0,
    total_expenses: "₹0",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [rawResponse, setRawResponse] = useState(null);

  // ======================
  // FETCH DATA
  // ======================

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    Promise.resolve(
      fetchVisitSummary(
        reportType,
        null, // no daily filter anymore
        selectedMonth,
        selectedYear,
        null, // no weekly filter anymore
        null,
        customStartDate,
        customEndDate,
        setVisitData,
        setSummary,
        setRawResponse,
        () => {} // loading now handled locally below
      )
    ).finally(() => {
      if (isMounted) setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [reportType, selectedMonth, selectedYear, customStartDate, customEndDate]);

  const renderImageLink = (url, label) => {
    if (!url) return <span className="text-gray-400">{label}</span>;

    return (
      <button
        onClick={() => navigate("/image-viewer", { state: { url } })}
        className="text-purple-600 hover:underline font-medium transition-colors hover:text-purple-800"
      >
        {label}
      </button>
    );
  };

  const filteredData = useMemo(() => {
    return visitData.filter((item) => {
      return (
        selectedEmployees.length === 0 ||
        selectedEmployees.includes(item.salesRep)
      );
    });
  }, [visitData, selectedEmployees]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE) || 1;
  const currentData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const uniqueEmployees = useMemo(
    () => [...new Set(visitData.map((item) => item.salesRep))],
    [visitData]
  );

  const filteredEmployeeOptions = uniqueEmployees.filter((name) =>
    name.toLowerCase().includes(employeeSearch.toLowerCase())
  );

  const handleEmployeeSelect = (employeeName) => {
    setSelectedEmployees((prev) =>
      prev.includes(employeeName)
        ? prev.filter((item) => item !== employeeName)
        : [...prev, employeeName]
    );
    setCurrentPage(1);
  };

  const handleSelectAllEmployees = () => {
    setSelectedEmployees(
      selectedEmployees.length === uniqueEmployees.length ? [] : uniqueEmployees
    );
    setCurrentPage(1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [reportType, selectedMonth, selectedYear, customStartDate, customEndDate, selectedEmployees]);

  // ✅ Export CSV Function
  const handleExport = () => {
    if (!rawResponse?.data?.length) return;

    const headers = [
      "Date", "Day", "Visit Status", "User ID", "User Name", "User Email",
      "Team", "Designation", "State", "Customer Name", "Customer Contact",
      "Customer Address", "Customer Mobile", "Customer Email",
      "Customer Designation", "Scheduled Time", "Actual Check In",
      "Actual Check Out", "Duration", "Order", "Expense", "Remark",
      "Follow Up Date", "Follow Up Time", "Checkin Address",
      "Checkout Address", "Checkin Latitude", "Checkin Longitude",
      "Client Type", "Signature",
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
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "visit-report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 h-screen overflow-hidden flex flex-col font-sans">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes shimmer {
          0% { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        .fade-in-up { animation: fadeInUp 0.35s ease-out both; }
        .fade-in { animation: fadeIn 0.25s ease-out both; }
        .skeleton {
          background: linear-gradient(90deg, #f1f1f4 25%, #e9e9ef 37%, #f1f1f4 63%);
          background-size: 800px 100%;
          animation: shimmer 1.4s ease-in-out infinite;
        }
      `}</style>

      {/* 1. TOP TITLE SECTION - FIXED */}
      <div className="flex justify-between items-center mb-6 shrink-0 border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Visit Logs</h2>
          <p className="text-sm text-gray-500 font-medium">
            Track sales rep visits, customer details, and outcomes
          </p>
        </div>
        <button
          onClick={handleExport}
          disabled={isLoading}
          className="bg-[#8b2cf5] text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-[#7a26d9] active:scale-95 flex items-center gap-2 transition-all duration-150 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export CSV
        </button>
      </div>

      {/* 2. SEARCH & FILTER SECTION */}
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
        setShowMonthlyPopup={setShowMonthlyPopup}
        setShowCustomPopup={setShowCustomPopup}
        dropdownRef={dropdownRef}
      />

      {/* 3. SCROLLABLE AREA (Stats + Visit Cards) */}
      <div className="flex-1 overflow-y-auto space-y-8 pr-2 custom-scrollbar pb-10">
        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            label="Total Visits"
            value={summary.total_visits}
            isLoading={isLoading}
            iconBg="bg-purple-50"
            iconColor="text-[#8b2cf5]"
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
          />
          <StatCard
            label="Orders Placed"
            value={summary.orders_placed}
            isLoading={isLoading}
            iconBg="bg-green-50"
            iconColor="text-green-600"
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            label="Total Expenses"
            value={summary.total_expenses}
            isLoading={isLoading}
            iconBg="bg-red-50"
            iconColor="text-red-500"
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>

        {/* VISIT CARDS LIST */}
        <div className="space-y-4">
          {isLoading ? (
            <LoadingState />
          ) : currentData.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center fade-in">
              <p className="text-gray-500 font-medium">No employee records found</p>
            </div>
          ) : (
            currentData.map((item, index) => (
              <VisitCard
                key={index}
                item={item}
                index={index}
                renderImageLink={renderImageLink}
              />
            ))
          )}
        </div>
      </div>

      {/* 4. PAGINATION (matches Attendance / Reports pages) */}
      {!isLoading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4 pb-4 shrink-0 bg-gray-50 fade-in">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="flex items-center gap-1">
            {Array.from(
              { length: Math.min(PAGE_WINDOW, totalPages - Math.floor((currentPage - 1) / PAGE_WINDOW) * PAGE_WINDOW) },
              (_, i) => {
                const page = Math.floor((currentPage - 1) / PAGE_WINDOW) * PAGE_WINDOW + i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-all duration-150 ${
                      currentPage === page
                        ? "bg-[#8b2cf5] text-white shadow-sm scale-105"
                        : "text-gray-600 hover:bg-gray-100 bg-white border border-gray-200"
                    }`}
                  >
                    {page}
                  </button>
                );
              }
            )}
          </div>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

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
    </div>
  );
};

// ---- small presentational pieces ----

const StatCard = ({ label, value, isLoading, iconBg, iconColor, icon }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5 transition-shadow hover:shadow-md">
    <div className={`w-14 h-14 ${iconBg} rounded-2xl flex items-center justify-center ${iconColor}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm font-bold text-gray-500 mb-1">{label}</p>
      {isLoading ? (
        <div className="h-8 w-16 rounded skeleton" />
      ) : (
        <p className="text-3xl font-black text-gray-900 fade-in">{value}</p>
      )}
    </div>
  </div>
);

const LoadingState = () => (
  <div className="flex flex-col items-center justify-center gap-4 py-24 bg-white rounded-2xl border border-gray-100 shadow-sm fade-in">
    <Loader2 size={32} className="text-[#8b2cf5] animate-spin" />
    <p className="text-gray-500 text-sm font-medium">Loading visits…</p>
  </div>
);

const VisitCard = ({ item, index, renderImageLink }) => (
  <div
    className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 fade-in-up hover:shadow-md transition-shadow duration-200"
    style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
  >
    <div className="flex justify-between items-start mb-6">
      <div className="flex gap-4 items-center">
        <div className="w-14 h-14 rounded-full bg-[#8b2cf5] text-white flex items-center justify-center text-xl font-bold shadow-sm">
          {item.salesRep.charAt(0)}
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">{item.salesRep}</h3>
          <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
            <span className="flex items-center gap-1.5">{item.salesRepEmail}</span>
            <span className="flex items-center gap-1.5">{item.route}</span>
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
            <span className="font-semibold">{item.contactPerson}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-gray-100">
            <span>Address</span>
            <span className="truncate w-32 text-right">{item.address}</span>
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
            <span className="font-semibold">{item.scheduleVisitStartTime}</span>
          </div>
          <div className="flex justify-between">
            <span>Actual</span>
            <span className="font-semibold">{item.actualVisitStartTime}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-gray-100">
            <span>Duration</span>
            <span className="bg-purple-100 text-[#8b2cf5] px-2 py-0.5 rounded font-bold">
              {item.durationTime}
            </span>
          </div>
        </div>
      </div>

      <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/50 flex flex-col justify-between gap-4">
        <div>
          <h4 className="text-[11px] font-bold text-[#8b2cf5] mb-3 uppercase tracking-wider">
            Outcomes
          </h4>
          <div className="space-y-2.5 text-sm text-gray-800">
            <div className="flex justify-between">
              <span>Order</span>
              <span className="text-green-600 font-semibold">{item.order}</span>
            </div>
            <div className="flex justify-between">
              <span>Expense</span>
              <span className="text-red-500 font-semibold">{item.expense}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-100">
              <span>Remark</span>
              <span className="truncate w-32 text-right">{item.remark}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <h4 className="text-xs font-bold text-purple-600 uppercase mb-3">Images</h4>
          <div className="space-y-2 text-sm">
            <div>{renderImageLink(item.signature, "Check OUT image")}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Visit;