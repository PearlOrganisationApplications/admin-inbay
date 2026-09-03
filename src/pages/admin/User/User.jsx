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
} from "lucide-react";
import { fetchUsers, fetchSingleUser, handleResetPassword, toggleUserStatus, handleCreateUser } from "./userPageApis";
import ResetPasswordModal from "./Modals/ResetPasswordModal";
import CreateUserModal from "./Modals/CreateUserModal";
import ViewUserModal from "./Modals/ViewUserModal";

const ITEMS_PER_PAGE = 10;

const User = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("Active");
  const [currentPage, setCurrentPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    per_km_rate: "",
    hq: "",
    designation:"",
    mobile_number:"",
  });
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [selectedUser, setSelectedUser] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetPassword, setResetPassword] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    fetchUsers(setUsers);
  }, []);

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const uniqueRoles = useMemo(() => {
    const roles = users.map((user) => user.role).filter(Boolean);
    return [...new Set(roles)];
  }, [users]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === "" || user.role === roleFilter;

      // logic changed to use is_active (1 = Active, 0 = Inactive)
      const isActive = Number(user.is_active) === 1;
      const matchesStatus =
        statusFilter === "" ||
        (statusFilter === "Active" ? isActive : !isActive);
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  const totalUsers = filteredUsers.length;
  const activeUsers = filteredUsers.filter(
    (u) => Number(u.is_active) === 1,
  ).length;
  const inactiveUsers = filteredUsers.filter(
    (u) => Number(u.is_active) !== 1,
  ).length;

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE) || 1;
  const paginatedUsers = filteredUsers.slice(
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
    if (filteredUsers.length === 0) return alert("No data to export!");
    const headers = ["ID", "Name", "Email", "Role", "Status"];
    const rows = filteredUsers
      .map((user) => {
        const status = Number(user.is_active) === 1 ? "Active" : "Inactive";
        return `"${user.id}","${user.name}","${user.email}","${user.role}","${status}"`;
      })
      .join("\n");
    const csv = headers.join(",") + "\n" + rows;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users_list.csv";
    a.click();
  };

  return (
    <div className="bg-gray-50 h-full w-full flex flex-col font-sans relative overflow-x-hidden">
      {" "}
      {toast.show && (
        <div
          className={`fixed top-5 right-5 z-[100] px-6 py-3 rounded-lg shadow-lg text-white transition-all transform animate-bounce ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}
        >
          {toast.message}
        </div>
      )}
      <div className="bg-white px-6 py-4 shadow-sm border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 flex-shrink-0 z-10">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800">
            User Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage user roles, statuses, and details
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors shadow-sm flex items-center gap-2"
          >
            <Plus size={16} /> Create User
          </button>
          <button
            onClick={handleExport}
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2"
          >
            <Download size={16} /> Export Data
          </button>
        </div>
      </div>
      <div className="bg-white px-6 py-4 shadow-sm border-b border-gray-100 flex flex-col md:flex-row gap-4 items-center z-0 flex-shrink-0">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <div style={{ display: "none" }}>
            <input type="text" autoComplete="username" />
          </div>
          <input
            type="search"
            name="q_9f8a2"   // change this
            id="q_9f8a2"     // change this
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="Search by Name or Email..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm transition-all"
          />
        </div>
        <div className="flex w-full md:w-auto gap-3">
          {/* <div className="relative w-full md:w-48">
            <Filter
              className="absolute left-3 top-2.5 text-purple-500"
              size={18}
            />
            <select
              value={roleFilter}
              onChange={handleRoleFilter}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm bg-white cursor-pointer transition-all appearance-none"
            >
              <option value="">All Roles</option>
              {uniqueRoles.map((role, idx) => (
                <option key={idx} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div> */}
          <select
            value={statusFilter}
            onChange={handleStatusFilter}
            className="w-full md:w-40 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm bg-white cursor-pointer transition-all appearance-none"
          >
            
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 md:p-6 min-w-0">
        {" "}
        <div className="max-w-7xl w-full mx-auto overflow-x-auto">
          {" "}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-2xl p-5 border border-purple-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                <Users size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <h3 className="text-2xl font-extrabold text-gray-900">
                  {totalUsers}
                </h3>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-green-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                <UserCheck size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Active Users
                </p>
                <h3 className="text-2xl font-extrabold text-gray-900">
                  {activeUsers}
                </h3>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-red-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                <UserX size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Inactive Users
                </p>
                <h3 className="text-2xl font-extrabold text-gray-900">
                  {inactiveUsers}
                </h3>
              </div>
            </div>
          </div>
          {paginatedUsers.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-gray-500 text-lg font-medium">
                No users found.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setRoleFilter("");
                  setStatusFilter("");
                }}
                className="text-purple-600 mt-2 hover:underline font-medium"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <div className="hidden md:block bg-white rounded-2xl border border-gray-200 shadow-sm w-full overflow-x-auto [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">
                {" "}
                <table className="w-full text-sm">
                  {" "}
                  <thead className="bg-gray-50 text-left text-gray-600 border-b border-gray-200">
                    <tr>
                      <th className="p-4 font-semibold uppercase tracking-wider text-xs">
                        User
                      </th>
                      <th className="p-4 font-semibold uppercase tracking-wider text-xs">
                        Email
                      </th>
                      <th className="p-4 font-semibold uppercase tracking-wider text-xs">
                        Role
                      </th>
                      <th className="p-4 font-semibold uppercase tracking-wider text-xs">
                        Headquarters
                      </th>
                      <th className="p-4 font-semibold uppercase tracking-wider text-xs">
                        Rate (Per KM)
                      </th>
                      <th className="p-4 font-semibold uppercase tracking-wider text-xs">
                        Status
                      </th>
                      <th className="p-4 font-semibold uppercase tracking-wider text-xs text-center">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 ">
                    {paginatedUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-purple-50/50 transition-colors"
                      >
                        <td className="p-2 flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full border border-gray-200 shadow-sm bg-gray-100 flex items-center justify-center text-gray-400 font-bold">
                            {user.name.charAt(0)}
                          </div>
                          <span className="font-bold text-gray-800">
                            {user.name}
                          </span>
                        </td>
                        <td className="p-4 text-gray-500">{user.email}</td>
                        <td className="p-4">
                          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-xs font-medium border border-gray-200">
                            {user.role}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-xs font-medium border border-gray-200">
                            {user.hq || "N/A"}
                          </span>
                        </td>
                        <td className="p-4 text-gray-500">
                          ₹{user.per_km_rate || "0.00"}
                        </td>
                        <td className="p-4">
                          <span
                            className={`text-xs px-3 py-1 rounded-full font-bold border ${Number(user.is_active) === 1 ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}
                          >
                            {Number(user.is_active) === 1
                              ? "Active"
                              : "Inactive"}
                          </span>
                        </td>
                        <td className="p-4 text-center flex items-center justify-center gap-2">
                          <button
                            onClick={() =>
                              fetchSingleUser(
                                user.id,
                                setSelectedUser,
                                setIsViewModalOpen
                              )
                            }
                            className="p-2 inline-flex items-center justify-center text-blue-600 bg-blue-50 rounded-full hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm"
                            title="View User"
                          >
                            <Eye size={18} />
                          </button>

                          <button
                            onClick={() =>
                              toggleUserStatus(
                                user.id,
                                user.is_active,
                                showToast,
                                () => fetchUsers(setUsers)
                              )
                            }
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm border flex items-center gap-1 ${Number(user.is_active) === 1
                              ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-600 hover:text-white"
                              : "bg-green-50 text-green-600 border-green-200 hover:bg-green-600 hover:text-white"
                              }`}
                          >
                            {Number(user.is_active) === 1 ? (
                              <>
                                <XCircle size={14} /> Inactive
                              </>
                            ) : (
                              <>
                                <CheckCircle size={14} /> Active
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => {
                              setSelectedUserId(user.id);
                              setIsResetModalOpen(true);
                            }}
                            className="px-3 py-2 inline-flex items-center justify-center text-blue-600 bg-blue-50 rounded-full hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm leading-none"
                            title="Reset Password"
                          >
                            Reset Password
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="grid md:hidden gap-4">
                {paginatedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-4 relative overflow-hidden"
                  >
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-1 ${Number(user.is_active) === 1 ? "bg-green-500" : "bg-red-500"}`}
                    ></div>
                    <div className="flex items-center gap-3 pl-2">
                      <div className="h-12 w-12 rounded-full border border-gray-200 bg-gray-100 flex items-center justify-center text-gray-400 font-bold">
                        {user.name.charAt(0)}
                      </div>
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
                        className={`text-xs px-3 py-1 rounded-full font-bold border ${Number(user.is_active) === 1 ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}
                      >
                        {Number(user.is_active) === 1 ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="pt-1 pl-2 flex gap-2">
                      <button
                        onClick={() => fetchSingleUser(user.id)}
                        className="flex-1 flex items-center justify-center gap-2 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white py-2 rounded-lg font-semibold transition-all duration-300 shadow-sm text-sm"
                      >
                        <Eye size={18} /> View
                      </button>
                      <button
                        onClick={() =>
                          toggleUserStatus(
                            user.id,
                            user.is_active,
                            showToast,
                            () => fetchUsers(setUsers)
                          )
                        }
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-semibold transition-all duration-300 shadow-sm text-sm border ${Number(user.is_active) === 1
                          ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-600 hover:text-white"
                          : "bg-green-50 text-green-600 border-green-200 hover:bg-green-600 hover:text-white"
                          }`}
                      >
                        {Number(user.is_active) === 1 ? "Inactive" : "Active"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      {totalPages > 1 && (
        <div className="bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0 z-10">
          <p className="text-sm text-gray-500 hidden sm:block">
            Showing{" "}
            <span className="font-medium text-gray-900">
              {(currentPage - 1) * ITEMS_PER_PAGE + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium text-gray-900">
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length)}
            </span>{" "}
            of{" "}
            <span className="font-medium text-gray-900">
              {filteredUsers.length}
            </span>{" "}
            results
          </p>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${currentPage === i + 1 ? "bg-purple-600 text-white shadow-sm" : "text-gray-600 hover:bg-gray-100 hidden sm:inline-block"}`}
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
              className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
      {isViewModalOpen && selectedUser &&

        <ViewUserModal
          isOpen={isViewModalOpen}
          selectedUser={selectedUser}
          setIsViewModalOpen={setIsViewModalOpen}
        />
      }
      {isModalOpen &&
        <CreateUserModal
          isOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          formData={formData}
          setFormData={setFormData}
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
          showToast={showToast}
          setUsers={setUsers}
        />
      }
      {isResetModalOpen &&
        <ResetPasswordModal
          isOpen={isResetModalOpen}
          setIsResetModalOpen={setIsResetModalOpen}
          resetPassword={resetPassword}
          setResetPassword={setResetPassword}
          selectedUserId={selectedUserId}
          showToast={showToast}
        />
      }
    </div>
  );
};

export default User;