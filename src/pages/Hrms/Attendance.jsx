import React, { useState, useMemo } from "react";
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
  ChevronRight
} from "lucide-react";

// 15 Static Dummy Records
const initialData =[
  { id: 1, date: "2026-03-17", day: "Tuesday", name: "John Doe", email: "john@test.com", group: "A", department: "Sales", attendance: "Present", scheduledStart: "09:00 AM", scheduledEnd: "06:00 PM", actualStart: "09:10 AM", actualEnd: "05:50 PM", totalHours: "8h 40m", location: "Office", endLocation: "Home", remarks: "Client meetings.", distance: "12", morningRemark: "On Time", eveningRemark: "Left Early", morningOdo: "1200", eveningOdo: "1212", totalOdo: "12" },
  { id: 2, date: "2026-03-17", day: "Tuesday", name: "Sarah Smith", email: "sarah@test.com", group: "B", department: "Marketing", attendance: "Absent", scheduledStart: "09:30 AM", scheduledEnd: "06:30 PM", actualStart: "-", actualEnd: "-", totalHours: "0h 0m", location: "Remote", endLocation: "-", remarks: "Sick Leave", distance: "0", morningRemark: "-", eveningRemark: "-", morningOdo: "-", eveningOdo: "-", totalOdo: "0" },
  { id: 3, date: "2026-03-17", day: "Tuesday", name: "Michael Johnson", email: "michael@test.com", group: "A", department: "IT", attendance: "Present", scheduledStart: "10:00 AM", scheduledEnd: "07:00 PM", actualStart: "09:55 AM", actualEnd: "07:05 PM", totalHours: "9h 10m", location: "HQ", endLocation: "Home", remarks: "Server maintenance.", distance: "15", morningRemark: "Early", eveningRemark: "Late", morningOdo: "5000", eveningOdo: "5015", totalOdo: "15" },
  { id: 4, date: "2026-03-17", day: "Tuesday", name: "Emily Davis", email: "emily@test.com", group: "C", department: "HR", attendance: "Present", scheduledStart: "09:00 AM", scheduledEnd: "06:00 PM", actualStart: "09:05 AM", actualEnd: "06:00 PM", totalHours: "8h 55m", location: "Office", endLocation: "Gym", remarks: "Interviews all day.", distance: "8", morningRemark: "On Time", eveningRemark: "On Time", morningOdo: "340", eveningOdo: "348", totalOdo: "8" },
  { id: 5, date: "2026-03-17", day: "Tuesday", name: "David Wilson", email: "david@test.com", group: "B", department: "Finance", attendance: "Absent", scheduledStart: "09:30 AM", scheduledEnd: "06:30 PM", actualStart: "-", actualEnd: "-", totalHours: "0h 0m", location: "Office", endLocation: "-", remarks: "Personal Emergency", distance: "0", morningRemark: "-", eveningRemark: "-", morningOdo: "-", eveningOdo: "-", totalOdo: "0" },
  { id: 6, date: "2026-03-17", day: "Tuesday", name: "Jessica Brown", email: "jessica@test.com", group: "A", department: "Sales", attendance: "Present", scheduledStart: "09:00 AM", scheduledEnd: "06:00 PM", actualStart: "09:00 AM", actualEnd: "06:15 PM", totalHours: "9h 15m", location: "Field", endLocation: "Home", remarks: "Met 3 prospects.", distance: "45", morningRemark: "On Time", eveningRemark: "Late", morningOdo: "100", eveningOdo: "145", totalOdo: "45" },
  { id: 7, date: "2026-03-17", day: "Tuesday", name: "Robert Taylor", email: "robert@test.com", group: "C", department: "Support", attendance: "Present", scheduledStart: "02:00 PM", scheduledEnd: "11:00 PM", actualStart: "01:50 PM", actualEnd: "11:00 PM", totalHours: "9h 10m", location: "Remote", endLocation: "Remote", remarks: "Handled 40 tickets.", distance: "0", morningRemark: "Early", eveningRemark: "On Time", morningOdo: "-", eveningOdo: "-", totalOdo: "0" },
  { id: 8, date: "2026-03-17", day: "Tuesday", name: "Olivia Martinez", email: "olivia@test.com", group: "B", department: "Marketing", attendance: "Present", scheduledStart: "10:00 AM", scheduledEnd: "07:00 PM", actualStart: "10:15 AM", actualEnd: "07:00 PM", totalHours: "8h 45m", location: "Office", endLocation: "Home", remarks: "Campaign launch.", distance: "10", morningRemark: "Late", eveningRemark: "On Time", morningOdo: "890", eveningOdo: "900", totalOdo: "10" },
  { id: 9, date: "2026-03-17", day: "Tuesday", name: "William Anderson", email: "william@test.com", group: "A", department: "IT", attendance: "Present", scheduledStart: "09:00 AM", scheduledEnd: "06:00 PM", actualStart: "08:45 AM", actualEnd: "06:30 PM", totalHours: "9h 45m", location: "HQ", endLocation: "Home", remarks: "System deployment.", distance: "20", morningRemark: "Early", eveningRemark: "Late", morningOdo: "1500", eveningOdo: "1520", totalOdo: "20" },
  { id: 10, date: "2026-03-17", day: "Tuesday", name: "Sophia Thomas", email: "sophia@test.com", group: "C", department: "HR", attendance: "Absent", scheduledStart: "09:00 AM", scheduledEnd: "06:00 PM", actualStart: "-", actualEnd: "-", totalHours: "0h 0m", location: "Office", endLocation: "-", remarks: "Paid Leave", distance: "0", morningRemark: "-", eveningRemark: "-", morningOdo: "-", eveningOdo: "-", totalOdo: "0" },
  { id: 11, date: "2026-03-17", day: "Tuesday", name: "James Jackson", email: "james@test.com", group: "B", department: "Finance", attendance: "Present", scheduledStart: "09:30 AM", scheduledEnd: "06:30 PM", actualStart: "09:30 AM", actualEnd: "06:30 PM", totalHours: "9h 0m", location: "Office", endLocation: "Home", remarks: "Audit preparation.", distance: "14", morningRemark: "On Time", eveningRemark: "On Time", morningOdo: "2100", eveningOdo: "2114", totalOdo: "14" },
  { id: 12, date: "2026-03-17", day: "Tuesday", name: "Isabella White", email: "isabella@test.com", group: "A", department: "Sales", attendance: "Present", scheduledStart: "09:00 AM", scheduledEnd: "06:00 PM", actualStart: "09:20 AM", actualEnd: "05:40 PM", totalHours: "8h 20m", location: "Field", endLocation: "Home", remarks: "Traffic delay.", distance: "30", morningRemark: "Late", eveningRemark: "Left Early", morningOdo: "400", eveningOdo: "430", totalOdo: "30" },
  { id: 13, date: "2026-03-17", day: "Tuesday", name: "Benjamin Harris", email: "benjamin@test.com", group: "C", department: "Support", attendance: "Present", scheduledStart: "02:00 PM", scheduledEnd: "11:00 PM", actualStart: "02:00 PM", actualEnd: "11:15 PM", totalHours: "9h 15m", location: "Remote", endLocation: "Remote", remarks: "Extended call.", distance: "0", morningRemark: "On Time", eveningRemark: "Late", morningOdo: "-", eveningOdo: "-", totalOdo: "0" },
  { id: 14, date: "2026-03-17", day: "Tuesday", name: "Mia Martin", email: "mia@test.com", group: "B", department: "Marketing", attendance: "Present", scheduledStart: "10:00 AM", scheduledEnd: "07:00 PM", actualStart: "09:50 AM", actualEnd: "07:00 PM", totalHours: "9h 10m", location: "Office", endLocation: "Home", remarks: "-", distance: "11", morningRemark: "Early", eveningRemark: "On Time", morningOdo: "310", eveningOdo: "321", totalOdo: "11" },
  { id: 15, date: "2026-03-17", day: "Tuesday", name: "Lucas Garcia", email: "lucas@test.com", group: "A", department: "IT", attendance: "Absent", scheduledStart: "09:00 AM", scheduledEnd: "06:00 PM", actualStart: "-", actualEnd: "-", totalHours: "0h 0m", location: "HQ", endLocation: "-", remarks: "Half Day Leave", distance: "0", morningRemark: "-", eveningRemark: "-", morningOdo: "-", eveningOdo: "-", totalOdo: "0" },
];

const ITEMS_PER_PAGE = 10;

const Attendance = () => {
  const [data] = useState(initialData);
  const [searchQuery, setSearchQuery] = useState("");
  const [shiftFilter, setShiftFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

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
  }, [data, searchQuery, shiftFilter]);

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
          <h2 className="text-2xl font-extrabold text-gray-800">Attendance Log</h2>
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

      {/* MAIN CARD LIST */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-6xl mx-auto space-y-5">
          
          {paginatedData.length === 0 ? (
            <div className="text-center py-20">
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
                          <span className="font-bold text-gray-800">{item.distance} KM</span>
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