import { useEffect, useState } from "react";
import { getAdminLeaveSummary } from "../../API/leave";
import {
    FaClipboardList,
    FaClock,
    FaCheckCircle,
    FaTimesCircle,
    FaUserClock,
} from "react-icons/fa";
const TodaysLeaveSummary = () => {
    const [summary, setSummary] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchLeaveSummary();
    }, []);

    const fetchLeaveSummary = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getAdminLeaveSummary();

            setSummary(response.summary);
            setEmployees(response.today_on_leave_employees || []);
        } catch (err) {
            setError("Failed to fetch today's leave summary.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-purple-200 border-t-purple-600"></div>
            </div>
        );
    }
    if (error) {
        return (
            <div className="p-6 text-red-600">
                {error}
                <button
                    onClick={fetchLeaveSummary}
                    className="ml-3 rounded bg-blue-600 px-3 py-1 text-white"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!summary) {
        return <div className="p-6">No leave summary available.</div>;
    }

    const stats = [
        {
            label: "Total Leaves",
            value: summary.total_leaves ?? 0,
        },
        {
            label: "Pending",
            value: summary.pending ?? 0,
        },
        {
            label: "Approved",
            value: summary.approved ?? 0,
        },
        {
            label: "Rejected",
            value: summary.rejected ?? 0,
        },
        {
            label: "Employees on Leave Today",
            value: summary.today_on_leave_count ?? 0,
        },
    ];

    const formatDate = (date) => {
        if (!date) return "—";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const formatLeaveType = (type) =>
        type
            ? type
                .replaceAll("_", " ")
                .replace(/\b\w/g, (char) => char.toUpperCase())
            : "—";

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            {/* Header */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Today's Leave Summary
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Overview of employee leaves and today's absences.
                    </p>
                </div>

                <button
                    onClick={fetchLeaveSummary}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                    Refresh
                </button>
            </div>

            {/* Active Employees */}
            <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-medium text-gray-500">
                    Total Active Employees
                </p>
                <h2 className="mt-2 text-3xl font-bold text-gray-800">
                    {/* API root-level field */}
                    {employees.length >= 0
                        ? " "
                        : ""}
                </h2>
            </div>

            {/* Summary Cards */}
            <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-5">
                {[
                    {
                        ...stats[0],
                        icon: FaClipboardList,
                        color: "blue",
                        description: "Total leave requests",
                    },
                    {
                        ...stats[1],
                        icon: FaClock,
                        color: "amber",
                        description: "Awaiting approval",
                    },
                    {
                        ...stats[2],
                        icon: FaCheckCircle,
                        color: "emerald",
                        description: "Successfully approved",
                    },
                    {
                        ...stats[3],
                        icon: FaTimesCircle,
                        color: "rose",
                        description: "Leave requests rejected",
                    },
                    {
                        ...stats[4],
                        icon: FaUserClock,
                        color: "indigo",
                        description: "Currently on leave",
                    },
                ].map((stat) => {
                    const Icon = stat.icon;

                    const colors = {
                        blue: {
                            icon: "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
                            border: "hover:border-blue-200",
                            number: "text-blue-700",
                            line: "bg-blue-500",
                        },
                        amber: {
                            icon: "bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white",
                            border: "hover:border-amber-200",
                            number: "text-amber-700",
                            line: "bg-amber-500",
                        },
                        emerald: {
                            icon: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white",
                            border: "hover:border-emerald-200",
                            number: "text-emerald-700",
                            line: "bg-emerald-500",
                        },
                        rose: {
                            icon: "bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white",
                            border: "hover:border-rose-200",
                            number: "text-rose-700",
                            line: "bg-rose-500",
                        },
                        indigo: {
                            icon: "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white",
                            border: "hover:border-indigo-200",
                            number: "text-indigo-700",
                            line: "bg-indigo-500",
                        },
                    };

                    const theme = colors[stat.color];

                    return (
                        <div
                            key={stat.label}
                            className={`group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${theme.border}`}
                        >
                            <div className="flex items-start justify-between gap-2">
                                <p className="text-sm font-medium leading-5 text-slate-500">
                                    {stat.label}
                                </p>

                                <div
                                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${theme.icon}`}
                                >
                                    <Icon size={21} />
                                </div>
                            </div>

                            <p className={`mt-4 text-3xl font-bold tracking-tight ${theme.number}`}>
                                {stat.value}
                            </p>

                            <p className="mt-2 text-xs text-slate-400">
                                {stat.description}
                            </p>

                            <div className={`absolute bottom-0 left-0 h-1 w-0 transition-all duration-300 group-hover:w-full ${theme.line}`} />
                        </div>
                    );
                })}
            </div>


            {/* Leave Type Breakdown */}
            <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-5">
                    <h2 className="text-base font-semibold text-slate-700">
                        Leave Type Breakdown
                    </h2>
                    <p className="mt-1 text-xs text-slate-400">
                        Overview by leave category
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                    {Object.entries(summary.by_type || {}).map(([type, count]) => (
                        <div
                            key={type}
                            className="rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-3 transition-colors hover:bg-slate-100"
                        >
                            <p className="text-xs font-medium text-slate-500">
                                {formatLeaveType(type)}
                            </p>

                            <p className="mt-2 text-xl font-semibold text-slate-700">
                                {count}
                            </p>
                        </div>
                    ))}
                </div>
            </div>



            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200 p-5">
                    <h2 className="text-lg font-bold text-gray-800">
                        Employees on Leave Today
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        {employees.length} employee(s) found
                    </p>
                </div>

                {employees.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No employees are on leave today.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px] text-left text-sm">
                            <thead className="bg-gray-50 text-gray-600">
                                <tr>
                                    <th className="px-5 py-3 font-semibold">Employee</th>
                                    <th className="px-5 py-3 font-semibold">Email</th>
                                    <th className="px-5 py-3 font-semibold">Leave Type</th>
                                    <th className="px-5 py-3 font-semibold">Duration</th>
                                    <th className="px-5 py-3 font-semibold">Days</th>
                                    <th className="px-5 py-3 font-semibold">Reason</th>
                                    <th className="px-5 py-3 font-semibold">Status</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {employees.map((employee) => (
                                    <tr key={employee.id} className="hover:bg-gray-50">
                                        <td className="px-5 py-4">
                                            <div className="font-medium text-gray-800">
                                                {employee.user?.name || "Unknown"}
                                            </div>
                                            <div className="mt-1 text-xs text-gray-500">
                                                ID: {employee.user_id}
                                            </div>
                                        </td>

                                        <td className="px-5 py-4 text-gray-600">
                                            {employee.user?.email || "—"}
                                        </td>

                                        <td className="px-5 py-4">
                                            <div>{formatLeaveType(employee.leave_type)}</div>
                                            {employee.half_day_type && (
                                                <div className="mt-1 text-xs text-gray-500">
                                                    {formatLeaveType(employee.half_day_type)}
                                                </div>
                                            )}
                                        </td>

                                        <td className="px-5 py-4 text-gray-600">
                                            {formatDate(employee.from_date)} –{" "}
                                            {formatDate(employee.to_date)}
                                        </td>

                                        <td className="px-5 py-4 text-gray-600">
                                            {employee.total_days ?? 0}
                                        </td>
                                        <td className="w-[150px] max-w-[150px] px-5 py-4 text-gray-600">
                                            <span className="block truncate" title={employee.reason || "—"}>
                                                {employee.reason
                                                    ? employee.reason.split(" ").slice(0, 2).join(" ") + (employee.reason.split(" ").length > 2 ? "..." : "")
                                                    : "—"}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            <span
                                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${employee.status === "approved"
                                                    ? "bg-green-100 text-green-700"
                                                    : employee.status === "rejected"
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                                    }`}
                                            >
                                                {formatLeaveType(employee.status)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TodaysLeaveSummary;