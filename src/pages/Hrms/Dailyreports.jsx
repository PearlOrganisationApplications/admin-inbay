import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";


const DailyFilterPopup = ({
  open,
  onClose,
  onApply,
  selectedDay,
  selectedMonth,
  selectedYear,
}) => {
  const [day, setDay] = useState(selectedDay);
  const [month, setMonth] = useState(selectedMonth);
  const [year, setYear] = useState(selectedYear);

  if (!open) return null;

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const totalDays = new Date(year, month, 0).getDate();
  const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1);

  const years = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - i
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[90%] max-w-md rounded-xl p-5 shadow-lg">

        <h2 className="text-lg font-bold mb-4">Daily Filter</h2>

        {/* DAY */}
        <div className="mb-3">
          <label className="text-sm text-gray-600">Select Day</label>
          <select
            value={day}
            onChange={(e) => setDay(Number(e.target.value))}
            className="w-full border p-2 rounded-lg mt-1"
          >
            {daysArray.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* MONTH */}
        <div className="mb-3">
          <label className="text-sm text-gray-600">Select Month</label>
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="w-full border p-2 rounded-lg mt-1"
          >
            {months.map((m, i) => (
              <option key={i} value={i + 1}>{m}</option>
            ))}
          </select>
        </div>

        {/* YEAR */}
        <div className="mb-3">
          <label className="text-sm text-gray-600">Select Year</label>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="w-full border p-2 rounded-lg mt-1"
          >
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-2 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              onApply(day, month, year);
              onClose();
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg"
          >
            Apply
          </button>
        </div>

      </div>
    </div>
  );
};

const CustomDatePopup = ({ open, onClose, onApply }) => {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white w-[90%] max-w-md rounded-xl p-5 shadow-lg">

        <h2 className="text-lg font-bold mb-4">Custom Date Filter</h2>

        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-600">Start Date</label>
            <input
              type="date"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="w-full border p-2 rounded-lg mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">End Date</label>
            <input
              type="date"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="w-full border p-2 rounded-lg mt-1"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              onApply(start, end);
              onClose();
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg"
          >
            Apply
          </button>
        </div>

      </div>
    </div>
  );
};


const MonthlyFilterPopup = ({ open, onClose, onApply, selectedMonth, selectedYear }) => {
  const [month, setMonth] = useState(selectedMonth);
  const [year, setYear] = useState(selectedYear);

  if (!open) return null;

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[90%] max-w-md rounded-xl p-5 shadow-lg">

        <h2 className="text-lg font-bold mb-4">Monthly Filter</h2>

        {/* MONTH SELECT */}
        <div className="mb-3">
          <label className="text-sm text-gray-600">Select Month</label>
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="w-full border p-2 rounded-lg mt-1"
          >
            {months.map((m, i) => (
              <option key={i} value={i + 1}>{m}</option>
            ))}
          </select>
        </div>

        {/* YEAR SELECT */}
        <div className="mb-3">
          <label className="text-sm text-gray-600">Select Year</label>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="w-full border p-2 rounded-lg mt-1"
          >
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-2 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              onApply(month, year);
              onClose();
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg"
          >
            Apply
          </button>
        </div>

      </div>
    </div>
  );
};

const WeeklyFilterPopup = ({
  open,
  onClose,
  onApply,
  selectedEndDate,
}) => {
  const [endDate, setEndDate] = useState(selectedEndDate || "");

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[90%] max-w-md rounded-xl p-5 shadow-lg">

        <h2 className="text-lg font-bold mb-4">Weekly Filter</h2>

        {/* END DATE */}
        <div className="mb-3">
          <label className="text-sm text-gray-600">Select End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full border p-2 rounded-lg mt-1"
          />
        </div>

        <p className="text-xs text-gray-500 mb-3">
          Start date automatically calculated (7 days before end date)
        </p>

        {/* BUTTONS */}
        <div className="flex justify-end gap-2 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              onApply(endDate);
              onClose();
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg"
          >
            Apply
          </button>
        </div>

      </div>
    </div>
  );
};

const Dailyreports = () => {

  // drop dow + select filter 
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
  const [data, setData] = useState([]); // API data state
  const [summary, setSummary] = useState({ total_employees: 0, total_present: 0, total_absent: 0 }); // Stats state
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const today = new Date();
  const [reportType, setReportType] = useState("daily");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [showCustomPopup, setShowCustomPopup] = useState(false);
  const [showMonthlyPopup, setShowMonthlyPopup] = useState(false);
  const [showDailyPopup, setShowDailyPopup] = useState(false);
  const [showWeeklyPopup, setShowWeeklyPopup] = useState(false);
  const [weeklyStartDate, setWeeklyStartDate] = useState("");
  const [weeklyEndDate, setWeeklyEndDate] = useState("");
  const [rawResponse, setRawResponse] = useState(null);
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



  const [selectedDay, setSelectedDay] = useState(
    today.getDate()
  );

  const [selectedMonth, setSelectedMonth] = useState(
    today.getMonth() + 1
  );

  const [selectedYear, setSelectedYear] = useState(
    today.getFullYear()
  );

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


  const getApiUrl = () => {
    let url = `https://test.pearl-developer.com/Inbay_Innovations/public/api/daily-report?`;

    if (reportType === "daily") {
      const date = `${selectedYear}-${selectedMonth}-${selectedDay}`;
      url += `date=${date}`;
    }

    else if (reportType === "weekly") {
      url += `start_date=${weeklyStartDate}&end_date=${weeklyEndDate}`;
    }

    else if (reportType === "monthly") {
      url += `month=${selectedMonth}&year=${selectedYear}`;
    }

    else if (reportType === "custom") {
      url += `start_date=${customStartDate}&end_date=${customEndDate}`;
    }

    return url;
  };

  // API Fetch Function
  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);

      try {
         const token = localStorage.getItem("token");

        const res = await fetch(getApiUrl(), {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const result = await res.json();
        setRawResponse(result); // Store raw response for debugging

        if (result.success) {
          const formattedEmployees = result.data.flatMap((day) =>
            day.employees.map((emp) => ({
              ...emp,
              date: day.date,
              day: day.day,
            }))
          );

          setData(formattedEmployees);

          const totalPresent = result.data.reduce(
            (acc, d) => acc + (d.summary?.total_present || 0),
            0
          );

          const totalAbsent = result.data.reduce(
            (acc, d) => acc + (d.summary?.total_absent || 0),
            0
          );

          setSummary({
            total_employees: result.data[0]?.summary?.total_employees || 0,
            total_present: totalPresent,
            total_absent: totalAbsent,
          });
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [reportType, selectedDay, selectedMonth, selectedYear, customStartDate, customEndDate]);

  const uniqueEmployees = useMemo(() => {

    const unique = [];
    const map = new Map();

    data.forEach((emp) => {

      if (!map.has(emp.name)) {

        map.set(emp.name, true);
        unique.push(emp.name);

      }

    });

    return unique;

  }, [data]);




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

  const filteredEmployeeOptions = uniqueEmployees.filter((name) =>
    name.toLowerCase().includes(employeeSearch.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const filteredData = data.filter((item) => {

    if (selectedEmployees.length === 0) return true;

    return selectedEmployees.includes(item.name);

  });
  const currentData = filteredData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);



  const handleExport = () => {
    if (!rawResponse?.data?.length) return;

    const headers = [
      "Date",
      "Day",

      "Employee Name",
      "Designation",
      "Reporting To",
      "HQ",
      "Status",
      "Present",

      "Scheduled Time",
      "Check In",
      "Check Out",
      "Total Hours",

      "GPS KM",
      "Start Location",
      "End Location",

      "Farmer Meeting",
      "Field Visit",
      "Visit Schedule",
      "Visit Complete",

      "Morning Remark",
      "Evening Remark",
      "General Remark",
    ];

    const rows = [];

    rawResponse.data.forEach((dayData) => {
      dayData.employees.forEach((emp) => {
        rows.push([
          emp?.date || dayData?.date || "-",
          emp?.day || dayData?.day || "-",

       
          emp?.name || "-",
          emp?.designation || "-",
          emp?.reporting_to || "-",
          emp?.hq || "-",
          emp?.status || "-",
          emp?.present ? "Yes" : "No",

          emp?.time_tracking?.scheduled || "-",
          emp?.time_tracking?.check_in || "-",
          emp?.time_tracking?.check_out || "-",
          emp?.time_tracking?.total_hours || "-",

          emp?.travel_details?.gps_km || "-",
          emp?.travel_details?.start_location || "-",
          emp?.travel_details?.end_location || "-",

          emp?.visit_details?.farmer_meeting ?? "-",
          emp?.visit_details?.field_visit ?? "-",
          emp?.visit_details?.visit_schedule ?? "-",
          emp?.visit_details?.visit_complete ?? "-",

          emp?.remarks?.morning || "-",
          emp?.remarks?.evening || "-",
          emp?.remarks?.general || "-",
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
    link.setAttribute("download", "daily-report.csv");

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalDays = new Date(
    selectedYear,
    selectedMonth,
    0
  ).getDate();

  const daysArray = Array.from(
    { length: totalDays },
    (_, i) => i + 1
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedDay, selectedMonth, selectedYear]);

  if (loading) {
    return <div className="flex h-screen items-center justify-center font-bold text-gray-600">Loading Reports...</div>;
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 h-screen overflow-hidden flex flex-col font-sans">
      {/* 1. TOP TITLE SECTION */}
      <div className="flex justify-between items-center mb-6 shrink-0 border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Reports Logs</h2>
          <p className="text-sm text-gray-500 font-medium">Track employee field activities, visits, and daily work logs</p>
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

          <div
            onClick={() => setShowEmployeeDropdown(!showEmployeeDropdown)}
            className="w-full min-h-[46px] border border-gray-200 rounded-xl px-3 py-2 bg-white cursor-pointer flex items-center justify-between shadow-sm"
          >
            {selectedEmployees.length === 0 ? (
              <span className="text-sm text-gray-400">
                Search & Select Employees
              </span>
            ) : (
              <span className="text-sm font-semibold text-[#8b2cf5]">
                {selectedEmployees.length} Employees Selected
              </span>
            )}
          </div>

          {showEmployeeDropdown && (
            <div className="absolute top-full mt-2 left-0 w-full bg-white border border-gray-200 rounded-2xl shadow-xl z-50 p-3">

              {/* SEARCH */}
              <div className="relative mb-3">
                <svg
                  className="absolute left-3 top-2.5 w-4 h-4 text-gray-400"
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

                <input
                  type="text"
                  placeholder="Search employee..."
                  value={employeeSearch}
                  onChange={(e) => setEmployeeSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* SELECT ALL */}
              <label className="flex items-center gap-2 px-2 py-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedEmployees.length === uniqueEmployees.length}
                  onChange={handleSelectAllEmployees}
                />
                <span className="text-sm font-semibold text-[#8b2cf5]">
                  Select All
                </span>
              </label>

              {/* EMPLOYEE LIST */}
              <div className="max-h-60 overflow-y-auto mt-2 space-y-1">

                {filteredEmployeeOptions.map((name, idx) => (
                  <label
                    key={idx}
                    className="flex items-center gap-2 px-2 py-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedEmployees.includes(name)}
                      onChange={() => handleEmployeeSelect(name)}
                    />
                    <span className="text-sm text-gray-700">{name}</span>
                  </label>
                ))}

              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3 bg-white border border-gray-200 px-4 py-2.5 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors shadow-sm w-full md:w-auto">
          <svg className="w-5 h-5 text-[#8b2cf5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span className="text-sm font-semibold text-gray-700">All Shifts</span>
        </div>
        <div className="bg-gray-100 p-1 rounded-2xl flex flex-wrap items-center gap-1 shadow-sm w-fit">

          {["daily", "weekly", "monthly", "custom"].map((tab) => (
            <button
              key={tab}
              onClick={() => {

                if (tab === "daily") {
                  setShowDailyPopup(true);
                }
                else if (tab === "weekly") {
                  setShowWeeklyPopup(true);
                }
                else if (tab === "custom") {
                  setShowCustomPopup(true);
                }
                else if (tab === "monthly") {
                  setShowMonthlyPopup(true);
                }
                else {
                  setReportType(tab);
                }
              }}
              className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all duration-300
          ${reportType === tab
                  ? "bg-purple-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-white"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* 3. SCROLLABLE AREA */}
      <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar pb-10">
        {/* STATS CARDS SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-[#8b2cf5]">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500 mb-1">Total Employees</p>
              <p className="text-3xl font-black text-gray-900">{summary.total_employees}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500 mb-1">Total Present</p>
              <p className="text-3xl font-black text-gray-900">{summary.total_present}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-500">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500 mb-1">Total Absent</p>
              <p className="text-3xl font-black text-gray-900">{summary.total_absent}</p>
            </div>
          </div>
        </div>

        {/* EMPLOYEE CARDS LIST */}
        <div className="space-y-4">
          {currentData.map((item, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-4 items-center">
                  <div className="w-14 h-14 rounded-full bg-[#8b2cf5] text-white flex items-center justify-center text-xl font-bold shadow-sm">
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                      <span className="flex items-center gap-1.5">{item.designation}</span>
                      <span className="flex items-center gap-1.5">{item.location}</span>
                    </div>
                    <div className="flex gap-2 mt-2.5">
                      <span className="bg-purple-50 text-[#8b2cf5] text-[11px] px-2.5 py-1 rounded-md font-semibold tracking-wide">{item.team}</span>
                      <span className="bg-purple-50 text-[#8b2cf5] text-[11px] px-2.5 py-1 rounded-md font-semibold tracking-wide">{item.state}</span>
                      <span className="bg-gray-100 text-gray-600 text-[11px] px-2.5 py-1 rounded-md font-semibold tracking-wide border border-gray-200">
                        Reporting: {item.reporting_to}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className={`px-3 py-1 rounded-full border text-xs font-bold flex items-center gap-1.5 ${item.status.toLowerCase() === "present" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>
                    {item.status}
                  </div>
                  <div className="text-xs text-gray-400">{item.date} ({item.day})</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/50">
                  <h4 className="text-[11px] font-bold text-[#8b2cf5] mb-3 uppercase tracking-wider">Time & Visits</h4>
                  <div className="space-y-2.5 text-sm text-gray-800">
                    <div className="flex justify-between">
                      <span>Scheduled Time</span>
                      <span className="font-semibold">{item.time_tracking?.scheduled}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Visits</span>
                      <span className="font-semibold">{item.time_tracking?.visits_done} / {item.time_tracking?.visits_total}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-100">
                      <span>Total Hours</span>
                      <span className="bg-purple-100 text-[#8b2cf5] px-2 py-0.5 rounded font-bold">{item.time_tracking?.total_hours}</span>
                    </div>
                  </div>
                </div>
                <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/50">
                  <h4 className="text-[11px] font-bold text-[#8b2cf5] mb-3 uppercase tracking-wider">Travel Details</h4>
                  <div className="space-y-2.5 text-sm text-gray-800">
                    <div className="flex justify-between">
                      <span>Route</span>
                      <span className="font-semibold">{item.travel_details.route}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Odometer</span>
                      <span className="font-semibold">{item.travel_details.odometer}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-100">
                      <span>Distance</span>
                      <span className="font-bold">{item.travel_details.total_distance} {item.travel_details.gps_distance}</span>
                    </div>
                  </div>
                </div>
                <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/50">
                  <h4 className="text-[11px] font-bold text-[#8b2cf5] mb-3 uppercase tracking-wider">Remarks</h4>
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
                      <span className="font-semibold truncate w-24">{item.remarks.general}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <h4 className="text-xs font-bold text-purple-600 uppercase mb-3">
                  Attendance Images
                </h4>

                <div className="space-y-2 text-sm">
                  <div>
                    {renderImageLink(item.attendance_images?.selfie_photo_in, "Selfie IN")}
                  </div>

                  <div>
                    {renderImageLink(item.attendance_images?.selfie_photo_out, "Selfie OUT")}
                  </div>

                  <div>
                    {renderImageLink(item.attendance_images?.speedometer_photo_in, "Speedometer IN")}
                  </div>

                  <div>
                    {renderImageLink(item.attendance_images?.speedometer_photo_out, "Speedometer OUT")}
                  </div>

                  <div>
                    {renderImageLink(item.attendance_images?.signature_out, "Signature OUT")}
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* 4. PAGINATION */}
      <div className="flex justify-center items-center gap-2 mt-4 pb-4 shrink-0 bg-gray-50">
        <button
          onClick={() => setCurrentPage((prev) => prev - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-md border bg-white text-sm disabled:opacity-50"
        >Prev</button>
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
        >Next</button>
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

export default Dailyreports;