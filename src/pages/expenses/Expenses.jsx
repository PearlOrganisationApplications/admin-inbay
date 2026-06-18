import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Wallet,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Navigation,
  Eye,
  Car,
  Bike,
  FileText,
  Calendar,
  ChevronRight,
  X,
  Download
} from "lucide-react";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [report, setReport] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [month, setMonth] = useState(3)
  const [year, setYear] = useState(2026)
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [startDate, setStartDate] = useState("2026-05-01");
  const [endDate, setEndDate] = useState("2026-05-22");
  const [filterMode, setFilterMode] = useState("month");

  // const TOKEN = "293|0c9Zqwm4c3GUEolDbL4xUDIAmxOwIS5oMXJj27Ti5f332c16";
  const BASE_URL = "https://test.pearl-developer.com/Inbay_Innovations/public/api/admin/expenses";
  useEffect(() => {
    fetchInitialData(); // expenses list
  }, []);

  useEffect(() => {
    fetchReport();
  }, [month, year, startDate, endDate, filterMode]);



  const fetchInitialData = async () => {
    setLoading(true);

    try {
      // 1. Expenses List
      const token = localStorage.getItem("token");

      const res = await fetch(BASE_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const listData = await res.json();

      if (listData.success) {
        setExpenses(listData.data?.data || []);
      }

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchReport = async () => {
    setLoading(true);

    try {
      let url = "";

      // 📆 DATE RANGE FILTER (priority high)
      if (filterMode === "date" && startDate && endDate) {
        url = `${BASE_URL}/report?start_date=${startDate}&end_date=${endDate}`;
      }
      // 📅 MONTH/YEAR FILTER (default)
      else {
        url = `${BASE_URL}/report?month=${month}&year=${year}`;
      }

      const token = localStorage.getItem("token");

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (data.success) {
        setReport(data);
      }

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  const handleSelectAllEmployees = () => {
    const allIds = uniqueEmployees.map(emp => emp.id);

    if (selectedEmployees.length === allIds.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(allIds);
    }
  };


  const fetchExpenseDetail = async (id) => {
    setDetailLoading(true);
    setIsModalOpen(true);
    try {
      const res = await fetch(`${BASE_URL}/${id}`, {
        headers: { Authorization: `Bearer ${TOKEN}` },
      });
      const data = await res.json();
      if (data.success) setSelectedExpense(data.data);
    } catch (error) {
      console.error("Error fetching detail:", error);
    } finally {
      setDetailLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "approved": return "bg-green-100 text-green-700 border-green-200";
      case "rejected": return "bg-red-100 text-red-700 border-red-200";
      case "draft": return "bg-gray-100 text-gray-700 border-gray-200";
      default: return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };


  const uniqueEmployees = React.useMemo(() => {
    // Change 'expenses' to 'report?.employees'
    if (!report?.employees?.length) return [];

    const map = new Map();
    const list = [];

    report.employees.forEach((item) => {
      const user = item?.user;
      if (!user?.id) return;

      if (!map.has(user.id)) {
        map.set(user.id, true);
        list.push({
          id: user.id,
          name: user.name,
        });
      }
    });

    return list;
  }, [report]); // Depend on report cha

  const dropdownRef = React.useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowEmployeeDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredEmployeeOptions = React.useMemo(() => {
    return uniqueEmployees.filter((emp) =>
      emp.name?.toLowerCase()?.includes(employeeSearch.toLowerCase())
    );
  }, [uniqueEmployees, employeeSearch]);

  const travelBreakdown = React.useMemo(() => {
    if (!report?.employees) return [];

    const breakdownMap = {};

    report.employees.forEach((item) => {
      const mode =
        item?.expense_details?.travel_mode || "manual";

      const amount =
        Number(item?.expense_details?.total_expense || 0);

      if (!breakdownMap[mode]) {
        breakdownMap[mode] = {
          mode,
          count: 0,
          total_amount: 0,
        };
      }

      breakdownMap[mode].count += 1;
      breakdownMap[mode].total_amount += amount;
    });

    return Object.values(breakdownMap);
  }, [report]);



  const filteredEmployeesData = React.useMemo(() => {
    if (!report?.employees) return [];

    if (selectedEmployees.length === 0) {
      return report.employees;
    }

    return report.employees.filter((item) =>
      selectedEmployees.includes(item?.user?.id)
    );
  }, [report, selectedEmployees]);




  // EXPORT CSV
  const handleExport = () => {

    if (!report?.employees?.length) {
      return alert("No expense data available!");
    }

    const formatHeader = (key) => {
      return key
        .replace(/_/g, " ")
        .replace(/([A-Z])/g, " $1")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\b\w/g, (c) => c.toUpperCase());
    };

    const formattedData = report.employees.map((item, index) => {

      const details = item?.expense_details || {};

      // ALL FILE LINKS
      const attachmentLinks =
        item?.attachments?.length > 0
          ? item.attachments.join(" | ")
          : "No Files";

      // PDF LINKS
      const pdfLinks =
        item?.attachments
          ?.filter((file) =>
            file?.toLowerCase()?.endsWith(".pdf")
          )
          ?.join(" | ") || "No PDF";

      // DOC LINKS
      const docLinks =
        item?.attachments
          ?.filter((file) => {
            const lower = file?.toLowerCase() || "";

            return (
              lower.endsWith(".doc") ||
              lower.endsWith(".docx")
            );
          })
          ?.join(" | ") || "No Docs";

      return {
        sr_no: index + 1,

        expense_id: item?.expense_id || "N/A",

        employee_name: item?.user?.name || "N/A",

        email: item?.user?.email || "N/A",

        designation: item?.user?.designation || "N/A",

        team: item?.user?.team || "N/A",

        expense_type: details?.type || "N/A",

        travel_mode: details?.travel_mode || "Manual",

        expense_date: details?.expense_date || "N/A",

        start_date: details?.start_date || "N/A",

        end_date: details?.end_date || "N/A",

        departure_location:
          details?.departure_location || "N/A",

        arrival_location:
          Array.isArray(details?.arrival_location)
            ? details.arrival_location.join(" | ")
            : "N/A",

        mobile_bill: details?.mobile_bill || 0,

        toll: details?.toll || 0,

        courier: details?.courier || 0,

        vehicle: details?.vehicle || 0,

        hotel: details?.hotel || 0,

        others: details?.others || 0,

        fuel: details?.fuel || 0,

        da: details?.da || 0,

        total_km: details?.total_km || 0,

        total_expense: details?.total_expense || 0,

        remarks: details?.remarks || "N/A",

        pdf_links: pdfLinks,

        doc_links: docLinks,

        all_attachments: attachmentLinks,

        created_at: item?.created_at || "N/A",
      };
    });
    if (!formattedData.length) {
      return alert("No formatted data!");
    }

    const rawKeys = Object.keys(formattedData[0]);

    const headers = rawKeys.map(formatHeader).join(",");

    const rows = formattedData
      .map((obj) =>
        Object.values(obj)
          .map((val) => `"${String(val ?? "").replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const csv = headers + "\n" + rows;

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download =
      filterMode === "date"
        ? `expense_report_${startDate}_to_${endDate}.csv`
        : `expense_report_${month}_${year}.csv`;

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

    window.URL.revokeObjectURL(url);
  };



  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
    </div>
  );

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans pb-20">
      {/* HEADER SECTION */}
      <div className="mb-8 flex flex-col lg:flex-row lg:items-start justify-between gap-6">

        {/* LEFT TITLE */}
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            <Wallet className="text-purple-600 w-8 h-8" />
            Expense Management
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Track and manage employee reimbursement claims
          </p>
        </div>

        {/* CENTER CONTROLS */}
        <div className="flex flex-col gap-4 w-full lg:w-auto">

          {/* FILTER TOGGLE */}
          <div className="flex gap-2 bg-gray-100 p-1 rounded-xl w-fit">
            <button
              onClick={() => setFilterMode("month")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition ${filterMode === "month"
                ? "bg-purple-600 text-white"
                : "text-gray-600"
                }`}
            >
              Month
            </button>

            <button
              onClick={() => setFilterMode("date")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition ${filterMode === "date"
                ? "bg-purple-600 text-white"
                : "text-gray-600"
                }`}
            >
              Date Range
            </button>
          </div>

          {/* MONTH FILTER */}
          {filterMode === "month" && (
            <div className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm border">
              <Calendar className="text-purple-600 w-5 h-5 ml-2" />

              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="font-bold text-gray-700 bg-transparent outline-none cursor-pointer"
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
                className="font-bold text-gray-700 bg-transparent outline-none cursor-pointer"
              >
                <option value={2024}>2024</option>
                <option value={2025}>2025</option>
                <option value={2026}>2026</option>
                <option value={2027}>2027</option>
              </select>
            </div>
          )}

          {/* DATE RANGE FILTER */}
          {filterMode === "date" && (
            <div className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm border">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border p-2 rounded-lg text-sm"
              />

              <span className="text-gray-400 text-sm">to</span>

              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border p-2 rounded-lg text-sm"
              />
            </div>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col gap-4 items-end">

          {/* EMPLOYEE DROPDOWN */}
          <div ref={dropdownRef} className="relative w-full md:w-80">

            <div
              onClick={() => setShowEmployeeDropdown(!showEmployeeDropdown)}
              className="w-full min-h-[46px] bg-white border rounded-xl px-3 py-2 flex items-center justify-between cursor-pointer shadow-sm"
            >
              {selectedEmployees.length === 0 ? (
                <span className="text-sm text-gray-400">
                  Search & Select Employees
                </span>
              ) : (
                <span className="text-sm font-semibold text-purple-600">
                  {selectedEmployees.length} Selected
                </span>
              )}
            </div>

            {showEmployeeDropdown && (
              <div className="absolute top-full mt-2 left-0 w-full bg-white border rounded-2xl shadow-xl z-50 p-3">
                <input
                  type="text"
                  value={employeeSearch}
                  onChange={(e) => setEmployeeSearch(e.target.value)}
                  placeholder="Search employee..."
                  className="w-full border p-2 rounded-lg text-sm mb-2 outline-none focus:ring-2 focus:ring-purple-500"
                />

                <div className="max-h-60 overflow-y-auto space-y-1">
                  <div className="flex items-center justify-between mb-2 px-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={
                          selectedEmployees.length === uniqueEmployees.length &&
                          uniqueEmployees.length > 0
                        }
                        onChange={handleSelectAllEmployees}
                      />
                      <span className="text-xs font-bold text-gray-600">
                        Select All
                      </span>
                    </label>
                  </div>
                  {filteredEmployeeOptions.length === 0 ? (
                    <p className="text-sm text-gray-400 p-2">
                      No employees available
                    </p>
                  ) : (
                    filteredEmployeeOptions.map((user) => (
                      <label
                        key={user.id}
                        className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedEmployees.includes(user.id)}
                          onChange={() =>
                            setSelectedEmployees((prev) =>
                              prev.includes(user.id)
                                ? prev.filter((id) => id !== user.id)
                                : [...prev, user.id]
                            )
                          }
                        />
                        <span className="text-sm">{user.name}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* EXPORT BUTTON */}
          <button
            onClick={handleExport}
            className="bg-purple-600 text-white px-5 py-3 rounded-xl text-sm font-bold hover:bg-purple-700 transition-all shadow-md flex items-center gap-2"
          >
            <Download size={18} />
            Export CSV
          </button>
        </div>

      </div>
      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Amount"
          value={`₹${report?.summary?.total_amount || 0}`}
          icon={<LayoutDashboard />}
          color="bg-purple-600"
        />

        <StatsCard
          title="Approved"
          value={`₹${report?.summary?.approved_amount || 0}`}
          icon={<CheckCircle />}
          color="bg-green-600"
        />

        <StatsCard
          title="Rejected"
          value={`₹${report?.summary?.rejected_amount || 0}`}
          icon={<XCircle />}
          color="bg-red-600"
        />

        <StatsCard
          title="Total Expenses"
          value={report?.summary?.total_expenses || 0}
          icon={<Clock />}
          color="bg-orange-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* TRAVEL BREAKDOWN */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Navigation className="w-5 h-5 text-purple-600" /> Travel Breakdown
            </h3>
            <div className="space-y-4">
              {travelBreakdown?.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      {item.mode === "car" ? <Car className="text-blue-500" /> : <Bike className="text-orange-500" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-700 capitalize">{item.mode}</p>
                      <p className="text-xs text-gray-500">{item.count} Trips</p>
                    </div>
                  </div>
                  <p className="font-black text-gray-900">₹{item.total_amount}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* EXPENSES LIST */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <h3 className="font-bold text-gray-800 text-lg">Recent Expenses</h3>
              <button className="text-purple-600 text-sm font-bold hover:underline">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">User</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Travel Details</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
                    {/* <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase">Action</th> */}
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Attachments</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredEmployeesData.map((item) => (
                    <tr key={item.expense_id}>

                      {/* USER */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                            {item.user?.name?.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">
                              {item.user?.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {item.user?.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* TRAVEL / EXPENSE COUNT */}
                      <td className="px-6 py-4">
                        <p className="text-sm font-black">
                          {item.expense_details?.travel_mode || "manual"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.expense_details?.expense_date}
                        </p>
                      </td>

                      {/* AMOUNT */}
                      <td className="px-6 py-4">
                        <p className="text-sm font-black">
                          ₹{item.expense_details?.total_expense || 0}
                        </p>
                      </td>

                      {/* STATUS (API me status nahi hai so fallback) */}
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-bold border bg-gray-100 text-gray-600 border-gray-200">
                          NA
                        </span>
                      </td>

                      {/* ACTION */}
                      {/* <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => fetchExpenseDetail(item.expense_id)}
                          className="text-purple-600 font-bold text-sm hover:underline"
                        >
                          View
                        </button>
                      </td> */}
                      <td className="px-6 py-4">
                        <div className="flex gap-2 flex-wrap">
                          {item.attachments?.length > 0 ? (
                            item.attachments.map((file, i) => {
                              const isPdf = file.toLowerCase().includes(".pdf");

                              return (
                                <a
                                  key={i}
                                  href={file}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full font-semibold
                       bg-purple-50 text-purple-700 border border-purple-200
                       hover:bg-purple-100 transition"
                                >
                                  {isPdf ? (
                                    <FileText size={14} className="text-red-500" />
                                  ) : (
                                    <Eye size={14} className="text-blue-500" />
                                  )}

                                  <span>
                                    {isPdf ? "PDF" : "Doc"}
                                  </span>
                                </a>
                              );
                            })
                          ) : (
                            <span className="text-xs text-gray-400">No attachments</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* DETAIL MODAL (SIDE OVER) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-white h-full shadow-2xl animate-slide-in p-0 flex flex-col">
            {detailLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-purple-600"></div>
              </div>
            ) : selectedExpense && (
              <>
                <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                  <h2 className="text-xl font-bold text-gray-900">Expense Details</h2>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                    <X className="w-6 h-6 text-gray-500" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                  {/* User Profile Info */}
                  <div className="flex items-center gap-4 bg-purple-50 p-4 rounded-2xl">
                    <div className="w-16 h-16 rounded-full bg-purple-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg">
                      {selectedExpense.user.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-gray-900">{selectedExpense.user.name}</h4>
                      <p className="text-sm text-purple-600 font-bold">{selectedExpense.user.email}</p>
                    </div>
                  </div>

                  {/* Route Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <DetailItem label="From" value={selectedExpense?.expense_details?.departure_location} icon={<MapPin className="text-red-500" />} />
                    <DetailItem label="To" value={selectedExpense?.expense_details?.arrival_location} icon={<MapPin className="text-green-500" />} />
                  </div>

                  <div className="bg-gray-50 p-5 rounded-2xl grid grid-cols-2 gap-y-6">
                    <DetailItem label="Travel Mode" value={selectedExpense.travel_mode} icon={<Car className="text-purple-600 w-4 h-4" />} isCompact />
                    <DetailItem label="Total Distance" value={`${selectedExpense?.expense_details?.distance} ${selectedExpense?.expense_details?.distance_unit}`} icon={<Navigation className="text-purple-600 w-4 h-4" />} isCompact />
                    <DetailItem label="DA Amount" value={`₹${selectedExpense?.expense_details?.da}`} icon={<Wallet className="text-purple-600 w-4 h-4" />} isCompact />
                    <DetailItem label="Hotel Cost" value={`₹${selectedExpense?.expense_details?.hotel_cost}`} icon={<Wallet className="text-purple-600 w-4 h-4" />} isCompact />
                  </div>

                  {/* Total Amount Focus */}
                  <div className="border-2 border-dashed border-purple-200 p-6 rounded-2xl flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase">Total Reclaimable</p>
                      <p className="text-3xl font-black text-gray-900">₹{selectedExpense.total_amount}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase border ${getStatusColor(selectedExpense.status)}`}>
                      {selectedExpense.status}
                    </span>
                  </div>

                  {/* Purpose */}
                  <div>
                    <h5 className="text-xs font-bold text-gray-400 uppercase mb-2">Purpose of visit</h5>
                    <p className="text-gray-700 bg-gray-50 p-4 rounded-xl italic">"{selectedExpense.purpose || "No purpose provided"}"</p>
                  </div>

                  {/* Photos */}
                  <div>
                    <h5 className="text-xs font-bold text-gray-400 uppercase mb-3">Attachments & Proofs</h5>
                    {selectedExpense?.attachments?.length > 0 ? (
                      <div className="grid grid-cols-2 gap-3">
                        {selectedExpense.attachments.map((file, i) => {

                          const isPdf =
                            file.toLowerCase().includes(".pdf");

                          const isDoc =
                            file.toLowerCase().includes(".doc") ||
                            file.toLowerCase().includes(".docx");

                          return (
                            <a
                              key={i}
                              href={file}
                              target="_blank"
                              rel="noreferrer"
                              className="border rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition"
                            >
                              <FileText
                                className={
                                  isPdf
                                    ? "text-red-500"
                                    : "text-blue-500"
                                }
                              />

                              <span className="text-xs font-bold text-center break-all">
                                {isPdf
                                  ? "PDF File"
                                  : isDoc
                                    ? "DOC File"
                                    : "Attachment"}
                              </span>
                            </a>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">
                        No attachments
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// UI COMPONENTS
const StatsCard = ({ title, value, icon, color, subtext }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5">
    <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
      {React.cloneElement(icon, { size: 28 })}
    </div>
    <div>
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{title}</p>
      <p className="text-2xl font-black text-gray-900">{value}</p>
      {subtext && <p className="text-[10px] font-bold text-gray-400 mt-0.5">{subtext}</p>}
    </div>
  </div>
);

const DetailItem = ({ label, value, icon, isCompact }) => (
  <div className="flex gap-3">
    {icon && <div className={`mt-0.5 ${!isCompact && 'p-2 bg-gray-50 rounded-lg'}`}>{icon}</div>}
    <div>
      <p className="text-[10px] font-bold text-gray-400 uppercase">{label}</p>
      <p className={`${isCompact ? 'text-sm' : 'text-md'} font-bold text-gray-800 capitalize`}>{value || "N/A"}</p>
    </div>
  </div>
);

export default Expenses;