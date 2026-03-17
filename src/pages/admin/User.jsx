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
  Eye 
} from "lucide-react";

const ITEMS_PER_PAGE = 10;

const User = () => {
  const [users, setUsers] = useState([]);
  
  // New States for Search, Filter & Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // ----------------------------------------------------------------------
  // 1. API Fetch Logic 
  // ----------------------------------------------------------------------
  useEffect(() => {
    fetchUsers();
  },[]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://test.pearl-developer.com/Inbay_Innovations/public/api/admin/get/user",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      
      // Safety check incase API returns an object instead of array initially
      setUsers(Array.isArray(data) ? data : data?.data ||[]);
    } catch (error) {
      console.error("User API error:", error);
    }
  };

  // ----------------------------------------------------------------------
  // 2. Extract Unique Roles for Filter Dropdown
  // ----------------------------------------------------------------------
  const uniqueRoles = useMemo(() => {
    const roles = users.map((user) => user.role).filter(Boolean);
    return [...new Set(roles)];
  }, [users]);

  // ----------------------------------------------------------------------
  // 3. Search & Filter Logic
  // ----------------------------------------------------------------------
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Search by Name or Email
      const matchesSearch = 
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        user.email?.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter by Role
      const matchesRole = roleFilter === "" || user.role === roleFilter;

      // Filter by Status (Active/Inactive)
      const isActive = !!user.email_verified_at;
      const matchesStatus = 
        statusFilter === "" || 
        (statusFilter === "Active" ? isActive : !isActive);

      return matchesSearch && matchesRole && matchesStatus;
    });
  },[users, searchQuery, roleFilter, statusFilter]);

  // ----------------------------------------------------------------------
  // 4. Calculate Stats for Top Cards
  // ----------------------------------------------------------------------
  const totalUsers = filteredUsers.length;
  const activeUsers = filteredUsers.filter((u) => u.email_verified_at).length;
  const inactiveUsers = filteredUsers.filter((u) => !u.email_verified_at).length;

  // ----------------------------------------------------------------------
  // 5. Pagination Logic
  // ----------------------------------------------------------------------
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE) || 1;
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset to page 1 on any filter change
  const handleSearch = (e) => { setSearchQuery(e.target.value); setCurrentPage(1); };
  const handleRoleFilter = (e) => { setRoleFilter(e.target.value); setCurrentPage(1); };
  const handleStatusFilter = (e) => { setStatusFilter(e.target.value); setCurrentPage(1); };

  // ----------------------------------------------------------------------
  // 6. Export CSV Logic
  // ----------------------------------------------------------------------
  const handleExport = () => {
    if (filteredUsers.length === 0) return alert("No data to export!");
    
    const headers = ["ID", "Name", "Email", "Role", "Status"];
    const rows = filteredUsers.map((user) => {
      const status = user.email_verified_at ? "Active" : "Inactive";
      return `"${user.id}","${user.name}","${user.email}","${user.role}","${status}"`;
    }).join("\n");
    
    const csv = headers.join(",") + "\n" + rows;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "users_list.csv";
    a.click();
  };

  return (
    <div className="bg-gray-50 h-screen flex flex-col font-sans">
      
      {/* HEADER SECTION */}
      <div className="bg-white px-6 py-4 shadow-sm border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 flex-shrink-0 z-10">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800">User Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage user roles, statuses, and details</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2"
          >
            <Download size={16} />
            Export Data
          </button>
        </div>
      </div>

      {/* TOOLBAR: SEARCH & FILTERS */}
      <div className="bg-white px-6 py-4 shadow-sm border-b border-gray-100 flex flex-col md:flex-row gap-4 items-center z-0 flex-shrink-0">
        
        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by Name or Email..." 
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm transition-all"
          />
        </div>

        {/* Filters Group */}
        <div className="flex w-full md:w-auto gap-3">
          {/* Role Filter */}
          <div className="relative w-full md:w-48">
            <Filter className="absolute left-3 top-2.5 text-purple-500" size={18} />
            <select 
              value={roleFilter}
              onChange={handleRoleFilter}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm bg-white cursor-pointer transition-all appearance-none"
            >
              <option value="">All Roles</option>
              {uniqueRoles.map((role, idx) => (
                <option key={idx} value={role}>{role}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <select 
            value={statusFilter}
            onChange={handleStatusFilter}
            className="w-full md:w-40 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm bg-white cursor-pointer transition-all appearance-none"
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* MAIN SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          
          {/* SUMMARY CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Total Users */}
            <div className="bg-white rounded-2xl p-5 border border-purple-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                <Users size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <h3 className="text-2xl font-extrabold text-gray-900">{totalUsers}</h3>
              </div>
            </div>

            {/* Active Users */}
            <div className="bg-white rounded-2xl p-5 border border-green-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                <UserCheck size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Active Users</p>
                <h3 className="text-2xl font-extrabold text-gray-900">{activeUsers}</h3>
              </div>
            </div>

            {/* Inactive Users */}
            <div className="bg-white rounded-2xl p-5 border border-red-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                <UserX size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Inactive Users</p>
                <h3 className="text-2xl font-extrabold text-gray-900">{inactiveUsers}</h3>
              </div>
            </div>
          </div>

          {paginatedUsers.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-gray-500 text-lg font-medium">No users found.</p>
              <button 
                onClick={() => { setSearchQuery(''); setRoleFilter(''); setStatusFilter(''); }} 
                className="text-purple-600 mt-2 hover:underline font-medium"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE */}
              <div className="hidden md:block bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-left text-gray-600 border-b border-gray-200">
                    <tr>
                      <th className="p-4 font-semibold uppercase tracking-wider text-xs">User</th>
                      <th className="p-4 font-semibold uppercase tracking-wider text-xs">Email</th>
                      <th className="p-4 font-semibold uppercase tracking-wider text-xs">Role</th>
                      <th className="p-4 font-semibold uppercase tracking-wider text-xs">Status</th>
                      <th className="p-4 font-semibold uppercase tracking-wider text-xs text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-purple-50/50 transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          <img
                            src={`https://i.pravatar.cc/40?img=${user.id}`}
                            className="h-10 w-10 rounded-full border border-gray-200 shadow-sm"
                            alt=""
                          />
                          <span className="font-bold text-gray-800">{user.name}</span>
                        </td>
                        <td className="p-4 text-gray-500">{user.email}</td>
                        <td className="p-4">
                          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-xs font-medium border border-gray-200">
                            {user.role}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`text-xs px-3 py-1 rounded-full font-bold border ${
                              user.email_verified_at
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-red-50 text-red-700 border-red-200"
                            }`}
                          >
                            {user.email_verified_at ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          {/* Cool Eye Button Desktop */}
                          <button 
                            className="p-2 inline-flex items-center justify-center text-blue-600 bg-blue-50 rounded-full hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm"
                            title="View User"
                          >
                            <Eye size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE CARDS */}
              <div className="grid md:hidden gap-4">
                {paginatedUsers.map((user) => (
                  <div key={user.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-4 relative overflow-hidden">
                    {/* Active Indicator Line */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${user.email_verified_at ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    
                    <div className="flex items-center gap-3 pl-2">
                      <img
                        src={`https://i.pravatar.cc/40?img=${user.id}`}
                        className="h-12 w-12 rounded-full border border-gray-200"
                        alt=""
                      />
                      <div>
                        <p className="font-bold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-sm pl-2 py-3 border-t border-b border-gray-50">
                      <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded text-xs font-semibold">
                        {user.role}
                      </span>
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-bold border ${
                          user.email_verified_at
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        {user.email_verified_at ? "Active" : "Inactive"}
                      </span>
                    </div>

                    {/* Cool Eye Button Mobile */}
                    <div className="pt-1 pl-2">
                      <button className="w-full flex items-center justify-center gap-2 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white py-2 rounded-lg font-semibold transition-all duration-300 shadow-sm">
                        <Eye size={18} />
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

        </div>
      </div>

      {/* PAGINATION FOOTER */}
      {totalPages > 1 && (
        <div className="bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0 z-10">
          <p className="text-sm text-gray-500 hidden sm:block">
            Showing <span className="font-medium text-gray-900">{((currentPage - 1) * ITEMS_PER_PAGE) + 1}</span> to <span className="font-medium text-gray-900">{Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length)}</span> of <span className="font-medium text-gray-900">{filteredUsers.length}</span> results
          </p>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                      : "text-gray-600 hover:bg-gray-100 hidden sm:inline-block"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              {/* Show current page indicator on very small screens where numbers are hidden */}
              <span className="sm:hidden text-sm font-medium text-gray-700 px-2">
                Page {currentPage} of {totalPages}
              </span>
            </div>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default User;