import React, { useEffect, useState, useMemo } from "react";
import {
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  Users,
  UserCheck,
  UserX,
  Eye,
  Plus,
  X,
  CheckCircle,
  XCircle,
  ShieldCheck, // Icon for Manager
} from "lucide-react";

const ITEMS_PER_PAGE = 10;

const Manager = () => {
  const [managers, setManagers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    hq: "",
  });
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedManagerData, setSelectedManagerData] = useState(null);

  useEffect(() => {
    fetchManagers();
  }, []);

  const handleViewManager = async (managerId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://test.pearl-developer.com/Inbay_Innovations/public/api/admin/manager/${managerId}/users`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (response.ok) {
        setSelectedManagerData(result.data);
        setViewModalOpen(true);
      } else {
        showToast("Failed to fetch manager details", "error");
      }
    } catch (error) {
      showToast("Error fetching manager details", "error");
    }
  };

  const fetchManagers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://test.pearl-developer.com/Inbay_Innovations/public/api/admin/managers",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      const data = await response.json();
      setManagers(Array.isArray(data) ? data : data?.data || []);
    } catch (error) {
      console.error("Manager API error:", error);
    }
  };

  const toggleManagerStatus = async (managerId, currentIsActive) => {
    try {
      const token = localStorage.getItem("token");
      const newStatus = currentIsActive === 1 ? 0 : 1;

      const response = await fetch(
        "https://test.pearl-developer.com/Inbay_Innovations/public/api/admin/manager-status",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: managerId,
            is_active: newStatus,
          }),
        },
      );

      if (response.ok) {
        showToast(
          `Manager ${newStatus === 1 ? "Activated" : "Deactivated"} successfully!`,
          "success",
        );
        fetchManagers();
      } else {
        showToast("Failed to update manager status", "error");
      }
    } catch (error) {
      showToast("Error connecting to server", "error");
    }
  };

  const handleCreateManager = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://test.pearl-developer.com/Inbay_Innovations/public/api/admin/create-manager",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      const result = await response.json();

      if (response.ok) {
        showToast("Manager created successfully!", "success");
        setIsModalOpen(false);
        setFormData({ name: "", email: "", password: "" });
        fetchManagers();
      } else {
        showToast(result.message || "Failed to create manager", "error");
      }
    } catch (error) {
      showToast("An error occurred. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const uniqueRoles = useMemo(() => {
    const roles = managers.map((m) => m.role).filter(Boolean);
    return [...new Set(roles)];
  }, [managers]);

  const filteredManagers = useMemo(() => {
    return managers.filter((m) => {
      const matchesSearch =
        m.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.email?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === "" || m.role === roleFilter;

      const isActive = Number(m.is_active) === 1;
      const matchesStatus =
        statusFilter === "" ||
        (statusFilter === "Active" ? isActive : !isActive);
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [managers, searchQuery, roleFilter, statusFilter]);

  const totalManagers = filteredManagers.length;
  const activeManagers = filteredManagers.filter((m) => Number(m.is_active) === 1).length;
  const inactiveManagers = filteredManagers.filter((m) => Number(m.is_active) !== 1).length;

  const totalPages = Math.ceil(filteredManagers.length / ITEMS_PER_PAGE) || 1;
  const paginatedManagers = filteredManagers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };
  const handleRoleFilter = (e) => {
    setRoleFilter(e.target.value);
    setCurrentPage(1);
  };
  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleExport = () => {
    if (filteredManagers.length === 0) return alert("No data to export!");
    const headers = ["ID", "Name", "Email", "Role", "Status"];
    const rows = filteredManagers
      .map((m) => {
        const status = Number(m.is_active) === 1 ? "Active" : "Inactive";
        return `"${m.id}","${m.name}","${m.email}","${m.role}","${status}"`;
      })
      .join("\n");
    const csv = headers.join(",") + "\n" + rows;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "managers_list.csv";
    a.click();
  };

  // Helper to get the single user to display
  const displayUser = selectedManagerData?.assigned_users?.[0];

  return (
    <div className="bg-gray-50 h-screen flex flex-col font-sans relative">
      {toast.show && (
        <div
          className={`fixed top-5 right-5 z-[110] px-6 py-3 rounded-lg shadow-lg text-white transition-all transform animate-bounce ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}
        >
          {toast.message}
        </div>
      )}

      {/* Header Section */}
      <div className="bg-white px-6 py-4 shadow-sm border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 flex-shrink-0 z-10">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800">
            Manager Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage manager access, roles, and account status
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2"
          >
            <Plus size={16} /> Create Manager
          </button>
          <button
            onClick={handleExport}
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2"
          >
            <Download size={16} /> Export Data
          </button>
        </div>
      </div>

      {/* Search & Filter Section */}
      <div className="bg-white px-6 py-4 shadow-sm border-b border-gray-100 flex flex-col md:flex-row gap-4 items-center z-0 flex-shrink-0">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search Manager by Name or Email..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all"
          />
        </div>
        <div className="flex w-full md:w-auto gap-3">
          <div className="relative w-full md:w-48">
            <Filter className="absolute left-3 top-2.5 text-indigo-500" size={18} />
            <select
              value={roleFilter}
              onChange={handleRoleFilter}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white cursor-pointer transition-all appearance-none"
            >
              <option value="">All Roles</option>
              {uniqueRoles.map((role, idx) => (
                <option key={idx} value={role}>{role}</option>
              ))}
            </select>
          </div>
          <select
            value={statusFilter}
            onChange={handleStatusFilter}
            className="w-full md:w-40 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white cursor-pointer transition-all appearance-none"
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-2xl p-5 border border-indigo-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                <ShieldCheck size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Managers</p>
                <h3 className="text-2xl font-extrabold text-gray-900">{totalManagers}</h3>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-green-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                <UserCheck size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Active Managers</p>
                <h3 className="text-2xl font-extrabold text-gray-900">{activeManagers}</h3>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-red-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                <UserX size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Inactive Managers</p>
                <h3 className="text-2xl font-extrabold text-gray-900">{inactiveManagers}</h3>
              </div>
            </div>
          </div>

          {paginatedManagers.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-gray-500 text-lg font-medium">No managers found.</p>
              <button
                onClick={() => { setSearchQuery(""); setRoleFilter(""); setStatusFilter(""); }}
                className="text-indigo-600 mt-2 hover:underline font-medium"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-left text-gray-600 border-b border-gray-200">
                    <tr>
                      <th className="p-4 font-semibold uppercase tracking-wider text-xs">Manager</th>
                      <th className="p-4 font-semibold uppercase tracking-wider text-xs">Email</th>
                      <th className="p-4 font-semibold uppercase tracking-wider text-xs">Role</th>
                      <th className="p-4 font-semibold uppercase tracking-wider text-xs"> Headquarters</th>
                      <th className="p-4 font-semibold uppercase tracking-wider text-xs">Status</th>
                      <th className="p-4 font-semibold uppercase tracking-wider text-xs text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedManagers.map((m) => (
                      <tr key={m.id} className="hover:bg-indigo-50/50 transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full border border-gray-200 shadow-sm bg-gray-100 flex items-center justify-center text-indigo-400 font-bold">
                            {m.name.charAt(0)}
                          </div>
                          <span className="font-bold text-gray-800">{m.name}</span>
                        </td>
                        <td className="p-4 text-gray-500">{m.email}</td>
                        <td className="p-4">
                          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-xs font-medium border border-gray-200">
                            {m.role || "Manager"}
                          </span>
                        </td>
                        <td className="p-4 text-gray-600 font-medium text-center">
                          {m.hq || "N/A"}
                        </td>
                        <td className="p-4">
                          <span className={`text-xs px-3 py-1 rounded-full font-bold border ${Number(m.is_active) === 1 ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>
                            {Number(m.is_active) === 1 ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="p-4 text-center flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleViewManager(m.id)}
                            className="p-2 text-blue-600 bg-blue-50 rounded-full hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => toggleManagerStatus(m.id, Number(m.is_active))}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm border flex items-center gap-1 ${Number(m.is_active) === 1
                              ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-600 hover:text-white"
                              : "bg-green-50 text-green-600 border-green-200 hover:bg-green-600 hover:text-white"
                              }`}
                          >
                            {Number(m.is_active) === 1 ? <><XCircle size={14} /> Deactivate</> : <><CheckCircle size={14} /> Activate</>}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="grid md:hidden gap-4">
                {paginatedManagers.map((m) => (
                  <div key={m.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-4 relative overflow-hidden">
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${Number(m.is_active) === 1 ? "bg-green-500" : "bg-red-500"}`}></div>
                    <div className="flex items-center gap-3 pl-2">
                      <div className="h-12 w-12 rounded-full border border-gray-200 bg-gray-100 flex items-center justify-center text-indigo-400 font-bold">
                        {m.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{m.name}</p>
                        <p className="text-xs text-gray-500">{m.email}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-sm pl-2 py-3 border-t border-b border-gray-50">
                      <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded text-xs font-semibold">{m.role || "Manager"}</span>
                      <span className={`text-xs px-3 py-1 rounded-full font-bold border ${Number(m.is_active) === 1 ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>
                        {Number(m.is_active) === 1 ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="pt-1 pl-2 flex gap-2">
                      <button
                        onClick={() => handleViewManager(m.id)}
                        className="flex-1 flex items-center justify-center gap-2 text-blue-600 bg-blue-50 py-2 rounded-lg font-semibold text-sm transition-all"
                      >
                        <Eye size={18} /> View
                      </button>
                      <button
                        onClick={() => toggleManagerStatus(m.id, Number(m.is_active))}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-semibold text-sm border ${Number(m.is_active) === 1 ? "bg-red-50 text-red-600 border-red-200" : "bg-green-50 text-green-600 border-green-200"
                          }`}
                      >
                        {Number(m.is_active) === 1 ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 bg-white px-4 py-3 rounded-xl border border-gray-200 shadow-sm">

          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border ${currentPage === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
          >
            <ChevronLeft size={16} />
            Previous
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all ${currentPage === i + 1
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border ${currentPage === totalPages
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* NEW UPDATED View Manager Modal - MATCHING SCREENSHOT */}
      {viewModalOpen && displayUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl bg-white">

            {/* Header Section */}
            <div className="p-5 border-b flex justify-between items-center bg-[#F9F5FF]">
              <h2 className="text-xl font-bold text-[#101828]">User Details</h2>
              <button
                onClick={() => setViewModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              {/* Profile Row */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-full border-2 border-gray-200 overflow-hidden">
                  <img
                    src={`https://test.pearl-developer.com/Inbay_Innovations/public/${displayUser.profile_image}`}
                    alt="profile"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 uppercase tracking-tight">
                    {displayUser.name}
                  </h3>
                  <p className="text-sm text-gray-500 font-medium">
                    {displayUser.email}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <hr className="border-gray-200 mb-6" />

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-6 mb-8">
                <div>
                  <p className="text-[#667085] text-sm mb-1">User ID</p>
                  <p className="font-bold text-[#101828] text-lg">{displayUser.id}</p>
                </div>
                <div>
                  <p className="text-[#667085] text-sm mb-1">Manager ID</p>
                  <p className="font-bold text-[#101828] text-lg">{selectedManagerData.manager_id}</p>
                </div>
                <div>
                  <p className="text-[#667085] text-sm mb-1">Role</p>
                  <p className="font-bold text-[#101828] text-lg">{displayUser.role}</p>
                </div>
                <div>
                  <p className="text-[#667085] text-sm mb-1">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${displayUser.is_active
                    ? "bg-[#ECFDF3] text-[#027A48]"
                    : "bg-[#FEF3F2] text-[#B42318]"
                    }`}>
                    {displayUser.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
                <div>
                  <p className="text-[#667085] text-sm mb-1">Rate</p>
                  <p className="font-bold text-[#101828] text-lg">₹{displayUser.per_km_rate}</p>
                </div>
                <div>
                  <p className="text-[#667085] text-sm mb-1">Designation</p>
                  <p className="font-bold text-[#101828] text-lg">{displayUser.designation || "N/A"}</p>
                </div>
                <div>
                  <p className="text-[#667085] text-sm mb-1">Team</p>
                  <p className="font-bold text-[#101828] text-lg">{displayUser.team || "N/A"}</p>
                </div>
                <div>
                  <p className="text-[#667085] text-sm mb-1">State</p>
                  <p className="font-bold text-[#101828] text-lg">{displayUser.state || "N/A"}</p>
                </div>
                <div>
                  <p className="text-[#667085] text-sm mb-1">Created At</p>
                  <p className="font-bold text-[#475467] text-sm">{displayUser.created_at}</p>
                </div>
                <div>
                  <p className="text-[#667085] text-sm mb-1">Updated At</p>
                  <p className="font-bold text-[#475467] text-sm">{displayUser.updated_at}</p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setViewModalOpen(false)}
                className="w-full py-4 rounded-xl bg-[#9333ea] text-white font-bold text-lg hover:bg-[#7e22ce] transition-colors shadow-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-indigo-50">
              <h2 className="text-xl font-bold text-gray-800">Create New Manager</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            <form onSubmit={handleCreateManager} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                <input required type="text" placeholder="Enter name" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Manager Email</label>
                <input required type="email" placeholder="manager@example.com" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                <input required type="password" placeholder="••••••••" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Headquarters</label>
                <input required type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.hq} onChange={(e) => setFormData({ ...formData, hq: e.target.value })} />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-600 rounded-lg font-medium hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 shadow-md disabled:opacity-50">
                  {isSubmitting ? "Creating..." : "Create Manager"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Manager;