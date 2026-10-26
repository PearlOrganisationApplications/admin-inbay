import React, { useState, useEffect, useRef } from "react";
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
  X,
  Download,
  Search,
  ChevronDown,
} from "lucide-react";
import { fetchExpenseDetail, fetchReport } from "./expenseApis";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const YEARS = [2024, 2025, 2026, 2027];

const Expenses = () => {
  const [report, setReport] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [month, setMonth] = useState(3);
  const [year, setYear] = useState(2026);
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [startDate, setStartDate] = useState("2026-05-01");
  const [endDate, setEndDate] = useState("2026-05-22");
  const [filterMode, setFilterMode] = useState("month");
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  /* FETCH REPORT */
  useEffect(() => {
    fetchReport(
      month,
      year,
      startDate,
      endDate,
      filterMode,
      setReport,
      setLoading,
    );
  }, [month, year, startDate, endDate, filterMode]);

  /* CLOSE EMPLOYEE DROPDOWN WHEN CLICKING OUTSIDE */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowEmployeeDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* VIEW EXPENSE DETAIL */
  const handleViewExpense = (id) => {
    fetchExpenseDetail(
      id,
      setSelectedExpense,
      setDetailLoading,
      setIsModalOpen,
    );
  };

  /* STATUS COLOR */
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-700 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200";
      case "draft":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  /* UNIQUE EMPLOYEES */
  const uniqueEmployees = (() => {
    if (!report?.employees?.length) return [];
    const map = new Map();
    const list = [];
    report.employees.forEach((item) => {
      const user = item?.user;
      if (!user?.id) return;
      if (!map.has(user.id)) {
        map.set(user.id, true);
        list.push({ id: user.id, name: user.name });
      }
    });
    return list;
  })();

  /* FILTER EMPLOYEE OPTIONS */
  const filteredEmployeeOptions = uniqueEmployees.filter((emp) =>
    emp.name?.toLowerCase()?.includes(employeeSearch.toLowerCase()),
  );

  /* TRAVEL BREAKDOWN */
  const travelBreakdown = (() => {
    if (!report?.employees) return [];
    const breakdownMap = {};
    report.employees.forEach((item) => {
      const mode = item?.expense_details?.travel_mode || "manual";
      const amount = Number(item?.expense_details?.total_expense || 0);
      if (!breakdownMap[mode]) {
        breakdownMap[mode] = { mode, count: 0, total_amount: 0 };
      }
      breakdownMap[mode].count += 1;
      breakdownMap[mode].total_amount += amount;
    });
    return Object.values(breakdownMap);
  })();

  /* FILTERED EMPLOYEE DATA */
  const filteredEmployeesData = !report?.employees
    ? []
    : selectedEmployees.length === 0
      ? report.employees
      : report.employees.filter((item) =>
          selectedEmployees.includes(item?.user?.id),
        );

  /* SELECT / DESELECT ALL EMPLOYEES */
  const handleSelectAllEmployees = () => {
    const allIds = uniqueEmployees.map((emp) => emp.id);
    if (selectedEmployees.length === allIds.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(allIds);
    }
  };

  /* EXPORT CSV */
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

      const attachmentLinks =
        item?.attachments?.length > 0 ? item.attachments.join(" | ") : "No Files";

      const pdfLinks =
        item?.attachments
          ?.filter((file) => file?.toLowerCase()?.endsWith(".pdf"))
          ?.join(" | ") || "No PDF";

      const docLinks =
        item?.attachments
          ?.filter((file) => {
            const lower = file?.toLowerCase() || "";
            return lower.endsWith(".doc") || lower.endsWith(".docx");
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
        departure_location: details?.departure_location || "N/A",
        arrival_location: Array.isArray(details?.arrival_location)
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
          .join(","),
      )
      .join("\n");

    const csv = headers + "\n" + rows;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
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

  /* LOADING */
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans pb-20">
      {/* HEADER SECTION */}
      <div className="mb-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6 flex flex-col xl:flex-row xl:items-center justify-between gap-5">
        {/* LEFT TITLE */}
        <div className="shrink-0">
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            <Wallet className="text-purple-600 w-8 h-8" />
            Expense Management
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Track and manage employee reimbursement claims
          </p>
        </div>

        {/* RIGHT CONTROLS: Filter -> Export -> Search */}
        <div className="flex flex-col md:flex-row md:flex-wrap md:items-center xl:justify-end gap-3">
          {/* FILTER TOGGLE */}
          <div className="flex h-11 items-center gap-1 bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setFilterMode("month")}
              className={`h-full px-4 rounded-lg text-sm font-bold transition ${
                filterMode === "month"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setFilterMode("date")}
              className={`h-full px-4 rounded-lg text-sm font-bold transition whitespace-nowrap ${
                filterMode === "date"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Date Range
            </button>
          </div>

          {/* MONTH FILTER */}
          {filterMode === "month" && (
            <div className="flex h-11 items-center gap-2 bg-white px-3 rounded-xl border border-gray-200 shadow-sm">
              <Calendar className="text-purple-600 w-5 h-5" />
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="font-bold text-sm text-gray-700 bg-transparent outline-none cursor-pointer"
              >
                {MONTHS.map((m, i) => (
                  <option key={m} value={i + 1}>
                    {m}
                  </option>
                ))}
              </select>
              <span className="h-5 w-px bg-gray-200" />
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="font-bold text-sm text-gray-700 bg-transparent outline-none cursor-pointer"
              >
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* DATE RANGE FILTER */}
          {filterMode === "date" && (
            <div className="flex h-11 items-center gap-2 bg-white px-3 rounded-xl border border-gray-200 shadow-sm">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="text-sm font-semibold text-gray-700 bg-transparent outline-none"
              />
              <span className="text-gray-400 text-sm">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="text-sm font-semibold text-gray-700 bg-transparent outline-none"
              />
            </div>
          )}

          {/* EXPORT BUTTON (before search) */}
          <button
            onClick={handleExport}
            className="h-11 bg-purple-600 text-white px-5 rounded-xl text-sm font-bold hover:bg-purple-700 active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Download size={18} />
            Export CSV
          </button>

          {/* EMPLOYEE SEARCH & SELECT */}
          <div ref={dropdownRef} className="relative w-full md:w-72">
            <div
              onClick={() => {
                setShowEmployeeDropdown(true);
                searchInputRef.current?.focus();
              }}
              className={`h-11 w-full bg-white border rounded-xl px-3 flex items-center gap-2 shadow-sm cursor-text transition ${
                showEmployeeDropdown
                  ? "border-purple-500 ring-2 ring-purple-100"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={employeeSearch}
                onChange={(e) => {
                  setEmployeeSearch(e.target.value);
                  setShowEmployeeDropdown(true);
                }}
                onFocus={() => setShowEmployeeDropdown(true)}
                placeholder={
                  selectedEmployees.length > 0
                    ? `${selectedEmployees.length} employee(s) selected`
                    : "Search & select employees"
                }
                className="flex-1 min-w-0 bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-400"
              />
              {selectedEmployees.length > 0 && (
                <button
                  type="button"
                  title="Clear selection"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedEmployees([]);
                  }}
                  className="flex items-center gap-1 text-[11px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full hover:bg-purple-200 shrink-0"
                >
                  {selectedEmployees.length}
                  <X className="w-3 h-3" />
                </button>
              )}
              <ChevronDown
                className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${
                  showEmployeeDropdown ? "rotate-180" : ""
                }`}
              />
            </div>

            {showEmployeeDropdown && (
              <div className="absolute top-full mt-2 right-0 w-full min-w-[260px] bg-white border border-gray-100 rounded-2xl shadow-xl z-50 p-3">
                <div className="flex items-center justify-between mb-2 px-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="accent-purple-600"
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
                  <span className="text-[11px] text-gray-400 font-semibold">
                    {selectedEmployees.length}/{uniqueEmployees.length}
                  </span>
                </div>

                <div className="max-h-60 overflow-y-auto space-y-1">
                  {filteredEmployeeOptions.length === 0 ? (
                    <p className="text-sm text-gray-400 p-2">
                      No employees available
                    </p>
                  ) : (
                    filteredEmployeeOptions.map((user) => (
                      <label
                        key={user.id}
                        className="flex items-center gap-2 p-2 hover:bg-purple-50 rounded-lg cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          className="accent-purple-600"
                          checked={selectedEmployees.includes(user.id)}
                          onChange={() =>
                            setSelectedEmployees((prev) =>
                              prev.includes(user.id)
                                ? prev.filter((id) => id !== user.id)
                                : [...prev, user.id],
                            )
                          }
                        />
                        <span className="text-sm text-gray-700">
                          {user.name}
                        </span>
                      </label>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
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
              <Navigation className="w-5 h-5 text-purple-600" />
              Travel Breakdown
            </h3>
            <div className="space-y-4">
              {travelBreakdown?.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      {item.mode === "car" ? (
                        <Car className="text-blue-500" />
                      ) : (
                        <Bike className="text-orange-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-700 capitalize">
                        {item.mode}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.count} Trips
                      </p>
                    </div>
                  </div>
                  <p className="font-black text-gray-900">
                    ₹{item.total_amount}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* EXPENSES LIST */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <h3 className="font-bold text-gray-800 text-lg">
                Recent Expenses
              </h3>
              <button className="text-purple-600 text-sm font-bold hover:underline">
                View All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">
                      Travel Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">
                      Attachments
                    </th>
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

                      {/* TRAVEL */}
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
                          ₹ {item.expense_details?.total_expense || 0}
                        </p>
                      </td>

                      {/* STATUS */}
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-bold border bg-gray-100 text-gray-600 border-gray-200">
                          NA
                        </span>
                      </td>

                      {/* ATTACHMENT VIEW */}
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleViewExpense(item.expense_id)}
                          className="text-purple-600 font-bold text-sm hover:underline"
                        >
                          View
                        </button>
                        <div className="flex gap-2 flex-wrap mt-2">
                          {item.attachments?.length > 0 ? (
                            item.attachments.map((file, i) => {
                              const isPdf = file.toLowerCase().includes(".pdf");
                              return (
                                <a
                                  key={i}
                                  href={file}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full font-semibold bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition"
                                >
                                  {isPdf ? (
                                    <FileText
                                      size={14}
                                      className="text-red-500"
                                    />
                                  ) : (
                                    <Eye size={14} className="text-blue-500" />
                                  )}
                                  <span>{isPdf ? "PDF" : "Doc"}</span>
                                </a>
                              );
                            })
                          ) : (
                            <span className="text-xs text-gray-400">
                              No attachments
                            </span>
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

      {/* DETAIL MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-white h-full shadow-2xl animate-slide-in p-0 flex flex-col">
            {detailLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-purple-600"></div>
              </div>
            ) : (
              selectedExpense && (
                <>
                  {/* MODAL HEADER */}
                  <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                    <h2 className="text-xl font-bold text-gray-900">
                      Expense Details
                    </h2>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      <X className="w-6 h-6 text-gray-500" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* USER PROFILE */}
                    <div className="flex items-center gap-4 bg-purple-50 p-4 rounded-2xl">
                      <div className="w-16 h-16 rounded-full bg-purple-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg">
                        {selectedExpense.user?.name?.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-gray-900">
                          {selectedExpense.user?.name}
                        </h4>
                        <p className="text-sm text-purple-600 font-bold">
                          {selectedExpense.user?.email}
                        </p>
                      </div>
                    </div>

                    {/* ROUTE DETAILS */}
                    <div className="grid grid-cols-2 gap-4">
                      <DetailItem
                        label="From"
                        value={
                          selectedExpense?.expense_details?.departure_location
                        }
                        icon={<MapPin className="text-red-500" />}
                      />
                      <DetailItem
                        label="To"
                        value={
                          selectedExpense?.expense_details?.arrival_location
                        }
                        icon={<MapPin className="text-green-500" />}
                      />
                    </div>

                    {/* TRAVEL INFO */}
                    <div className="bg-gray-50 p-5 rounded-2xl grid grid-cols-2 gap-y-6">
                      <DetailItem
                        label="Travel Mode"
                        value={
                          selectedExpense.travel_mode ||
                          selectedExpense?.expense_details?.travel_mode
                        }
                        icon={<Car className="text-purple-600 w-4 h-4" />}
                        isCompact
                      />
                      <DetailItem
                        label="Total Distance"
                        value={`${selectedExpense?.expense_details?.distance || 0} ${selectedExpense?.expense_details?.distance_unit || ""}`}
                        icon={
                          <Navigation className="text-purple-600 w-4 h-4" />
                        }
                        isCompact
                      />
                      <DetailItem
                        label="DA Amount"
                        value={`₹${selectedExpense?.expense_details?.da || 0}`}
                        icon={<Wallet className="text-purple-600 w-4 h-4" />}
                        isCompact
                      />
                      <DetailItem
                        label="Hotel Cost"
                        value={`₹${selectedExpense?.expense_details?.hotel_cost || 0}`}
                        icon={<Wallet className="text-purple-600 w-4 h-4" />}
                        isCompact
                      />
                    </div>

                    {/* TOTAL */}
                    <div className="border-2 border-dashed border-purple-200 p-6 rounded-2xl flex justify-between items-center">
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase">
                          Total Reclaimable
                        </p>
                        <p className="text-3xl font-black text-gray-900">
                          ₹{" "}
                          {selectedExpense.total_amount ||
                            selectedExpense?.expense_details?.total_expense ||
                            0}
                        </p>
                      </div>
                      <span
                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase border ${getStatusColor(selectedExpense.status)}`}
                      >
                        {selectedExpense.status || "NA"}
                      </span>
                    </div>

                    {/* PURPOSE */}
                    <div>
                      <h5 className="text-xs font-bold text-gray-400 uppercase mb-2">
                        Purpose of visit
                      </h5>
                      <p className="text-gray-700 bg-gray-50 p-4 rounded-xl italic">
                        &ldquo;{selectedExpense.purpose || "No purpose provided"}
                        &rdquo;
                      </p>
                    </div>

                    {/* ATTACHMENTS */}
                    <div>
                      <h5 className="text-xs font-bold text-gray-400 uppercase mb-3">
                        Attachments & Proofs
                      </h5>
                      {selectedExpense?.attachments?.length > 0 ? (
                        <div className="grid grid-cols-2 gap-3">
                          {selectedExpense.attachments.map((file, i) => {
                            const isPdf = file.toLowerCase().includes(".pdf");
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
                                    isPdf ? "text-red-500" : "text-blue-500"
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
                        <p className="text-sm text-gray-400">No attachments</p>
                      )}
                    </div>
                  </div>
                </>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/* STATS CARD */
const StatsCard = ({ title, value, icon, color, subtext }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5">
    <div
      className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center text-white shadow-lg`}
    >
      {React.cloneElement(icon, { size: 28 })}
    </div>
    <div>
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
        {title}
      </p>
      <p className="text-2xl font-black text-gray-900">{value}</p>
      {subtext && (
        <p className="text-[10px] font-bold text-gray-400 mt-0.5">{subtext}</p>
      )}
    </div>
  </div>
);

/* DETAIL ITEM */
const DetailItem = ({ label, value, icon, isCompact }) => (
  <div className="flex gap-3">
    {icon && (
      <div className={`mt-0.5 ${!isCompact && "p-2 bg-gray-50 rounded-lg"}`}>
        {icon}
      </div>
    )}
    <div>
      <p className="text-[10px] font-bold text-gray-400 uppercase">{label}</p>
      <p
        className={`${isCompact ? "text-sm" : "text-md"} font-bold text-gray-800 capitalize`}
      >
        {value || "N/A"}
      </p>
    </div>
  </div>
);

export default Expenses;