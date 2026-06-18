import React, { useState, useMemo, useEffect } from "react";
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
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Users,
  UserCheck,
  UserX
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 10;

const Attendance = () => {
  const [data, setData] = useState([]);


  const navigate = useNavigate();

  // drop dow + select filter 
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
  const [summary, setSummary] = useState({
    total_employees: 0,
    total_present: 0,
    total_absent: 0,
  });
  const [shiftFilter, setShiftFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const today = new Date();

  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());
  const [activeTab, setActiveTab] = useState("monthly");
  const [showCustomPopup, setShowCustomPopup] = useState(false);

  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [weekType, setWeekType] = useState("this");

  const getWeekRange = (type = "this") => {

    const today = new Date();

    const currentDay = today.getDay();

    const diff = currentDay === 0 ? -6 : 1 - currentDay;

    const monday = new Date(today);

    monday.setDate(today.getDate() + diff);

    if (type === "last") {
      monday.setDate(monday.getDate() - 7);
    }

    const sunday = new Date(monday);

    sunday.setDate(monday.getDate() + 6);

    return {
      startDate: monday.toISOString().split("T")[0],
      endDate: sunday.toISOString().split("T")[0],
    };
  };


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


  const [rawResponse, setRawResponse] = useState(null);
  useEffect(() => {

    const fetchAttendance = async () => {
      try {

        let url = "";

        // DAILY API
        if (activeTab === "daily") {

          url = `https://test.pearl-developer.com/Inbay_Innovations/public/api/attendance/dashboard?date=${year}-${String(month).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`;

        }

        // WEEKLY API
        else if (activeTab === "weekly") {

          const { startDate, endDate } = getWeekRange(weekType);

          url = `https://test.pearl-developer.com/Inbay_Innovations/public/api/attendance/dashboard?start_date=${startDate}&end_date=${endDate}`;
        }
        // MONTHLY API
        else if (activeTab === "monthly") {

          url = `https://test.pearl-developer.com/Inbay_Innovations/public/api/attendance/dashboard?month=${month}&year=${year}`;

        }

        // CUSTOM API
        else if (activeTab === "custom") {

          url = `https://test.pearl-developer.com/Inbay_Innovations/public/api/attendance/dashboard?start_date=${customStartDate}&end_date=${customEndDate}`;

        }

        const token = localStorage.getItem("token");

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const result = await res.json();
        setRawResponse(result);

        console.log(result);

        // ---------- MONTHLY RESPONSE ----------
        if (activeTab === "monthly") {

          const allEmployees = result.data.flatMap((dayData) =>
            dayData.employees.map((emp) => ({
              id: `${emp.id}-${dayData.date}`,
              name: emp.name || "N/A",
              email: emp.email || "N/A",
              group: emp.group || "N/A",
              department: emp.department || "N/A",
              attendance: emp.status || "Absent",

              scheduledStart: emp.time_tracking?.scheduled?.split(" - ")[0] || "--",
              scheduledEnd: emp.time_tracking?.scheduled?.split(" - ")[1] || "--",

              actualStart: emp.time_tracking?.actual?.split(" - ")[0] || "--",
              actualEnd: emp.time_tracking?.actual?.split(" - ")[1] || "--",

              totalHours: emp.time_tracking?.total_hours || "0h 0m",

              location: emp.location,
              endLocation: emp.travel_details?.end_location || "--",

              distance: emp.travel_details?.total_distance || "0 KM",

              morningRemark: emp.remarks?.morning || "--",
              eveningRemark: emp.remarks?.evening || "--",
              remarks: emp.remarks?.general || "--",

              morningOdo: emp.travel_details?.odometer?.split(" → ")[0] || "0",
              eveningOdo: emp.travel_details?.odometer?.split(" → ")[1] || "0",

              attendance_images: emp.attendance_images || null,   // ✅ ADD THIS

              date: dayData.date,
              day: dayData.day,
            }))
          );

          setData(allEmployees);

          setSummary({
            total_employees:
              result.data[0]?.summary?.total_employees || 0,

            total_present: result.data.reduce(
              (acc, item) => acc + item.summary.total_present,
              0
            ),

            total_absent: result.data.reduce(
              (acc, item) => acc + item.summary.total_absent,
              0
            ),
          });
        }

        // ---------- DAILY / WEEKLY / CUSTOM ----------

        else {
          const source = result.data
            ? result.data
            : result.employees
              ? [
                {
                  date: result.date,
                  day: result.day,
                  summary: result.summary,
                  employees: result.employees,
                },
              ]
              : [];

          const employees = source.flatMap((day) =>
            (day.employees || []).map((emp) => ({
              id: `${emp.id}-${day.date}`,

              name: emp.name || "N/A",
              email: emp.email || "N/A",
              group: emp.group || "N/A",
              department: emp.department || "N/A",

              attendance: emp.status || "Absent",

              scheduledStart: emp.time_tracking?.scheduled?.split(" - ")[0] || "--",
              scheduledEnd: emp.time_tracking?.scheduled?.split(" - ")[1] || "--",

              actualStart: emp.time_tracking?.actual?.split(" - ")[0] || "--",
              actualEnd: emp.time_tracking?.actual?.split(" - ")[1] || "--",

              totalHours: emp.time_tracking?.total_hours || "0h 0m",

              location: "Office",
              endLocation: emp.travel_details?.end_location || "--",

              remarks: emp.remarks?.general || "--",

              distance: emp.travel_details?.total_distance || "0 KM",

              morningRemark: emp.remarks?.morning || "--",
              eveningRemark: emp.remarks?.evening || "--",

              morningOdo: emp.travel_details?.odometer?.split(" → ")[0] || "0",
              eveningOdo: emp.travel_details?.odometer?.split(" → ")[1] || "0",

              date: emp.date,
              day: emp.day,

              attendance_images: emp.attendance_images || null,
            }))
          );

          setData(employees);

          setSummary({
            total_employees: source[0]?.summary?.total_employees || 0,
            total_present: source.reduce(
              (acc, item) => acc + (item.summary?.total_present || 0),
              0
            ),
            total_absent: source.reduce(
              (acc, item) => acc + (item.summary?.total_absent || 0),
              0
            ),
          });
        }

      } catch (error) {

        console.log(error);

      }
    };

    fetchAttendance();

  }, [
    activeTab,
    selectedDay,
    month,
    year,
    customStartDate,
    customEndDate,
    weekType
  ]);

  useEffect(() => {
    const totalDays = new Date(year, month, 0).getDate();

    if (selectedDay > totalDays) {
      setSelectedDay(1);
    }
  }, [month, year]);

  // Extract unique shifts for the dropdown filter dynamically
  const uniqueShifts = useMemo(() => {
    const shifts = data.map((item) => `${item.scheduledStart} - ${item.scheduledEnd}`);
    return [...new Set(shifts)];
  }, [data]);

  // Filter Data based on Search and Shift Filter
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesEmployee =

        selectedEmployees.length === 0 ||

        selectedEmployees.includes(item.name);

      const itemShift = `${item.scheduledStart} - ${item.scheduledEnd}`;

      const matchesShift =
        shiftFilter === "" || itemShift === shiftFilter;

      // DATE FILTER
      const itemDay = new Date(item.date).getDate();

      let matchesDay = true;

      if (activeTab === "daily") {
        matchesDay = itemDay === selectedDay;
      }
      return matchesEmployee && matchesShift && matchesDay;
    });
  }, [data, selectedEmployees, shiftFilter, selectedDay, activeTab]);



  console.log("Filtered Data:", filteredData)

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


  useEffect(() => {
    setCurrentPage(1);
  }, [
    activeTab,
    selectedDay,
    month,
    year,
    customStartDate,
    customEndDate,
    weekType,
    shiftFilter,
    selectedEmployees
  ]);
  // Calculate dynamic stats based on filtered data
  const totalEmployees = summary.total_employees;
  const totalPresent = summary.total_present;
  const totalAbsent = summary.total_absent;
  // const totalAbsent =totalEmployees-totalPresent;

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE) || 1;
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleShiftFilter = (e) => {
    setShiftFilter(e.target.value);
    setCurrentPage(1);
  };

  // Export CSV
  const handleExport = () => {
     console.log("Raw Response", rawResponse);
   

    const exportData = rawResponse?.data
      ? rawResponse.data
      : rawResponse?.employees
        ? [{
          date: rawResponse.date,
          day: rawResponse.day,
          summary: rawResponse.summary,
          employees: rawResponse.employees,
        }]
        : [];

    if (!exportData.length) {
      return alert("No data to export!");
    }

    const headers = [
      "Date",
      "Day",

      "Name",
      "Email",
      "Designation",
      "Reporting To",
      "HQ",

      "Status",
      "Present",

      "Scheduled Timing",
      "Check In",
      "Check Out",
      "Total Hours",

      "Start Location",
      "End Location",
      "GPS KM",

      "Farmer Meeting",
      "Field Visit",
      "Visit Schedule",
      "Visit Complete",

      "Morning Remark",
      "Evening Remark",
      "General Remark",

      "Selfie IN",
      "Selfie OUT",
      "Speedometer IN",
      "Speedometer OUT",
      "Signature IN",
      "Signature OUT",
    ].join(",");

    const rows = [];

  exportData.forEach((dayData) => {
      // AGAR EMPLOYEES EMPTY HAIN
      if (!dayData.employees || dayData.employees.length === 0) {
        rows.push(
          [
            dayData.date,
            dayData.day,
            "",
            "NO EMPLOYEE RECORD",
            "",
            "",
            "",
            "",
            "Absent",
            "No",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
          ]
            .map((val) => `"${String(val ?? "").replace(/"/g, '""')}"`)
            .join(",")
        );

        return;
      }

      // EMPLOYEE ROWS
      dayData.employees.forEach((emp) => {
        const images = emp.attendance_images || {};
        const remarks = emp.remarks || {};
        const tracking = emp.time_tracking || {};
        const travel = emp.travel_details || {};
        const visits = emp.visit_details || {};

        const row = [
          emp.date || dayData.date || "",
          emp.day || dayData.day || "",

          emp.name || "",
          emp.email || "",
          emp.designation || "",
          emp.reporting_to || "",
          emp.hq || "",

          emp.status || "",
          emp.present ? "Yes" : "No",

          tracking.scheduled || "",
          tracking.check_in || "",
          tracking.check_out || "",
          tracking.total_hours || "",

          travel.start_location || "",
          travel.end_location || "",
          travel.gps_km || "",

          visits.farmer_meeting || 0,
          visits.field_visit || 0,
          visits.visit_schedule || 0,
          visits.visit_complete || 0,

          remarks.morning || "",
          remarks.evening || "",
          remarks.general || "",

          images.selfie_photo_in || "",
          images.selfie_photo_out || "",
          images.speedometer_photo_in || "",
          images.speedometer_photo_out || "",
          images.signature_in || "",
          images.signature_out || "",
        ];

        rows.push(
          row
            .map((val) =>
              `"${String(val ?? "").replace(/"/g, '""')}"`
            )
            .join(",")
        );
      });
    });

    const csvContent = [headers, ...rows].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;

    a.download = `attendance_report_${Date.now()}.csv`;

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

    window.URL.revokeObjectURL(url);
  };




  const daysInMonth = new Date(year, month, 0).getDate();

  const daysArray = Array.from(
    { length: daysInMonth },
    (_, i) => i + 1
  );
  return (
    <div className="bg-gray-50 h-screen flex flex-col font-sans">

      {/* TOP HEADER */}
      <div className="bg-white px-6 py-4 shadow-sm border-b border-gray-200 flex justify-between items-center z-10 flex-shrink-0">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-800">Attendance Logs</h2>
          <p className="text-sm text-gray-500 mt-1">Manage and track employee attendance</p>
        </div>

        <button
          onClick={handleExport}
          className="bg-purple-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors shadow-sm flex items-center gap-2"
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {/* TOOLBAR: SEARCH & FILTERS */}
      <div className="bg-white px-6 py-4 shadow-sm border-b border-gray-100 flex flex-col gap-5">

        {/* TOP SECTION */}
        <div className="flex flex-col xl:flex-row gap-4 xl:items-center xl:justify-between">

          {/* LEFT FILTERS */}
          <div className="flex flex-col lg:flex-row gap-4 flex-1">

            {/* EMPLOYEE SEARCH */}
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

            {/* SHIFT FILTER */}
            <div className="relative w-full lg:w-64">
              <Filter
                className="absolute left-3 top-3 text-purple-500"
                size={18}
              />

              <select
                value={shiftFilter}
                onChange={handleShiftFilter}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm bg-white shadow-sm appearance-none"
              >
                <option value="">All Shifts</option>

                {uniqueShifts.map((shift, idx) => (
                  <option key={idx} value={shift}>
                    {shift}
                  </option>
                ))}
              </select>
            </div>
          </div>



        </div>

        {/* TABS + FILTERS */}
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">

          {/* TABS */}
          <div className="bg-gray-100 p-1 rounded-2xl flex flex-wrap items-center gap-1 shadow-sm w-fit">

            {["daily", "weekly", "monthly", "custom"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  if (tab === "custom") {
                    setActiveTab("custom");
                    setShowCustomPopup(true);
                  } else {
                    setActiveTab(tab);
                  }
                }}
                className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all duration-300
          ${activeTab === tab
                    ? "bg-purple-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-white"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* ACTIVE FILTERS */}
          <div className="flex flex-wrap gap-3 items-center">

            {/* DAILY */}
            {activeTab === "daily" && (
              <>
                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(Number(e.target.value))}
                  className="border border-gray-300 px-4 py-2.5 rounded-xl text-sm bg-white shadow-sm"
                >
                  {daysArray.map((day) => (
                    <option key={day} value={day}>
                      Day {day}
                    </option>
                  ))}
                </select>

                <select
                  value={month}
                  onChange={(e) => setMonth(Number(e.target.value))}
                  className="border border-gray-300 px-4 py-2.5 rounded-xl text-sm bg-white shadow-sm"
                >
                  <option value={1}>January</option>
                  <option value={2}>February</option>
                  <option value={3}>March</option>
                  <option value={4}>April</option>
                  <option value={5}>May</option>
                  <option value={6}>June</option>
                  <option value={7}>July</option>
                  <option value={8}>August</option>
                  <option value={9}>September</option>
                  <option value={10}>October</option>
                  <option value={11}>November</option>
                  <option value={12}>December</option>
                </select>
              </>
            )}

            {/* MONTHLY */}
            {activeTab === "monthly" && (
              <>
                <select
                  value={month}
                  onChange={(e) => setMonth(Number(e.target.value))}
                  className="border border-gray-300 px-4 py-2.5 rounded-xl text-sm bg-white shadow-sm"
                >
                  <option value={1}>January</option>
                  <option value={2}>February</option>
                  <option value={3}>March</option>
                  <option value={4}>April</option>
                  <option value={5}>May</option>
                  <option value={6}>June</option>
                  <option value={7}>July</option>
                  <option value={8}>August</option>
                  <option value={9}>September</option>
                  <option value={10}>October</option>
                  <option value={11}>November</option>
                  <option value={12}>December</option>
                </select>

                <select
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="border border-gray-300 px-4 py-2.5 rounded-xl text-sm bg-white shadow-sm"
                >
                  {[2024, 2025, 2026, 2027, 2028, 2029, 2030].map((yr) => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  ))}
                </select>
              </>
            )}

            {/* WEEKLY */}
            {activeTab === "weekly" && (
              <select
                value={weekType}
                onChange={(e) => setWeekType(e.target.value)}
                className="border border-gray-300 px-4 py-2.5 rounded-xl text-sm bg-white shadow-sm"
              >
                <option value="this">This Week</option>
                <option value="last">Last Week</option>
              </select>
            )}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-6xl mx-auto">

          {/* SUMMARY CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Total Employees */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                <Users size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Employees</p>
                <h3 className="text-2xl font-extrabold text-gray-900">{totalEmployees}</h3>
              </div>
            </div>

            {/* Total Present */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                <UserCheck size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Present</p>
                <h3 className="text-2xl font-extrabold text-gray-900">{totalPresent}</h3>
              </div>
            </div>

            {/* Total Absent */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                <UserX size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Absent</p>
                <h3 className="text-2xl font-extrabold text-gray-900">{totalAbsent}</h3>
              </div>
            </div>
          </div>

          {/* EMPLOYEE CARDS LIST */}
          <div className="space-y-5">
            {paginatedData.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-gray-500 text-lg font-medium">No records found matching your criteria.</p>
                <button onClick={() => { setShiftFilter(''); }} className="text-purple-600 mt-2 hover:underline">Clear Filters</button>
              </div>
            ) : (
              paginatedData.map((item) => {
                const isPresent = item.attendance.toLowerCase() === "present";

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl shadow-sm border border-purple-100 hover:shadow-md transition-shadow duration-200 overflow-hidden"
                  >
                    {/* TOP PROFILE SECTION */}
                    <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

                      {/* Avatar, Name, Email, Location */}
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
                            {item.department} <span className="text-purple-300">•</span> Group {item.group}
                          </div>
                        </div>
                      </div>

                      {/* Date & Present/Absent Icon */}
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

                      {/* Card 1: Timings */}
                      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <h4 className="text-xs font-bold text-purple-600 uppercase mb-3 flex items-center gap-2">
                          <Clock size={14} /> Time Tracking
                        </h4>
                        <div className="space-y-2.5 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-500">Scheduled</span>
                            <span className="font-medium text-gray-800">{item.scheduledStart} - {item.scheduledEnd}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-500">Actual</span>
                            <span className="font-medium text-gray-800">{item.actualStart} - {item.actualEnd}</span>
                          </div>
                          <div className="flex justify-between items-center pt-2.5 border-t border-gray-100">
                            <span className="text-gray-500">Total Hours</span>
                            <span className="font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded">{item.totalHours}</span>
                          </div>
                        </div>
                      </div>

                      {/* Card 2: Travel & Location */}
                      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <h4 className="text-xs font-bold text-purple-600 uppercase mb-3 flex items-center gap-2">
                          <Car size={14} /> Travel Details
                        </h4>
                        <div className="space-y-2.5 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-500">End Location</span>
                            <span className="font-medium text-gray-800">{item.endLocation}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-500">Odometer</span>
                            <span className="font-medium text-gray-800">{item.morningOdo} → {item.eveningOdo}</span>
                          </div>
                          <div className="flex justify-between items-center pt-2.5 border-t border-gray-100">
                            <span className="text-gray-500">Total Distance</span>
                            <span className="font-bold text-gray-800">{item.distance} </span>
                          </div>
                        </div>
                      </div>

                      {/* Card 3: Remarks */}
                      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <h4 className="text-xs font-bold text-purple-600 uppercase mb-3 flex items-center gap-2">
                          <MessageSquare size={14} /> Remarks
                        </h4>
                        <div className="space-y-2.5 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-500">Morning</span>
                            <span className="font-medium text-gray-800 truncate max-w-[120px]" title={item.morningRemark}>{item.morningRemark}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-500">Evening</span>
                            <span className="font-medium text-gray-800 truncate max-w-[120px]" title={item.eveningRemark}>{item.eveningRemark}</span>
                          </div>
                          <div className="flex justify-between items-center pt-2.5 border-t border-gray-100">
                            <span className="text-gray-500">General</span>
                            <span className="font-medium text-gray-800 truncate max-w-[120px]" title={item.remarks}>{item.remarks}</span>
                          </div>
                        </div>
                      </div>
                      {/* Card 4: Images */}
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
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* PAGINATION FOOTER */}
      {totalPages > 1 && (
        <div className="bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0 z-10">
          <p className="text-sm text-gray-500">
            Showing <span className="font-medium text-gray-900">{((currentPage - 1) * ITEMS_PER_PAGE) + 1}</span> to <span className="font-medium text-gray-900">{Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)}</span> of <span className="font-medium text-gray-900">{filteredData.length}</span> results
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
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${currentPage === i + 1
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
      {/* CUSTOM DATE POPUP */}
      {showCustomPopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-2xl">

            <h2 className="text-xl font-bold text-gray-800 mb-5">
              Select Custom Date Range
            </h2>

            {/* START DATE */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Start Date
              </label>

              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* END DATE */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                End Date
              </label>

              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* BUTTONS */}
            <div className="flex justify-end gap-3">

              <button
                onClick={() => {
                  setShowCustomPopup(false);
                  setActiveTab("monthly");
                }}
                className="px-4 py-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  if (!customStartDate || !customEndDate) {
                    return alert("Please select start and end date");
                  }
                  if (new Date(customEndDate) < new Date(customStartDate)) {
                    return alert("End date cannot be before start date");
                  }

                  setShowCustomPopup(false);
                }}
                className="px-5 py-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700"
              >
                Apply Filter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

  );
};

export default Attendance;