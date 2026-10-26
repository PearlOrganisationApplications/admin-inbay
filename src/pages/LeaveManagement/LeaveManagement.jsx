import { useCallback, useEffect, useState } from "react";
import {
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineUsers,
  HiOutlineSearch,
  HiOutlineEye,
  HiOutlineCheck,
  HiOutlineX,
  HiOutlineRefresh,
  HiOutlineClipboardList,
  HiOutlineMail,
  HiOutlineDocumentText,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from "react-icons/hi";
import { getAdminLeaves  ,approveAdminLeave,
  rejectAdminLeave, } from "../../API/leave";

const PER_PAGE = 20;

const statusOptions = ["all", "pending", "approved", "rejected", "cancelled"];

const statusStyles = {
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  approved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  rejected: "bg-red-50 text-red-700 ring-red-200",
  cancelled: "bg-slate-100 text-slate-600 ring-slate-200",
};

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
};

const formatLeaveType = (type) => {
  if (!type) return "—";

  return type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatStatus = (status) => {
  if (!status) return "Unknown";

  return status.charAt(0).toUpperCase() + status.slice(1);
};

export default function LeaveManagement() {
  /* ---------- API data ---------- */
  const [leaves, setLeaves] = useState([]);
  const [summary, setSummary] = useState({
    total_leaves: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    on_leave_today: 0,
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: PER_PAGE,
    total: 0,
    from: 0,
    to: 0,
  });

  /* ---------- UI state ---------- */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const [toast, setToast] = useState("");

  /* ---------- Search debounce ---------- */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  /* ---------- Fetch leaves ---------- */
  const fetchLeaves = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminLeaves({
        status: activeFilter,
        leave_type: "",
        user_id: "",
        manager_id: "",
        date: "",
        month: "",
        year: "",
        search: debouncedSearch,
        per_page: PER_PAGE,
        page,
      });

      /*
        API response structure:
        response.data = {
          success,
          summary: { total_leaves, pending, approved, rejected, on_leave_today },
          data: {                       <- laravel paginator
            current_page, last_page, per_page, total, from, to,
            data: [ ...leaves ]
          }
        }
      */
      const body = response?.data;
      const paginator = body?.data;

      setLeaves(paginator?.data || []);

      setSummary({
        total_leaves: body?.summary?.total_leaves ?? 0,
        pending: body?.summary?.pending ?? 0,
        approved: body?.summary?.approved ?? 0,
        rejected: body?.summary?.rejected ?? 0,
        on_leave_today: body?.summary?.on_leave_today ?? 0,
      });

      setPagination({
        current_page: paginator?.current_page ?? 1,
        last_page: paginator?.last_page ?? 1,
        per_page: paginator?.per_page ?? PER_PAGE,
        total: paginator?.total ?? 0,
        from: paginator?.from ?? 0,
        to: paginator?.to ?? 0,
      });
    } catch (err) {
      console.error("Error fetching leaves:", err);
      setError("Leave requests load nahi ho paaye. Dobara try karein.");
    } finally {
      setLoading(false);
    }
  }, [activeFilter, debouncedSearch, page]);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  /* ---------- Handlers ---------- */
  const handleFilterChange = (status) => {
    setActiveFilter(status);
    setPage(1);
  };

 const handleAction = async (leaveId, nextStatus) => {
  try {
    const payload = {
      remark:
        nextStatus === "approved"
          ? "Approved directly by Head Office Administration"
          : "Rejected directly by Head Office Administration",
    };

    if (nextStatus === "approved") {
      await approveAdminLeave(leaveId, payload);
    } else {
      await rejectAdminLeave(leaveId, payload);
    }

    setConfirmation(null);
    setSelectedLeave(null);

    setToast(
      `Leave request ${nextStatus} successfully.`
    );

    fetchLeaves();
  } catch (error) {
    console.error(
      `${nextStatus} leave error:`,
      error.response?.data || error.message
    );

    setToast(
      error.response?.data?.message ||
        `Failed to ${nextStatus} leave request.`
    );
  }
};
  /* ---------- Tab counts (from API summary) ---------- */
  const cancelledCount = Math.max(
    0,
    summary.total_leaves -
      summary.pending -
      summary.approved -
      summary.rejected
  );

  const tabCounts = {
    all: summary.total_leaves,
    pending: summary.pending,
    approved: summary.approved,
    rejected: summary.rejected,
    cancelled: cancelledCount,
  };

  const summaryCards = [
    {
      title: "Total Leaves",
      value: summary.total_leaves,
      icon: HiOutlineClipboardList,
      color: "bg-violet-50 text-violet-600",
    },
    {
      title: "Pending",
      value: summary.pending,
      icon: HiOutlineClock,
      color: "bg-amber-50 text-amber-600",
    },
    {
      title: "Approved",
      value: summary.approved,
      icon: HiOutlineCheckCircle,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Rejected",
      value: summary.rejected,
      icon: HiOutlineXCircle,
      color: "bg-red-50 text-red-600",
    },
    {
      title: "On Leave Today",
      value: summary.on_leave_today,
      icon: HiOutlineUsers,
      color: "bg-sky-50 text-sky-600",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px] space-y-6">
        {/* Page heading */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2 text-sm text-slate-500">
              <span>Manager</span>
              <span>/</span>
              <span className="text-violet-600">Leave Management</span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
              Leave Management
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              View and manage employee leave requests.
            </p>
          </div>

          <button
            onClick={fetchLeaves}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:opacity-60"
          >
            <HiOutlineRefresh
              size={18}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {summaryCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {card.title}
                    </p>
                    <p className="mt-2 text-3xl font-bold text-slate-800">
                      {card.value}
                    </p>
                  </div>

                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.color}`}
                  >
                    <Icon size={25} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main table section */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Search and filters */}
          <div className="border-b border-slate-200 p-4 sm:p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  Employee Leave Requests
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Review requests and manage their status.
                </p>
              </div>

              <div className="relative w-full xl:max-w-sm">
                <HiOutlineSearch
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={20}
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name, email, type..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                />
              </div>
            </div>

            {/* Status tabs */}
            <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
              {statusOptions.map((status) => {
                const isActive = activeFilter === status;

                return (
                  <button
                    key={status}
                    onClick={() => handleFilterChange(status)}
                    className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition ${
                      isActive
                        ? "bg-violet-600 text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {status === "all" ? "All Leaves" : formatStatus(status)}
                    <span
                      className={`rounded-md px-1.5 py-0.5 text-xs ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-white text-slate-600"
                      }`}
                    >
                      {tabCounts[status]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="m-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 sm:m-5">
              {error}
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left">
              <thead className="bg-slate-50">
                <tr>
                  {[
                    "Employee",
                    "Leave Type",
                    "From Date",
                    "To Date",
                    "Days",
                    "Reason",
                    "Status",
                    "Actions",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="whitespace-nowrap px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading && leaves.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-5 py-16 text-center text-sm text-slate-500"
                    >
                      Loading leave requests...
                    </td>
                  </tr>
                )}

                {leaves.map((leave) => (
                  <tr
                    key={leave.id}
                    className="transition hover:bg-violet-50/30"
                  >
                    {/* Employee */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-700">
                          {leave.user?.name?.charAt(0).toUpperCase() || "U"}
                        </div>

                        <div>
                          <p className="whitespace-nowrap text-sm font-semibold text-slate-800">
                            {leave.user?.name || "Unknown"}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-500">
                            {leave.user?.email || "No email"}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-400">
                            ID: {leave.user_id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Leave type */}
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-slate-700">
                        {formatLeaveType(leave.leave_type)}
                      </p>

                      {leave.half_day_type && (
                        <p className="mt-1 text-xs text-slate-500">
                          {formatLeaveType(leave.half_day_type)}
                        </p>
                      )}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                      {formatDate(leave.from_date)}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                      {formatDate(leave.to_date)}
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-lg bg-slate-100 px-2.5 py-1 text-sm font-bold text-slate-700">
                        {leave.total_days}
                      </span>
                    </td>

                    <td className="max-w-[200px] px-5 py-4">
                      <p
                        title={leave.reason || ""}
                        className="truncate text-sm text-slate-600"
                      >
                        {leave.reason || "No reason provided"}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${
                          statusStyles[leave.status] ||
                          "bg-slate-100 text-slate-600 ring-slate-200"
                        }`}
                      >
                        <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
                        {formatStatus(leave.status)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          title="View details"
                          onClick={() => setSelectedLeave(leave)}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600"
                        >
                          <HiOutlineEye size={18} />
                        </button>

                        {leave.status === "pending" && (
                          <>
                            <button
                              title="Approve leave"
                              onClick={() =>
                                setConfirmation({
                                  leave,
                                  nextStatus: "approved",
                                })
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-200 text-emerald-600 transition hover:bg-emerald-50"
                            >
                              <HiOutlineCheck size={18} />
                            </button>

                            <button
                              title="Reject leave"
                              onClick={() =>
                                setConfirmation({
                                  leave,
                                  nextStatus: "rejected",
                                })
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-600 transition hover:bg-red-50"
                            >
                              <HiOutlineX size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {!loading && leaves.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-5 py-16 text-center">
                      <HiOutlineSearch
                        size={35}
                        className="mx-auto mb-3 text-slate-300"
                      />
                      <p className="font-semibold text-slate-700">
                        No leave requests found
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Try another search or status filter.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination footer */}
          <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {pagination.from || 0}–{pagination.to || 0}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">
                {pagination.total}
              </span>{" "}
              leave requests
            </p>

            <div className="flex items-center gap-2">
              <button
                disabled={pagination.current_page <= 1 || loading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent"
                title="Previous page"
              >
                <HiOutlineChevronLeft size={18} />
              </button>

              <span className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-violet-600 px-3 text-sm font-semibold text-white">
                {pagination.current_page} / {pagination.last_page}
              </span>

              <button
                disabled={
                  pagination.current_page >= pagination.last_page || loading
                }
                onClick={() => setPage((p) => p + 1)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent"
                title="Next page"
              >
                <HiOutlineChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* View details modal */}
      {selectedLeave && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm"
          onClick={() => setSelectedLeave(null)}
        >
          <div
            className="my-auto max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Leave Request Details
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Request ID: #{selectedLeave.id}
                </p>
              </div>

              <button
                onClick={() => setSelectedLeave(null)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <HiOutlineX size={22} />
              </button>
            </div>

            <div className="space-y-6 p-6">
              {/* Employee information */}
              <div className="rounded-xl bg-slate-50 p-4">
                <h3 className="mb-4 text-sm font-bold text-slate-700">
                  Employee Information
                </h3>

                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-lg font-bold text-violet-700">
                    {selectedLeave.user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>

                  <div>
                    <p className="font-bold text-slate-800">
                      {selectedLeave.user?.name || "Unknown"}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                      <HiOutlineMail size={15} />
                      {selectedLeave.user?.email || "No email"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <DetailItem label="User ID" value={selectedLeave.user_id} />
                  <DetailItem label="Role" value={selectedLeave.user?.role} />
                  <DetailItem
                    label="Mobile"
                    value={selectedLeave.user?.mobile_number}
                  />
                  <DetailItem
                    label="Designation"
                    value={selectedLeave.user?.designation}
                  />
                  <DetailItem
                    label="Headquarters"
                    value={selectedLeave.user?.hq}
                  />
                  <DetailItem label="State" value={selectedLeave.user?.state} />
                </div>
              </div>

              {/* Leave information */}
              <div>
                <h3 className="mb-4 text-sm font-bold text-slate-700">
                  Leave Information
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <DetailItem
                    label="Leave Type"
                    value={formatLeaveType(selectedLeave.leave_type)}
                  />
                  <DetailItem
                    label="Half Day"
                    value={
                      selectedLeave.half_day_type
                        ? formatLeaveType(selectedLeave.half_day_type)
                        : "Not applicable"
                    }
                  />
                  <DetailItem
                    label="From Date"
                    value={formatDate(selectedLeave.from_date)}
                    icon={<HiOutlineCalendar size={17} />}
                  />
                  <DetailItem
                    label="To Date"
                    value={formatDate(selectedLeave.to_date)}
                    icon={<HiOutlineCalendar size={17} />}
                  />
                  <DetailItem
                    label="Total Days"
                    value={`${selectedLeave.total_days} ${
                      Number(selectedLeave.total_days) === 1 ? "day" : "days"
                    }`}
                  />
                  <DetailItem
                    label="Applied On"
                    value={formatDate(selectedLeave.created_at)}
                  />
                </div>
              </div>

              {/* Reason */}
              <div>
                <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
                  <HiOutlineDocumentText size={18} />
                  Reason for Leave
                </h3>

                <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600">
                  {selectedLeave.reason || "No reason provided"}
                </p>
              </div>

              {/* Attachment */}
              <DetailItem
                label="Attachment"
                value={selectedLeave.attachment || "No attachment"}
              />

              {/* Status and action details */}
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-slate-600">
                    Current Status
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${
                      statusStyles[selectedLeave.status] ||
                      "bg-slate-100 text-slate-600 ring-slate-200"
                    }`}
                  >
                    {formatStatus(selectedLeave.status)}
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  <DetailItem
                    label="Action Remark"
                    value={selectedLeave.action_remark}
                  />
                  <DetailItem
                    label="Action By"
                    value={selectedLeave.action_user?.name}
                  />
                  <DetailItem
                    label="Action Date"
                    value={
                      selectedLeave.action_at
                        ? formatDate(selectedLeave.action_at)
                        : null
                    }
                  />
                </div>
              </div>
            </div>

            {selectedLeave.status === "pending" && (
              <div className="flex flex-col-reverse gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:justify-end">
                <button
                  onClick={() =>
                    setConfirmation({
                      leave: selectedLeave,
                      nextStatus: "rejected",
                    })
                  }
                  className="rounded-xl border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                >
                  Reject Request
                </button>

                <button
                  onClick={() =>
                    setConfirmation({
                      leave: selectedLeave,
                      nextStatus: "approved",
                    })
                  }
                  className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700"
                >
                  Approve Request
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Confirmation modal */}
      {confirmation && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div
              className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${
                confirmation.nextStatus === "approved"
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {confirmation.nextStatus === "approved" ? (
                <HiOutlineCheckCircle size={26} />
              ) : (
                <HiOutlineXCircle size={26} />
              )}
            </div>

            <h3 className="text-xl font-bold text-slate-800">
              {confirmation.nextStatus === "approved"
                ? "Approve Leave Request?"
                : "Reject Leave Request?"}
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Are you sure you want to{" "}
              {confirmation.nextStatus === "approved" ? "approve" : "reject"}{" "}
              the leave request submitted by{" "}
              <span className="font-semibold text-slate-700">
                {confirmation.leave.user?.name}
              </span>
              ?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setConfirmation(null)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={() =>
                  handleAction(confirmation.leave.id, confirmation.nextStatus)
                }
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold text-white ${
                  confirmation.nextStatus === "approved"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                Confirm{" "}
                {confirmation.nextStatus === "approved" ? "Approve" : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed top-5 right-5 z-[70] flex max-w-sm items-center gap-3 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-xl">
          <HiOutlineCheckCircle
            size={21}
            className="shrink-0 text-emerald-400"
          />
          <span>{toast}</span>

          <button
            onClick={() => setToast("")}
            className="ml-2 text-slate-300 hover:text-white"
          >
            <HiOutlineX size={18} />
          </button>
        </div>
      )}
    </div>
  );
}

function DetailItem({ label, value, icon }) {
  return (
    <div className="min-w-0">
      <p className="mb-1 flex items-center gap-1.5 text-xs font-medium text-slate-500">
        {icon}
        {label}
      </p>

      <p className="break-words text-sm font-semibold text-slate-800">
        {value !== null && value !== undefined && value !== "" ? value : "—"}
      </p>
    </div>
  );
}