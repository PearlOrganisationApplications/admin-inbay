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


const ITEMS_PER_PAGE = 10;

const Attendance = () => {
const [data, setData] = useState([]);
const [summary, setSummary] = useState({
  total_employees: 0,
  total_present: 0,
  total_absent: 0,
});
  const [searchQuery, setSearchQuery] = useState("");
  const [shiftFilter, setShiftFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
  const fetchAttendance = async () => {
    try {
      const res = await fetch(
        "https://test.pearl-developer.com/Inbay_Innovations/public/api/attendance/dashboard",
        {
          headers: {
            Authorization: "Bearer 200|I1ZZjquueG708yBOFYUUmUi2mYlIUNcrZDyJ208T81de1b2b",
            "Content-Type": "application/json",
          },
        }
      );

      const result = await res.json();

      if (result.success) {
        setSummary(result.summary);

        const formatted = result.employees.map((emp) => ({
          id: emp.id,
          name: emp.name,
          email: emp.email,
          group: emp.group,
          department: emp.department,
          attendance: emp.status,
          scheduledStart: emp.time_tracking.scheduled.split(" - ")[0],
          scheduledEnd: emp.time_tracking.scheduled.split(" - ")[1],
          actualStart: emp.time_tracking.actual.split(" - ")[0],
          actualEnd: emp.time_tracking.actual.split(" - ")[1],
          totalHours: emp.time_tracking.total_hours,
          location: "Office",
          endLocation: emp.travel_details.end_location,
          remarks: emp.remarks.general,
          distance: emp.travel_details.total_distance,
          morningRemark: emp.remarks.morning,
          eveningRemark: emp.remarks.evening,
          morningOdo: emp.travel_details.odometer.split(" → ")[0],
          eveningOdo: emp.travel_details.odometer.split(" → ")[1],
          totalOdo: emp.travel_details.total_distance,
          date: emp.date,
          day: emp.day,
        }));

        setData(formatted);
      }
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  fetchAttendance();
}, []);

  // Extract unique shifts for the dropdown filter dynamically
  const uniqueShifts = useMemo(() => {
    const shifts = data.map((item) => `${item.scheduledStart} - ${item.scheduledEnd}`);
    return [...new Set(shifts)];
  }, [data]);

  // Filter Data based on Search and Shift Filter
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesName = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const itemShift = `${item.scheduledStart} - ${item.scheduledEnd}`;
      const matchesShift = shiftFilter === "" || itemShift === shiftFilter;
      return matchesName && matchesShift;
    });
  },[data, searchQuery, shiftFilter]);

  // Calculate dynamic stats based on filtered data
const totalEmployees = summary.total_employees;
const totalPresent = summary.total_present;
const totalAbsent = summary.total_absent;

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE) || 1;
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Handlers for Filters (Reset to page 1 when filtering)
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleShiftFilter = (e) => {
    setShiftFilter(e.target.value);
    setCurrentPage(1);
  };

  // Export CSV
  const handleExport = () => {
    if (filteredData.length === 0) return alert("No data to export!");
    
    // Omit the internal 'id' from export
    const headers = Object.keys(filteredData[0]).filter(k => k !== 'id').join(",");
    const rows = filteredData.map((obj) => {
      const { id, ...rest } = obj;
      return Object.values(rest).map(val => `"${val}"`).join(",");
    }).join("\n");
    
    const csv = headers + "\n" + rows;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "attendance_filtered.csv";
    a.click();
  };

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
      <div className="bg-white px-6 py-4 shadow-sm border-b border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between z-0 flex-shrink-0">
        
        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by Employee Name..." 
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm transition-all"
          />
        </div>

        {/* Shift Filter Dropdown */}
        <div className="relative w-full md:w-64">
          <Filter className="absolute left-3 top-2.5 text-purple-500" size={18} />
          <select 
            value={shiftFilter}
            onChange={handleShiftFilter}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm bg-white cursor-pointer transition-all appearance-none"
          >
            <option value="">All Shifts</option>
            {uniqueShifts.map((shift, idx) => (
              <option key={idx} value={shift}>{shift}</option>
            ))}
          </select>
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
                <button onClick={() => { setSearchQuery(''); setShiftFilter(''); }} className="text-purple-600 mt-2 hover:underline">Clear Filters</button>
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
                              <Mail size={14} className="text-purple-500"/> {item.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin size={14} className="text-purple-500"/> {item.location}
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
                          <Calendar size={13}/> {item.date} ({item.day})
                        </span>
                      </div>
                    </div>

                    {/* BOTTOM DETAILS GRID */}
                    <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50/50">
                      
                      {/* Card 1: Timings */}
                      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <h4 className="text-xs font-bold text-purple-600 uppercase mb-3 flex items-center gap-2">
                          <Clock size={14}/> Time Tracking
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
                          <Car size={14}/> Travel Details
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
                          <MessageSquare size={14}/> Remarks
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
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === i + 1 
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

    </div>
  );
};

export default Attendance;