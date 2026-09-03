import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { fetchReport } from "./dailyReportApis";
import ReportFilters from "./DailyReportFilters";
import { CustomDatePopup, MonthlyFilterPopup } from "./Modals";

const ITEMS_PER_PAGE = 5;
const PAGE_WINDOW = 5;

// One place for every localStorage key instead of ~10 separate effects.
const STORAGE_KEYS = {
  employeeSearch: "employeeSearch",
  selectedEmployees: "selectedEmployees",
  reportType: "reportType",
  customStartDate: "customStartDate",
  customEndDate: "customEndDate",
  selectedMonth: "selectedMonth",
  selectedYear: "selectedYear",
};

const readStored = (key, fallback) => {
  const val = localStorage.getItem(key);
  return val === null || val === undefined ? fallback : val;
};

const Dailyreports = () => {
  const navigate = useNavigate();
  const today = new Date();

  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState({
    total_employees: 0,
    total_present: 0,
    total_absent: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [rawResponse, setRawResponse] = useState(null);

  const [showCustomPopup, setShowCustomPopup] = useState(false);
  const [showMonthlyPopup, setShowMonthlyPopup] = useState(false);

  const dropDownRef = useRef(null);

  const [employeeSearch, setEmployeeSearch] = useState(() =>
    readStored(STORAGE_KEYS.employeeSearch, ""),
  );
  const [selectedEmployees, setSelectedEmployees] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.selectedEmployees);
    return saved ? JSON.parse(saved) : [];
  });
  const [reportType, setReportType] = useState(() =>
    readStored(STORAGE_KEYS.reportType, "monthly"),
  );
  const [customStartDate, setCustomStartDate] = useState(() =>
    readStored(STORAGE_KEYS.customStartDate, ""),
  );
  const [customEndDate, setCustomEndDate] = useState(() =>
    readStored(STORAGE_KEYS.customEndDate, ""),
  );
  const [selectedMonth, setSelectedMonth] = useState(() =>
    Number(readStored(STORAGE_KEYS.selectedMonth, today.getMonth() + 1)),
  );
  const [selectedYear, setSelectedYear] = useState(() =>
    Number(readStored(STORAGE_KEYS.selectedYear, today.getFullYear())),
  );

  // ---- persist filters ----
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.employeeSearch, employeeSearch);
  }, [employeeSearch]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.selectedEmployees,
      JSON.stringify(selectedEmployees),
    );
  }, [selectedEmployees]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.customStartDate, customStartDate);
  }, [customStartDate]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.customEndDate, customEndDate);
  }, [customEndDate]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.selectedMonth, selectedMonth);
  }, [selectedMonth]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.selectedYear, selectedYear);
  }, [selectedYear]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.reportType, reportType);
  }, [reportType]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropDownRef.current && !dropDownRef.current.contains(e.target)) {
        setShowEmployeeDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  // ---- fetch data whenever the active filter set changes ----
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    Promise.resolve(
      fetchReport(
        reportType,
        null, // no daily filter anymore
        selectedMonth,
        selectedYear,
        customStartDate,
        customEndDate,
        null, // no weekly filter anymore
        null,
        setRawResponse,
        setData,
        setSummary,
      ),
    ).finally(() => {
      if (isMounted) setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [reportType, selectedMonth, selectedYear, customStartDate, customEndDate]);

  const uniqueEmployees = useMemo(() => {
    const seen = new Set();
    const unique = [];
    data.forEach((emp) => {
      if (!seen.has(emp.name)) {
        seen.add(emp.name);
        unique.push(emp.name);
      }
    });
    return unique;
  }, [data]);

  const handleEmployeeSelect = (employeeName) => {
    setSelectedEmployees((prev) =>
      prev.includes(employeeName)
        ? prev.filter((item) => item !== employeeName)
        : [...prev, employeeName],
    );
    setCurrentPage(1);
  };

  const handleSelectAllEmployees = () => {
    setSelectedEmployees(
      selectedEmployees.length === uniqueEmployees.length
        ? []
        : uniqueEmployees,
    );
    setCurrentPage(1);
  };

  const filteredEmployeeOptions = uniqueEmployees.filter((name) =>
    name.toLowerCase().includes(employeeSearch.toLowerCase()),
  );

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      if (selectedEmployees.length === 0) return true;
      return selectedEmployees.includes(item.name);
    });
  }, [data, selectedEmployees]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE) || 1;
  const currentData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [
    reportType,
    selectedMonth,
    selectedYear,
    customStartDate,
    customEndDate,
    selectedEmployees,
  ]);

  const handleResetFilters = () => {
    setEmployeeSearch("");
    setSelectedEmployees([]);
    setReportType("monthly");
    setSelectedMonth(today.getMonth() + 1);
    setSelectedYear(today.getFullYear());
    setCustomStartDate("");
    setCustomEndDate("");
    setCurrentPage(1);

    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
  };

  // ---- CSV export ----
  const handleExport = () => {
  if (!rawResponse?.data?.length) return;

  const headers = [
    "Date",
    "Day",
    "Employee Name",
    "Employee Email",
    "Mobile Number",
    "Designation",
    "Reporting To",
    "HQ",
    "Status",
    "Check In",
    "Check Out",
    "Total Hours",
    "Start Km (odometer)",
    "End Km (odometer)",
    "Total KM (odometer)",
    "GPS KM",
    "Start Location",
    "End Location",
    "Field Visit",
    "Visit Schedule",
    "Visit Complete",
    "Morning Remark",
    "Evening Remark",
  ];

  const escapeCSV = (value) =>
    `"${String(value ?? "-").replace(/"/g, '""')}"`;

  const rows = [];

  rawResponse.data.forEach((dayData) => {
    dayData?.employees
      ?.filter(
        (emp) =>
          selectedEmployees.length === 0 ||
          selectedEmployees.includes(emp.name),
      )
      .forEach((emp) => {
        const timeTracking = emp?.time_tracking || {};
        const travelDetails = emp?.travel_details || {};
        const visitDetails = emp?.visit_details || {};
        const remarks = emp?.remarks || {};

        rows.push([
          emp?.date || dayData?.date || "-",
          emp?.day || dayData?.day || "-",
          emp?.name || "-",
          emp?.email || "-",
          emp?.mobile_number || "-",
          emp?.designation || "-",
          emp?.reporting_to || "-",
          emp?.hq || "-",
          emp?.status || (emp?.present ? "Present" : "Absent"),
          timeTracking?.check_in || "-",
          timeTracking?.check_out || "-",
          timeTracking?.total_hours || "-",
          travelDetails?.starting_km || "-",
          travelDetails?.end_km || "-",
          travelDetails?.total_km || "-",
          travelDetails?.gps_km || travelDetails?.gps_distance || "-",
          travelDetails?.start_location || "-",
          travelDetails?.end_location || "-",
          visitDetails?.field_visit || "-",
          visitDetails?.visit_schedule || "-",
          visitDetails?.visit_complete || "-",
          remarks?.morning || "-",
          remarks?.evening || "-",
        ]);
      });
  });

  if (!rows.length) {
    alert("No matching records to export for the current filters!");
    return;
  }

  const csvContent = [
    headers.map(escapeCSV).join(","),
    ...rows.map((row) => row.map(escapeCSV).join(",")),
  ].join("\n");

  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.setAttribute("download", "daily-report.csv");

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
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

      {/* 1. TOP TITLE SECTION */}
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
          disabled={isLoading}
          className="bg-[#8b2cf5] text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-[#7a26d9] active:scale-95 flex items-center gap-2 transition-all duration-150 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* 2. SEARCH & FILTER SECTION */}
      <ReportFilters
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
        dropDownRef={dropDownRef}
        handleResetFilters={handleResetFilters}
      />

      {/* 3. SCROLLABLE AREA */}
      <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar pb-10">
        {/* STATS CARDS SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            label="Total Employees"
            value={summary.total_employees}
            isLoading={isLoading}
            iconBg="bg-purple-50"
            iconColor="text-[#8b2cf5]"
            icon={
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
            }
          />
          <StatCard
            label="Total Present"
            value={summary.total_present}
            isLoading={isLoading}
            iconBg="bg-green-50"
            iconColor="text-green-600"
            icon={
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
            }
          />
          <StatCard
            label="Total Absent"
            value={summary.total_absent}
            isLoading={isLoading}
            iconBg="bg-red-50"
            iconColor="text-red-500"
            icon={
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
            }
          />
        </div>

        {/* EMPLOYEE CARDS LIST */}
        <div className="space-y-4">
          {isLoading ? (
            <LoadingState />
          ) : currentData.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm fade-in">
              <p className="text-gray-500 text-lg font-medium">
                No records found matching your criteria.
              </p>
              <button
                onClick={handleResetFilters}
                className="text-purple-600 mt-2 hover:underline"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            currentData.map((item, index) => (
              <ReportCard
                key={index}
                item={item}
                index={index}
                renderImageLink={renderImageLink}
              />
            ))
          )}
        </div>
      </div>

      {/* 4. PAGINATION (matches Attendance page styling) */}
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
              {
                length: Math.min(
                  PAGE_WINDOW,
                  totalPages -
                    Math.floor((currentPage - 1) / PAGE_WINDOW) * PAGE_WINDOW,
                ),
              },
              (_, i) => {
                const page =
                  Math.floor((currentPage - 1) / PAGE_WINDOW) * PAGE_WINDOW +
                  i +
                  1;
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
              },
            )}
          </div>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
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
    <div
      className={`w-14 h-14 ${iconBg} rounded-2xl flex items-center justify-center ${iconColor}`}
    >
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
    <p className="text-gray-500 text-sm font-medium">Loading reports…</p>
  </div>
);

const ReportCard = ({ item, index, renderImageLink }) => (
  <div
    className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 fade-in-up hover:shadow-md transition-shadow duration-200"
    style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
  >
    <div className="flex justify-between items-start mb-6">
      <div className="flex gap-4 items-center">
        <div className="w-14 h-14 rounded-full bg-[#8b2cf5] text-white flex items-center justify-center text-xl font-bold shadow-sm">
          {item.name.charAt(0)}
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
          <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
            <span className="flex items-center gap-1.5">
              {item.designation}
            </span>
            <span className="flex items-center gap-1.5">{item.location}</span>
          </div>
          <div className="flex gap-2 mt-2.5">
            <span className="bg-purple-50 text-[#8b2cf5] text-[11px] px-2.5 py-1 rounded-md font-semibold tracking-wide">
              {item.team}
            </span>
            <span className="bg-purple-50 text-[#8b2cf5] text-[11px] px-2.5 py-1 rounded-md font-semibold tracking-wide">
              {item.state}
            </span>
            <span className="bg-gray-100 text-gray-600 text-[11px] px-2.5 py-1 rounded-md font-semibold tracking-wide border border-gray-200">
              Reporting: {item.reporting_to}
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <div
          className={`px-3 py-1 rounded-full border text-xs font-bold flex items-center gap-1.5 ${
            item.status.toLowerCase() === "present"
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          {item.status}
        </div>
        <div className="text-xs text-gray-400">
          {item.date} ({item.day})
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/50">
        <h4 className="text-[11px] font-bold text-[#8b2cf5] mb-3 uppercase tracking-wider">
          Time & Visits
        </h4>
        <div className="space-y-2.5 text-sm text-gray-800">
          <div className="flex justify-between">
            <span>Scheduled Time</span>
            <span className="font-semibold">
              {item.time_tracking?.scheduled}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Visits</span>
            <span className="font-semibold">
              {item.time_tracking?.visits_done} /{" "}
              {item.time_tracking?.visits_total}
            </span>
          </div>
          <div className="flex justify-between pt-2 border-t border-gray-100">
            <span>Total Hours</span>
            <span className="bg-purple-100 text-[#8b2cf5] px-2 py-0.5 rounded font-bold">
              {item.time_tracking?.total_hours}
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
            <span className="font-semibold">{item.travel_details.route}</span>
          </div>
          <div className="flex justify-between">
            <span>Odometer</span>
            <span className="font-semibold">
              {item.travel_details.odometer}
            </span>
          </div>
          <div className="flex justify-between pt-2 border-t border-gray-100">
            <span>Distance</span>
            <span className="font-bold">
              {item.travel_details.total_distance}{" "}
              {item.travel_details.gps_distance}
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
            <span className="font-semibold">{item.remarks.morning}</span>
          </div>
          <div className="flex justify-between">
            <span>Evening</span>
            <span className="font-semibold">{item.remarks.evening}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-gray-100">
            <span>General</span>
            <span className="font-semibold truncate w-24">
              {item.remarks.general}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mt-4">
      <h4 className="text-xs font-bold text-purple-600 uppercase mb-3">
        Attendance Images
      </h4>
      <div className="space-y-2 text-sm">
        <div>
          {renderImageLink(
            item.attendance_images?.selfie_photo_in,
            "Selfie IN",
          )}
        </div>
        <div>
          {renderImageLink(
            item.attendance_images?.selfie_photo_out,
            "Selfie OUT",
          )}
        </div>
        <div>
          {renderImageLink(
            item.attendance_images?.speedometer_photo_in,
            "Speedometer IN",
          )}
        </div>
        <div>
          {renderImageLink(
            item.attendance_images?.speedometer_photo_out,
            "Speedometer OUT",
          )}
        </div>
        <div>
          {renderImageLink(
            item.attendance_images?.signature_out,
            "Signature OUT",
          )}
        </div>
      </div>
    </div>
  </div>
);

export default Dailyreports;
