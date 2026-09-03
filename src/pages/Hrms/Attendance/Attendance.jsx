import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  CheckCircle,
  XCircle,
  Download,
  MapPin,
  Mail,
  Clock,
  Car,
  MessageSquare,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Users,
  UserCheck,
  UserX,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchAttendance } from "./attendanceApis";
import AttendanceFilters from "./AttendanceFilters";
import { CustomDatePopup, MonthlyFilterPopup } from "./Modals";

const ITEMS_PER_PAGE = 10;

// Keys kept in one object so localStorage read/write stays in one place
// instead of ~10 separate effects.
const STORAGE_KEYS = {
  employeeSearch: "attendanceEmployeeSearch",
  selectedEmployees: "attendanceSelectedEmployees",
  shiftFilter: "attendanceShiftFilter",
  month: "attendanceMonth",
  year: "attendanceYear",
  activeTab: "attendanceActiveTab",
  customStartDate: "attendanceCustomStartDate",
  customEndDate: "attendanceCustomEndDate",
};

const readStored = (key, fallback) => {
  const val = localStorage.getItem(key);
  return val === null || val === undefined ? fallback : val;
};

const Attendance = () => {
  const navigate = useNavigate();
  const today = new Date();

  const [data, setData] = useState([]);
  const [rawResponse, setRawResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [showMonthlyPopup, setShowMonthlyPopup] = useState(false);
  const [showCustomPopup, setShowCustomPopup] = useState(false);

  const [employeeSearch, setEmployeeSearch] = useState(() =>
    readStored(STORAGE_KEYS.employeeSearch, ""),
  );
  const [selectedEmployees, setSelectedEmployees] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.selectedEmployees);
    return saved ? JSON.parse(saved) : [];
  });
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);

  const [shiftFilter, setShiftFilter] = useState(() =>
    readStored(STORAGE_KEYS.shiftFilter, ""),
  );

  const [month, setMonth] = useState(() =>
    Number(readStored(STORAGE_KEYS.month, today.getMonth() + 1)),
  );
  const [year, setYear] = useState(() =>
    Number(readStored(STORAGE_KEYS.year, today.getFullYear())),
  );
  const [activeTab, setActiveTab] = useState(() =>
    readStored(STORAGE_KEYS.activeTab, "monthly"),
  );
  const [customStartDate, setCustomStartDate] = useState(() =>
    readStored(STORAGE_KEYS.customStartDate, ""),
  );
  const [customEndDate, setCustomEndDate] = useState(() =>
    readStored(STORAGE_KEYS.customEndDate, ""),
  );

  const [summary, setSummary] = useState({
    total_employees: 0,
    total_present: 0,
    total_absent: 0,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const dropdownRef = useRef(null);

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
    localStorage.setItem(STORAGE_KEYS.shiftFilter, shiftFilter);
  }, [shiftFilter]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.month, month);
  }, [month]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.year, year);
  }, [year]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.activeTab, activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.customStartDate, customStartDate);
  }, [customStartDate]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.customEndDate, customEndDate);
  }, [customEndDate]);

  const resetFilters = () => {
    setEmployeeSearch("");
    setSelectedEmployees([]);
    setShiftFilter("");
    setMonth(today.getMonth() + 1);
    setYear(today.getFullYear());
    setActiveTab("monthly");
    setCustomStartDate("");
    setCustomEndDate("");

    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
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
      fetchAttendance(
        activeTab,
        null, // no daily filter anymore
        month,
        year,
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
  }, [activeTab, month, year, customStartDate, customEndDate]);

  // ---- derived data ----
  const uniqueShifts = useMemo(() => {
    const shifts = data.map(
      (item) => `${item.scheduledStart} - ${item.scheduledEnd}`,
    );
    return [...new Set(shifts)];
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesEmployee =
        selectedEmployees.length === 0 || selectedEmployees.includes(item.name);

      const itemShift = `${item.scheduledStart} - ${item.scheduledEnd}`;
      const matchesShift = shiftFilter === "" || itemShift === shiftFilter;

      return matchesEmployee && matchesShift;
    });
  }, [data, selectedEmployees, shiftFilter]);

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

  const filteredEmployeeOptions = uniqueEmployees.filter((name) =>
    name.toLowerCase().includes(employeeSearch.toLowerCase()),
  );

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

  useEffect(() => {
    setCurrentPage(1);
  }, [
    activeTab,
    month,
    year,
    customStartDate,
    customEndDate,
    shiftFilter,
    selectedEmployees,
  ]);

  const totalEmployees = summary.total_employees;
  const totalPresent = summary.total_present;
  const totalAbsent = summary.total_absent;

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE) || 1;
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleShiftFilter = (e) => {
    setShiftFilter(e.target.value);
    setCurrentPage(1);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowEmployeeDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMonthlyApply = (selectedMonth, selectedYear) => {
    setMonth(selectedMonth);
    setYear(selectedYear);
    setActiveTab("monthly");
    setCurrentPage(1);
  };

  const handleCustomApply = (startDate, endDate) => {
    setCustomStartDate(startDate);
    setCustomEndDate(endDate);
    setActiveTab("custom");
    setCurrentPage(1);
  };

  // ---- CSV export ----
const handleExport = () => {
  const exportData = rawResponse?.data
    ? rawResponse.data
    : rawResponse?.employees
      ? [
          {
            date: rawResponse.date,
            day: rawResponse.day,
            summary: rawResponse.summary,
            employees: rawResponse.employees,
            absent_users: rawResponse.absent_users || [],
          },
        ]
      : [];

  if (!exportData.length) {
    return alert("No data to export!");
  }

  const headers = [
    "Date",
    "Day",
    "Name",
    "Email",
    "Mobile Number",
    "Designation",
    "Reporting To",
    "HQ",
    "Status",
    "Scheduled Timing",
    "Check In",
    "Check Out",
    "Total Hours",
    "Start Location",
    "End Location",
    "GPS KM",
    "Morning Remark",
    "Evening Remark",
    "Selfie IN",
    "Selfie OUT",
    "Speedometer IN",
    "Speedometer OUT",
  ];

  const escapeCSV = (value) => {
    if (value === null || value === undefined) {
      return "";
    }

    return `"${String(value).replace(/"/g, '""')}"`;
  };

  const rows = [];

  exportData.forEach((dayData) => {
    const presentAndLateEmployees = dayData.employees || [];
    const absentEmployees = dayData.absent_users || [];

    const allEmployees = [
      ...presentAndLateEmployees,
      ...absentEmployees,
    ];

    allEmployees
      .filter((emp) => {
        const matchesEmployee =
          selectedEmployees.length === 0 ||
          selectedEmployees.includes(emp.name);

        const empShift =
          emp.time_tracking?.scheduled || "";

        const matchesShift =
          shiftFilter === "" ||
          empShift === shiftFilter ||
          emp.attendance_status === "absent";

        return matchesEmployee && matchesShift;
      })
      .forEach((emp) => {
        const images = emp.attendance_images || {};
        const remarks = emp.remarks || {};
        const tracking = emp.time_tracking || {};
        const travel = emp.travel_details || {};

        let status = emp.attendance_status || "";

        if (status === "present") {
          status = "Present";
        } else if (status === "late") {
          status = "Late";
        } else if (status === "absent") {
          status = "Absent";
        } else {
          status =
            emp.status ||
            (emp.present ? "Present" : "Absent");
        }

        rows.push(
          [
            emp.date || dayData.date || "",
            emp.day || dayData.day || "",
            emp.name || "",
            emp.email || "",
            emp.mobile_number || "",
            emp.designation || "",
            emp.reporting_to || "",
            emp.hq || "",
            status,
            tracking.scheduled || "",
            tracking.check_in || "",
            tracking.check_out || "",
            tracking.total_hours || "",
            travel.start_location || "",
            travel.end_location || "",
            travel.gps_km || "",
            remarks.morning || "",
            remarks.evening || "",
            images.selfie_photo_in || "",
            images.selfie_photo_out || "",
            images.speedometer_photo_in || "",
            images.speedometer_photo_out || "",
          ]
            .map(escapeCSV)
            .join(","),
        );
      });
  });

  if (!rows.length) {
    return alert(
      "No matching records to export for the current filters!",
    );
  }

  const csvContent = [
    headers.map(escapeCSV).join(","),
    ...rows,
  ].join("\n");

  const blob = new Blob(
    ["\uFEFF" + csvContent],
    {
      type: "text/csv;charset=utf-8;",
    },
  );

  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `attendance_report_${Date.now()}.csv`;

  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);

  window.URL.revokeObjectURL(url);
};

  return (
    <div className="bg-gray-50 h-screen flex flex-col font-sans">
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
        .fade-in-up {
          animation: fadeInUp 0.35s ease-out both;
        }
        .fade-in {
          animation: fadeIn 0.25s ease-out both;
        }
        .skeleton {
          background: linear-gradient(90deg, #f1f1f4 25%, #e9e9ef 37%, #f1f1f4 63%);
          background-size: 800px 100%;
          animation: shimmer 1.4s ease-in-out infinite;
        }
      `}</style>

      {/* TOP HEADER */}
      <div className="bg-white px-6 py-4 shadow-sm border-b border-gray-200 flex justify-between items-center z-10 flex-shrink-0">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-800">
            Attendance Logs
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage and track employee attendance
          </p>
        </div>

        <button
          onClick={handleExport}
          disabled={isLoading}
          className="bg-purple-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-purple-700 active:scale-95 transition-all duration-150 shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {/* TOOLBAR: SEARCH & FILTERS */}
      <AttendanceFilters
        employeeSearch={employeeSearch}
        setEmployeeSearch={setEmployeeSearch}
        selectedEmployees={selectedEmployees}
        setSelectedEmployees={setSelectedEmployees}
        showEmployeeDropdown={showEmployeeDropdown}
        setShowEmployeeDropdown={setShowEmployeeDropdown}
        uniqueEmployees={uniqueEmployees}
        filteredEmployeeOptions={filteredEmployeeOptions}
        handleEmployeeSelect={handleEmployeeSelect}
        handleSelectAllEmployees={handleSelectAllEmployees}
        shiftFilter={shiftFilter}
        uniqueShifts={uniqueShifts}
        handleShiftFilter={handleShiftFilter}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        month={month}
        setMonth={setMonth}
        year={year}
        setYear={setYear}
        dropdownRef={dropdownRef}
        resetFilters={resetFilters}
        setShowMonthlyPopup={setShowMonthlyPopup}
        setShowCustomPopup={setShowCustomPopup}
      />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          {/* SUMMARY CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <SummaryCard
              icon={<Users size={24} />}
              iconBg="bg-purple-50"
              iconColor="text-purple-600"
              label="Total Employees"
              value={totalEmployees}
              isLoading={isLoading}
            />
            <SummaryCard
              icon={<UserCheck size={24} />}
              iconBg="bg-green-50"
              iconColor="text-green-600"
              label="Total Present"
              value={totalPresent}
              isLoading={isLoading}
            />
            <SummaryCard
              icon={<UserX size={24} />}
              iconBg="bg-red-50"
              iconColor="text-red-600"
              label="Total Absent"
              value={totalAbsent}
              isLoading={isLoading}
            />
          </div>

          {/* EMPLOYEE CARDS LIST */}
          <div className="space-y-5">
            {isLoading ? (
              <LoadingState />
            ) : paginatedData.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm fade-in">
                <p className="text-gray-500 text-lg font-medium">
                  No records found matching your criteria.
                </p>
                <button
                  onClick={() => setShiftFilter("")}
                  className="text-purple-600 mt-2 hover:underline"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              paginatedData.map((item, index) => (
                <AttendanceCard
                  key={item.id}
                  item={item}
                  index={index}
                  renderImageLink={renderImageLink}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* PAGINATION FOOTER */}
      {!isLoading && totalPages > 1 && (
        <div className="bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0 z-10 fade-in">
          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-medium text-gray-900">
              {(currentPage - 1) * ITEMS_PER_PAGE + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium text-gray-900">
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)}
            </span>{" "}
            of{" "}
            <span className="font-medium text-gray-900">
              {filteredData.length}
            </span>{" "}
            results
          </p>

          <div className="flex items-center gap-2">
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
                    5,
                    totalPages - Math.floor((currentPage - 1) / 5) * 5,
                  ),
                },
                (_, i) => {
                  const page = Math.floor((currentPage - 1) / 5) * 5 + i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-all duration-150 ${
                        currentPage === page
                          ? "bg-purple-600 text-white shadow-sm scale-105"
                          : "text-gray-600 hover:bg-gray-100"
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
        </div>
      )}

      <MonthlyFilterPopup
        open={showMonthlyPopup}
        onClose={() => setShowMonthlyPopup(false)}
        onApply={handleMonthlyApply}
        selectedMonth={month}
        selectedYear={year}
      />

      <CustomDatePopup
        open={showCustomPopup}
        onClose={() => setShowCustomPopup(false)}
        onApply={handleCustomApply}
      />
    </div>
  );
};

// ---- small presentational pieces ----

const SummaryCard = ({ icon, iconBg, iconColor, label, value, isLoading }) => (
  <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4 transition-shadow hover:shadow-md">
    <div
      className={`w-12 h-12 rounded-full ${iconBg} flex items-center justify-center ${iconColor} transition-transform duration-200`}
    >
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      {isLoading ? (
        <div className="h-7 w-14 rounded skeleton mt-1" />
      ) : (
        <h3 className="text-2xl font-extrabold text-gray-900 fade-in">
          {value}
        </h3>
      )}
    </div>
  </div>
);

const LoadingState = () => (
  <div className="flex flex-col items-center justify-center gap-4 py-24 bg-white rounded-2xl border border-gray-100 shadow-sm fade-in">
    <Loader2 size={32} className="text-purple-600 animate-spin" />
    <p className="text-gray-500 text-sm font-medium">
      Loading attendance records…
    </p>
  </div>
);

const AttendanceCard = ({ item, index, renderImageLink }) => {
  const isPresent = item.attendance.toLowerCase() === "present";

  return (
    <div
      className="bg-white rounded-2xl shadow-sm border border-purple-100 hover:shadow-md transition-shadow duration-200 overflow-hidden fade-in-up"
      style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
    >
      {/* TOP PROFILE SECTION */}
      <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 flex-shrink-0 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-bold text-xl shadow-sm">
            {item.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
            <div className="text-sm text-gray-500 flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
              <span className="flex items-center gap-1">
                <Mail size={14} className="text-purple-500" /> {item.email}
              </span>
              <span className="flex items-center gap-1">
                <MapPin size={14} className="text-purple-500" /> {item.location}
              </span>
            </div>
            <div className="mt-2 inline-flex items-center gap-2 text-xs font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-100">
              {item.department} <span className="text-purple-300">•</span> Group{" "}
              {item.group}
            </div>
          </div>
        </div>

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
            <Calendar size={13} /> {item.date} ({item.day})
          </span>
        </div>
      </div>

      {/* BOTTOM DETAILS GRID */}
      <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50/50">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <h4 className="text-xs font-bold text-purple-600 uppercase mb-3 flex items-center gap-2">
            <Clock size={14} /> Time Tracking
          </h4>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Scheduled</span>
              <span className="font-medium text-gray-800">
                {item.scheduledStart} - {item.scheduledEnd}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Actual</span>
              <span className="font-medium text-gray-800">
                {item.actualStart} - {item.actualEnd}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2.5 border-t border-gray-100">
              <span className="text-gray-500">Total Hours</span>
              <span className="font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
                {item.totalHours}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <h4 className="text-xs font-bold text-purple-600 uppercase mb-3 flex items-center gap-2">
            <Car size={14} /> Travel Details
          </h4>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">End Location</span>
              <span className="font-medium text-gray-800">
                {item.endLocation}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Odometer</span>
              <span className="font-medium text-gray-800">
                {item.morningOdo} → {item.eveningOdo}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2.5 border-t border-gray-100">
              <span className="text-gray-500">Total Distance</span>
              <span className="font-bold text-gray-800">{item.distance}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <h4 className="text-xs font-bold text-purple-600 uppercase mb-3 flex items-center gap-2">
            <MessageSquare size={14} /> Remarks
          </h4>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Morning</span>
              <span
                className="font-medium text-gray-800 truncate max-w-[120px]"
                title={item.morningRemark}
              >
                {item.morningRemark}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Evening</span>
              <span
                className="font-medium text-gray-800 truncate max-w-[120px]"
                title={item.eveningRemark}
              >
                {item.eveningRemark}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2.5 border-t border-gray-100">
              <span className="text-gray-500">General</span>
              <span
                className="font-medium text-gray-800 truncate max-w-[120px]"
                title={item.remarks}
              >
                {item.remarks}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
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
    </div>
  );
};

export default Attendance;
