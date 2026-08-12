import { useEffect, useState } from "react";
import {
  FaUsers,
  FaCheckCircle,
  FaClock,
  FaUserTimes,
  FaTimes,
} from "react-icons/fa";

import {
  getAdminAttendanceReport,
  getUserTrackingById,
} from "../../API/dashboardApis";
import { getUserById } from "../../API/adminAuth";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Selected user
  const [id, setId] = useState(null);
  const [user, setUser] = useState(null);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const [userTracking, setUserTracking] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);

 const fetchUserTracking = async (userId) => {
  try {
    setTrackingLoading(true);

    const response = await getUserTrackingById(userId);


    const trackingResponse = response?.data ?? response;

    setUserTracking(trackingResponse);
  } catch (error) {
    console.error("Get User Tracking Error:", error);
    setUserTracking(null);
  } finally {
    setTrackingLoading(false);
  }
};

  // Fetch single user
  const fetchUserById = async (userId) => {
    try {
      setUserLoading(true);

      const response = await getUserById(userId);

      console.log("Single User Response:", response);
      const userData = response?.data?.data ?? response?.data ?? response;

      setUser(userData);
      setShowModal(true);
    } catch (error) {
      console.error("Get User By ID Error:", error);
    } finally {
      setUserLoading(false);
    }
  };

  // User click
  const handleUserClick = (userId) => {
    setId(userId);
    fetchUserById(userId);
    fetchUserTracking(userId);
  };

  // Close modal
 const closeModal = () => {
  setShowModal(false);
  setUser(null);
  setUserTracking(null);
  setId(null);
};

  // Attendance API
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);

        const res = await getAdminAttendanceReport();

        console.log("Attendance API Response:", res.data);

        if (res.data?.success) {
          setData(res.data);
        }
      } catch (error) {
        console.error("Attendance API error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  const stats = [
    {
      title: "Total Users",
      value: data?.total_users ?? 0,
      icon: FaUsers,
    },
    {
      title: "Present",
      value: data?.present ?? 0,
      icon: FaCheckCircle,
    },
    {
      title: "Late",
      value: data?.late ?? 0,
      icon: FaClock,
    },
    {
      title: "Absent",
      value: data?.absent ?? 0,
      icon: FaUserTimes,
    },
  ];

  return (
    <>
      <div className="space-y-6">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

          <p className="text-sm text-gray-500 mt-1">
            Today's Attendance Overview
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-between hover:shadow-md transition"
              >
                <div>
                  <p className="text-sm text-gray-400">{item.title}</p>

                  <h2 className="text-2xl font-bold text-gray-800 mt-1">
                    {loading ? "..." : item.value}
                  </h2>
                </div>

                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-purple-100 text-purple-600">
                  <Icon className="text-xl" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Users Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Present Users */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Present Users
              </h2>

              <span className="text-xs bg-green-100 text-green-600 px-3 py-1 rounded-full">
                {data?.present ?? 0} Users
              </span>
            </div>

            <ul className="space-y-3 max-h-[420px] overflow-y-auto pr-2">
              {data?.present_users?.length > 0 ? (
                data.present_users.map((user) => (
                  <li
                    key={user.id}
                    onClick={() => handleUserClick(user.id)}
                    className="flex items-center justify-between border-b pb-3 last:border-b-0 cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-purple-100 overflow-hidden flex items-center justify-center">
                        <span className="text-sm font-semibold text-purple-600">
                          {user.name?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {user.name}
                        </p>

                        <p className="text-xs text-gray-400">{user.email}</p>

                        <p className="text-xs text-gray-400">
                          Check In: {user.check_in_time}
                        </p>
                      </div>
                    </div>

                    <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                      Present
                    </span>
                  </li>
                ))
              ) : (
                <p className="text-sm text-gray-400">No Present Users</p>
              )}
            </ul>
          </div>

          {/* Late + Absent Users */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Late / Absent Users
            </h2>

            <ul className="space-y-3 max-h-[420px] overflow-y-auto pr-2">
              {/* Late Users */}
              {data?.late_users?.map((user) => (
                <li
                  key={`late-${user.id}`}
                  onClick={() => handleUserClick(user.id)}
                  className="flex items-center justify-between border-b pb-3 last:border-b-0 cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-yellow-100 overflow-hidden flex items-center justify-center">
                      <span className="text-sm font-semibold text-yellow-600">
                        {user.name?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {user.name}
                      </p>

                      <p className="text-xs text-gray-400">{user.email}</p>

                      <p className="text-xs text-gray-400">
                        Check In: {user.check_in_time}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full">
                    Late
                  </span>
                </li>
              ))}

              {/* Absent Users */}
              {data?.absent_users?.map((user) => (
                <li
                  key={`absent-${user.id}`}
                  onClick={() => handleUserClick(user.id)}
                  className="flex items-center justify-between border-b pb-3 last:border-b-0 cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                      <span className="text-sm font-semibold text-red-600">
                        {user.name?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {user.name}
                      </p>

                      <p className="text-xs text-gray-400">{user.email}</p>

                      <p className="text-xs text-red-400">No check-in today</p>
                    </div>
                  </div>

                  <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                    Absent
                  </span>
                </li>
              ))}

              {!data?.late_users?.length && !data?.absent_users?.length && (
                <p className="text-sm text-gray-400">No Late or Absent Users</p>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* ================= USER DETAILS MODAL ================= */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white w-full max-w-lg rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  User Details
                </h2>

                {id && (
                  <p className="text-xs text-gray-400 mt-1">User ID: {id}</p>
                )}
              </div>

              <button
                onClick={closeModal}
                className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500"
              >
                <FaTimes />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {userLoading ? (
                <div className="flex justify-center py-10">
                  <div className="h-8 w-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
                </div>
              ) : user ? (
                <div className="space-y-5">
                  {/* Profile */}
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center">
                      <span className="text-2xl font-bold text-purple-600">
                        {user.name?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {user.name || "N/A"}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {user.email || "No email"}
                      </p>
                    </div>
                  </div>

                  {/* Details */}
                  {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-400">
                        Mobile Number
                      </p>
                      <p className="text-sm font-medium text-gray-800 mt-1">
                        {user.mobile_number || "N/A"}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-400">
                        Role
                      </p>
                      <p className="text-sm font-medium text-gray-800 mt-1">
                        {user.role || "N/A"}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-400">
                        Designation
                      </p>
                      <p className="text-sm font-medium text-gray-800 mt-1">
                        {user.designation || "N/A"}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-400">
                        Team
                      </p>
                      <p className="text-sm font-medium text-gray-800 mt-1">
                        {user.team || "N/A"}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-400">
                        HQ
                      </p>
                      <p className="text-sm font-medium text-gray-800 mt-1">
                        {user.hq || "N/A"}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-400">
                        State
                      </p>
                      <p className="text-sm font-medium text-gray-800 mt-1">
                        {user.state || "N/A"}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-400">
                        Date of Joining
                      </p>
                      <p className="text-sm font-medium text-gray-800 mt-1">
                        {user.date_of_joining || "N/A"}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-400">
                        Status
                      </p>
                      <p
                        className={`text-sm font-medium mt-1 ${
                          user.is_active
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {user.is_active ? "Active" : "Inactive"}
                      </p>
                    </div>

                  </div> */}

                  {/* ================= TRACKING ================= */}
                  {/* ================= TRACKING ================= */}
                  <div className="border-t pt-5">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-700">
                          Location Tracking
                        </h3>

                        <p className="text-xs text-gray-400 mt-1">
                          User's recorded location history
                        </p>
                      </div>

                      {!trackingLoading && (
                        <span className="text-xs font-medium bg-purple-100 text-purple-600 px-3 py-1 rounded-full">
                          {userTracking?.total_tracking_points ?? 0} Points
                        </span>
                      )}
                    </div>

                    {/* Tracking Loading */}
                    {trackingLoading ? (
                      <div className="flex flex-col items-center justify-center py-10">
                        <div className="h-8 w-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />

                        <p className="text-xs text-gray-400 mt-3">
                          Loading tracking data...
                        </p>
                      </div>
                    ) : userTracking?.data?.length > 0 ? (
                      <>
                        {/* Latest Location */}
                        <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-semibold text-purple-700">
                              Latest Location
                            </h4>

                            <span className="text-xs bg-white text-purple-600 px-2 py-1 rounded-full">
                              Latest
                            </span>
                          </div>

                          {(() => {
                            const latestLocation = [...userTracking.data].sort(
                              (a, b) => {
                                const dateA = new Date(
                                  `${a.tracking_date} ${a.tracking_time}`,
                                );

                                const dateB = new Date(
                                  `${b.tracking_date} ${b.tracking_time}`,
                                );

                                return dateB - dateA;
                              },
                            )[0];

                            return (
                              <>
                                <p className="text-sm font-medium text-gray-800">
                                  {latestLocation?.address ||
                                    "Location unavailable"}
                                </p>

                                <div className="flex flex-wrap gap-3 mt-3">
                                  <div className="bg-white rounded-lg px-3 py-2">
                                    <p className="text-[10px] text-gray-400 uppercase">
                                      Date
                                    </p>

                                    <p className="text-xs font-medium text-gray-700">
                                      {latestLocation?.tracking_date || "N/A"}
                                    </p>
                                  </div>

                                  <div className="bg-white rounded-lg px-3 py-2">
                                    <p className="text-[10px] text-gray-400 uppercase">
                                      Time
                                    </p>

                                    <p className="text-xs font-medium text-gray-700">
                                      {latestLocation?.tracking_time || "N/A"}
                                    </p>
                                  </div>

                                  <div className="bg-white rounded-lg px-3 py-2">
                                    <p className="text-[10px] text-gray-400 uppercase">
                                      Coordinates
                                    </p>

                                    <p className="text-xs font-medium text-gray-700">
                                      {latestLocation?.latitude},{" "}
                                      {latestLocation?.longitude}
                                    </p>
                                  </div>
                                </div>
                              </>
                            );
                          })()}
                        </div>

                        {/* Tracking History */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-semibold text-gray-700">
                              Tracking History
                            </h4>

                            <span className="text-xs text-gray-400">
                              {userTracking.data.length} records
                            </span>
                          </div>

                          <div className="max-h-[300px] overflow-y-auto pr-2 space-y-2">
                            {userTracking.data.map((tracking, index) => (
                              <div
                                key={tracking.id || index}
                                className="relative flex gap-3 bg-gray-50 hover:bg-gray-100 rounded-lg p-3 transition"
                              >
                                <div className="flex flex-col items-center">
                                  <div className="h-8 w-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-semibold">
                                    {index + 1}
                                  </div>

                                  {index !== userTracking.data.length - 1 && (
                                    <div className="w-px h-full bg-gray-200 mt-1" />
                                  )}
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-2">
                                    <p className="text-xs font-semibold text-gray-700">
                                      {tracking.tracking_time ||
                                        "Time unavailable"}
                                    </p>

                                    <span className="text-[10px] text-gray-400">
                                      {tracking.tracking_date || "N/A"}
                                    </span>
                                  </div>

                                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                    {tracking.address || "Address unavailable"}
                                  </p>

                                  <p className="text-[10px] text-gray-400 mt-2">
                                    {tracking.latitude}, {tracking.longitude}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="bg-gray-50 rounded-xl p-6 text-center">
                        <p className="text-sm text-gray-400">
                          No tracking data available
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Attendance */}
                  <div className="border-t pt-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                      Today's Attendance
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-400">
                          Attendance Status
                        </p>

                        <p className="text-sm font-medium text-gray-800 mt-1">
                          {user.attendance_status || "N/A"}
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-400">Check In</p>

                        <p className="text-sm font-medium text-gray-800 mt-1">
                          {user.check_in_time || "No check-in"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-400 py-10">
                  User data not found
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
