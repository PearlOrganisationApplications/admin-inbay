import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchReport } from "./dailyReportApis";
import ReportFilters from "./DailyReportFilters";
import { CustomDatePopup, DailyFilterPopup, MonthlyFilterPopup, WeeklyFilterPopup } from "./Modals";



const Dailyreports = () => {
   const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
  const [data, setData] = useState([]); // API data state
  const [summary, setSummary] = useState({ total_employees: 0, total_present: 0, total_absent: 0 }); // Stats state
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const today = new Date();
  const [showCustomPopup, setShowCustomPopup] = useState(false);
  const [showMonthlyPopup, setShowMonthlyPopup] = useState(false);
  const [showDailyPopup, setShowDailyPopup] = useState(false);
  const [showWeeklyPopup, setShowWeeklyPopup] = useState(false);
  const [rawResponse, setRawResponse] = useState(null);
  const dropDownRef = useRef(null);

  const [employeeSearch, setEmployeeSearch] = useState(() => {
    return localStorage.getItem("employeeSearch") || "";
  });

  const [selectedEmployees, setSelectedEmployees] = useState(() => {
    const saved = localStorage.getItem("selectedEmployees");
    return saved ? JSON.parse(saved) : [];
  });

  const [reportType, setReportType] = useState(() => {
    return localStorage.getItem("reportType") || "daily";
  });


  const [customStartDate, setCustomStartDate] = useState(() => {
    return localStorage.getItem("customStartDate") || "";
  });

  const [customEndDate, setCustomEndDate] = useState(() => {
    return localStorage.getItem("customEndDate") || "";
  });

  const [weeklyStartDate, setWeeklyStartDate] = useState(() => {
    return localStorage.getItem("weeklyStartDate") || "";
  });

  const [weeklyEndDate, setWeeklyEndDate] = useState(() => {
    return localStorage.getItem("weeklyEndDate") || "";
  });

  const [selectedDay, setSelectedDay] = useState(() => {
    return Number(localStorage.getItem("selectedDay")) || today.getDate();
  });

  const [selectedMonth, setSelectedMonth] = useState(() => {
    return Number(localStorage.getItem("selectedMonth")) || today.getMonth() + 1;
  });

  const [selectedYear, setSelectedYear] = useState(() => {
    return Number(localStorage.getItem("selectedYear")) || today.getFullYear();
  });

 


  useEffect(() => {
    localStorage.setItem("employeeSearch", employeeSearch);
  }, [employeeSearch]);

  useEffect(() => {
    localStorage.setItem(
      "selectedEmployees",
      JSON.stringify(selectedEmployees)
    );
  }, [selectedEmployees]);

  useEffect(() => {
    localStorage.setItem("customStartDate", customStartDate);
  }, [customStartDate]);

  useEffect(() => {
    localStorage.setItem("customEndDate", customEndDate);
  }, [customEndDate]);

  useEffect(() => {
    localStorage.setItem("weeklyStartDate", weeklyStartDate);
  }, [weeklyStartDate]);

  useEffect(() => {
    localStorage.setItem("weeklyEndDate", weeklyEndDate);
  }, [weeklyEndDate]);

  useEffect(() => {
    localStorage.setItem("selectedDay", selectedDay);
  }, [selectedDay]);

  useEffect(() => {
    localStorage.setItem("selectedMonth", selectedMonth);
  }, [selectedMonth]);

  useEffect(() => {
    localStorage.setItem("selectedYear", selectedYear);
  }, [selectedYear]);

   useEffect(() => {
    localStorage.setItem("reportType", reportType);
  }, [reportType]);


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropDownRef.current &&
        !dropDownRef.current.contains(e.target)
      ) {
        setShowEmployeeDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
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
 
  useEffect(() => {
    fetchReport(
      reportType,
      selectedDay,
      selectedMonth,
      selectedYear,
      customStartDate,
      customEndDate,
      weeklyStartDate,
      weeklyEndDate,
      setRawResponse,
      setData,
      setSummary
    );
  }, [
    reportType,
    selectedDay,
    selectedMonth,
    selectedYear,
    customStartDate,
    customEndDate,
    weeklyStartDate,
    weeklyEndDate,
  ]);


  const handleResetFilters = () => {
    // Clear state
    setEmployeeSearch("");
    setSelectedEmployees([]);
    setReportType("daily");

    setSelectedDay(today.getDate());
    setSelectedMonth(today.getMonth() + 1);
    setSelectedYear(today.getFullYear());

    setWeeklyStartDate("");
    setWeeklyEndDate("");

    setCustomStartDate("");
    setCustomEndDate("");

    setCurrentPage(1);

    // Clear localStorage
    localStorage.removeItem("employeeSearch");
    localStorage.removeItem("selectedEmployees");
    localStorage.removeItem("reportType");
    localStorage.removeItem("selectedDay");
    localStorage.removeItem("selectedMonth");
    localStorage.removeItem("selectedYear");
    localStorage.removeItem("weeklyStartDate");
    localStorage.removeItem("weeklyEndDate");
    localStorage.removeItem("customStartDate");
    localStorage.removeItem("customEndDate");
  };

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
        setShowDailyPopup={setShowDailyPopup}
        setShowWeeklyPopup={setShowWeeklyPopup}
        setShowMonthlyPopup={setShowMonthlyPopup}
        setShowCustomPopup={setShowCustomPopup}
        dropDownRef={dropDownRef}
        handleResetFilters={handleResetFilters}
      />

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