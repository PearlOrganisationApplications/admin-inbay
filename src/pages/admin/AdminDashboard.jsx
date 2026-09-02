import { useEffect, useMemo, useState } from "react";
import {
  FaUsers,
  FaCheckCircle,
  FaClock,
  FaUserTimes,
  FaTimes,
  FaMapMarkerAlt,
} from "react-icons/fa";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import {
  getAdminAttendanceReport,
  getUserTrackingById,
} from "../../API/dashboardApis";

import { getUserById } from "../../API/adminAuth";

const markerIcon = L.icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const latestMarkerIcon = L.divIcon({
  className: "",
  html: `
    <div style="
      width: 34px;
      height: 34px;
      background: #ef4444;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.35);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="
        width: 10px;
        height: 10px;
        background: white;
        border-radius: 50%;
      "></div>
    </div>
  `,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
  popupAnchor: [0, -17],
});

function MapUpdater({ tracking }) {
  const map = useMap();

  useEffect(() => {
    if (!tracking) return;

    const lat = Number(tracking.latitude);
    const lng = Number(tracking.longitude);

    if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
      map.setView([lat, lng], 16);
    }
  }, [tracking, map]);

  return null;
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [id, setId] = useState(null);
  const [user, setUser] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [userLoading, setUserLoading] = useState(false);

  const [userTracking, setUserTracking] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);

  const [selectedTracking, setSelectedTracking] = useState(null);

  const fetchUserTracking = async (userId) => {
    try {
      setTrackingLoading(true);

      const response = await getUserTrackingById(userId);
      const trackingResponse = response?.data ?? response;

      setUserTracking(trackingResponse);

      const trackingData = trackingResponse?.data || [];

      if (trackingData.length > 0) {
        const sorted = [...trackingData].sort((a, b) => {
          const dateA = new Date(
            `${a.tracking_date}T${a.tracking_time}`,
          ).getTime();

          const dateB = new Date(
            `${b.tracking_date}T${b.tracking_time}`,
          ).getTime();

          return dateA - dateB;
        });

        setSelectedTracking(sorted[sorted.length - 1]);
      } else {
        setSelectedTracking(null);
      }
    } catch (error) {
      console.error("Tracking error:", error);
      setSelectedTracking(null);
    } finally {
      setTrackingLoading(false);
    }
  };

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

  const handleUserClick = (userId) => {
    setId(userId);

    fetchUserById(userId);
    fetchUserTracking(userId);
  };

  const closeModal = () => {
    setShowModal(false);
    setUser(null);
    setUserTracking(null);
    setId(null);
  };

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

  const trackingData = useMemo(() => {
    if (!userTracking?.data) {
      return [];
    }

    return userTracking.data
      .map((item) => ({
        ...item,
        latitude: Number(item.latitude),
        longitude: Number(item.longitude),
      }))
      .filter(
        (item) => !Number.isNaN(item.latitude) && !Number.isNaN(item.longitude),
      );
  }, [userTracking]);

  const mapCenter =
    trackingData.length > 0
      ? [trackingData[0].latitude, trackingData[0].longitude]
      : [16.2748933, 80.41547];

  const route = trackingData
    .slice()
    .reverse()
    .map((item) => [item.latitude, item.longitude]);

  const sortedTrackingData = useMemo(() => {
    return [...trackingData].sort((a, b) => {
      const dateA = new Date(`${a.tracking_date}T${a.tracking_time}`).getTime();

      const dateB = new Date(`${b.tracking_date}T${b.tracking_time}`).getTime();

      return dateA - dateB;
    });
  }, [trackingData]);

  const latestLocation =
    sortedTrackingData.length > 0
      ? sortedTrackingData[sortedTrackingData.length - 1]
      : null;

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

          <p className="text-sm text-gray-500 mt-1">
            Today's Attendance Overview
          </p>
        </div>

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Late / Absent Users
            </h2>

            <ul className="space-y-3 max-h-[420px] overflow-y-auto pr-2">
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

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white w-full max-w-5xl rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
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

            <div className="p-6">
              {userLoading ? (
                <div className="flex justify-center py-10">
                  <div className="h-8 w-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
                </div>
              ) : user ? (
                <div className="space-y-6">
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

                  <div className="border-t pt-5">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          Location Tracking
                        </h3>

                        <p className="text-xs text-gray-400 mt-1">
                          Complete user location history
                        </p>
                      </div>

                      {!trackingLoading && (
                        <span className="text-xs font-medium bg-purple-100 text-purple-600 px-3 py-1 rounded-full">
                          {userTracking?.total_tracking_points ?? 0} Points
                        </span>
                      )}
                    </div>

                    {trackingLoading ? (
                      <div className="flex flex-col items-center justify-center py-10">
                        <div className="h-8 w-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />

                        <p className="text-xs text-gray-400 mt-3">
                          Loading tracking data...
                        </p>
                      </div>
                    ) : trackingData.length > 0 ? (
                      <>
                        {latestLocation && (
                          <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 mb-4">
                            <div className="flex items-center gap-2 mb-2">
                              <FaMapMarkerAlt className="text-red-500" />

                              <h4 className="text-sm font-semibold text-purple-700">
                                Latest Location
                              </h4>
                            </div>

                            <p className="text-sm font-medium text-gray-800">
                              {latestLocation.address || "Location unavailable"}
                            </p>

                            <div className="flex flex-wrap gap-3 mt-3">
                              <div className="bg-white rounded-lg px-3 py-2">
                                <p className="text-[10px] text-gray-400">
                                  Date
                                </p>

                                <p className="text-xs font-medium text-gray-700">
                                  {latestLocation.tracking_date}
                                </p>
                              </div>

                              <div className="bg-white rounded-lg px-3 py-2">
                                <p className="text-[10px] text-gray-400">
                                  Time
                                </p>

                                <p className="text-xs font-medium text-gray-700">
                                  {latestLocation.tracking_time}
                                </p>
                              </div>

                              <div className="bg-white rounded-lg px-3 py-2">
                                <p className="text-[10px] text-gray-400">
                                  Latitude
                                </p>

                                <p className="text-xs font-medium text-gray-700">
                                  {latestLocation.latitude}
                                </p>
                              </div>

                              <div className="bg-white rounded-lg px-3 py-2">
                                <p className="text-[10px] text-gray-400">
                                  Longitude
                                </p>

                                <p className="text-xs font-medium text-gray-700">
                                  {latestLocation.longitude}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="w-full h-[500px] rounded-xl overflow-hidden">
                          {selectedTracking ? (
                            <MapContainer
                              center={[
                                Number(selectedTracking.latitude),
                                Number(selectedTracking.longitude),
                              ]}
                              zoom={16}
                              scrollWheelZoom={true}
                              className="w-full h-full"
                            >
                              <MapUpdater tracking={selectedTracking} />

                              <TileLayer
                                attribution="&copy; OpenStreetMap contributors"
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                              />

                              <Marker
                                position={[
                                  Number(selectedTracking.latitude),
                                  Number(selectedTracking.longitude),
                                ]}
                                icon={latestMarkerIcon}
                              >
                                <Popup>
                                  <div className="min-w-[220px]">
                                    <h3 className="font-semibold text-lg mb-2">
                                      Selected Location
                                    </h3>

                                    <p>
                                      <strong>Date:</strong>{" "}
                                      {selectedTracking.tracking_date}
                                    </p>

                                    <p>
                                      <strong>Time:</strong>{" "}
                                      {selectedTracking.tracking_time}
                                    </p>

                                    <p>
                                      <strong>Address:</strong>{" "}
                                      {selectedTracking.address || "N/A"}
                                    </p>

                                    <p>
                                      <strong>Latitude:</strong>{" "}
                                      {selectedTracking.latitude}
                                    </p>

                                    <p>
                                      <strong>Longitude:</strong>{" "}
                                      {selectedTracking.longitude}
                                    </p>
                                  </div>
                                </Popup>
                              </Marker>
                            </MapContainer>
                          ) : (
                            <div className="h-full flex items-center justify-center bg-gray-100">
                              <p className="text-gray-500">
                                No tracking location available
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="mt-4">
                          <h4 className="text-sm font-semibold text-gray-700 mb-3">
                            Tracking History
                          </h4>

                          <div className="max-h-[300px] overflow-y-auto space-y-2">
                            {sortedTrackingData.map((tracking, index) => (
                              <div
                                key={tracking.id || index}
                                onClick={() => setSelectedTracking(tracking)}
                                className={`rounded-lg p-3 cursor-pointer transition border ${
                                  selectedTracking?.id === tracking.id
                                    ? "bg-purple-50 border-purple-400"
                                    : "bg-gray-50 border-transparent hover:bg-gray-100"
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <p className="text-xs font-semibold text-gray-700">
                                    Point #{index + 1}
                                  </p>

                                  <p className="text-xs text-gray-400">
                                    {tracking.tracking_date}{" "}
                                    {tracking.tracking_time}
                                  </p>
                                </div>

                                <p className="text-xs text-gray-500 mt-1">
                                  {tracking.address || "Address unavailable"}
                                </p>

                                <p className="text-[10px] text-gray-400 mt-1">
                                  {tracking.latitude}, {tracking.longitude}
                                </p>
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
