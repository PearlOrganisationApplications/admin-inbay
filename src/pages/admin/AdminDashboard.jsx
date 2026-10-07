import { useEffect, useMemo, useState } from "react";
import {
  FaUsers,
  FaCheckCircle,
  FaClock,
  FaUserTimes,
  FaTimes,
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import { createPortal } from "react-dom";
import * as XLSX from "xlsx";
const CalendarPortal = ({ children }) => createPortal(children, document.body);
import "react-datepicker/dist/react-datepicker.css";
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

const endMarkerIcon = L.divIcon({
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
      color: white;
      font-size: 16px;
      font-weight: bold;
    ">
      E
    </div>
  `,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
  popupAnchor: [0, -17],
});

const startMarkerIcon = L.divIcon({
  className: "",
  html: `
    <div style="
      width: 36px;
      height: 36px;
      background: #16a34a;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.35);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 15px;
      font-weight: 700;
    ">S</div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  popupAnchor: [0, -18],
});

const customerVisitIcon = L.divIcon({
  className: "",
  html: `
    <div style="
      width: 36px;
      height: 36px;
      background: #2563eb;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.35);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 14px;
      font-weight: 700;
    ">V</div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  popupAnchor: [0, -18],
});

const checkInMarkerIcon = L.divIcon({
  className: "",
  html: `
    <div style="
      width: 36px;
      height: 36px;
      background: #f59e0b;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.35);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 14px;
      font-weight: 700;
    ">C</div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  popupAnchor: [0, -18],
});

// Keeps only the first entry for each user id
const uniqueUsers = (list = []) => {
  const map = new Map();
  list.forEach((u) => {
    if (!map.has(u.id)) map.set(u.id, u);
  });
  return [...map.values()];
};
const toDateObj = (str) => {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
};

const toDateStr = (date) => date.toLocaleDateString("en-CA");
const toRad = (deg) => (deg * Math.PI) / 180;

const distanceKm = (a, b) => {
  const R = 6371;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.latitude)) *
      Math.cos(toRad(b.latitude)) *
      Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
};

const toSeconds = (t) => {
  const [h = 0, m = 0, s = 0] = String(t).split(":").map(Number);
  return h * 3600 + m * 60 + s;
};
function MapUpdater({ route }) {
  const map = useMap();

  useEffect(() => {
    if (!route || route.length === 0) return;

    if (route.length === 1) {
      map.setView(route[0], 16);
    } else {
      map.fitBounds(route, {
        padding: [30, 30],
      });
    }
  }, [route, map]);

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
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const ITEMS_PER_PAGE = 20;

  const fetchUserTracking = async (userId) => {
    try {
      setTrackingLoading(true);

      const response = await getUserTrackingById(userId);
      const trackingResponse = response?.data ?? response;

      setUserTracking(trackingResponse);
    } catch (error) {
      console.error("Tracking error:", error);
      setUserTracking(null);
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
    setSelectedDate("");
    setCurrentPage(1);

    fetchUserById(userId);
    fetchUserTracking(userId);
  };

  const closeModal = () => {
    setShowModal(false);
    setUser(null);
    setUserTracking(null);
    setId(null);
    setSelectedDate("");
    setCurrentPage(1);
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

  /* ================= UNIQUE USER LISTS ================= */
  const presentUsers = useMemo(() => uniqueUsers(data?.present_users), [data]);
  const lateUsers = useMemo(() => uniqueUsers(data?.late_users), [data]);
  const absentUsers = useMemo(() => uniqueUsers(data?.absent_users), [data]);

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

  /* ================= TRACKING DATA ================= */
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

  const sortedTrackingData = useMemo(() => {
    return [...trackingData].sort((a, b) => {
      const dateA = new Date(`${a.tracking_date}T${a.tracking_time}`).getTime();
      const dateB = new Date(`${b.tracking_date}T${b.tracking_time}`).getTime();

      return dateA - dateB;
    });
  }, [trackingData]);

  const availableDates = useMemo(() => {
    return [...new Set(sortedTrackingData.map((item) => item.tracking_date))]
      .filter(Boolean)
      .sort((a, b) => new Date(b) - new Date(a));
  }, [sortedTrackingData]);
  const availableDateObjects = useMemo(
    () => availableDates.map(toDateObj),
    [availableDates],
  );

  // availableDates newest first hai: index+1 = purani date, index-1 = nayi date
  const selectedIndex = availableDates.indexOf(selectedDate);
  const olderDate = availableDates[selectedIndex + 1];
  const newerDate = availableDates[selectedIndex - 1];
  useEffect(() => {
    if (availableDates.length === 0) {
      setSelectedDate("");
      return;
    }

    if (!selectedDate || !availableDates.includes(selectedDate)) {
      setSelectedDate(availableDates[0]);
      setCurrentPage(1);
    }
  }, [availableDates, selectedDate]);

  // Step 1: selected day's points, duplicates removed
  const dayTrackingData = useMemo(() => {
    if (!selectedDate) return [];

    const seen = new Set();

    return sortedTrackingData
      .filter((item) => item.tracking_date === selectedDate)
      .filter((item) => {
        // same time + same location = duplicate point
        const key = `${item.tracking_time}-${item.latitude}-${item.longitude}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
  }, [sortedTrackingData, selectedDate]);

  // Step 2: GPS jump filter (unrealistic speed = noise)
  const cleanDayTrackingData = useMemo(() => {
    const MAX_SPEED_KMH = 150;

    const result = [];

    dayTrackingData.forEach((point) => {
      const last = result[result.length - 1];

      if (!last) {
        result.push(point);
        return;
      }

      const seconds =
        toSeconds(point.tracking_time) - toSeconds(last.tracking_time);

      if (seconds <= 0) {
        result.push(point);
        return;
      }

      const speed = distanceKm(last, point) / (seconds / 3600);

      // Very high speed = GPS jump, skip
      if (speed <= MAX_SPEED_KMH) {
        result.push(point);
      }
    });

    return result;
  }, [dayTrackingData]);

  const dayStartPoint = cleanDayTrackingData[0] ?? null;
  const dayEndPoint =
    cleanDayTrackingData[cleanDayTrackingData.length - 1] ?? null;

  const customerVisits = useMemo(() => {
    const isTruthy = (value) =>
      value === true ||
      value === 1 ||
      ["true", "1", "yes"].includes(
        String(value ?? "")
          .trim()
          .toLowerCase(),
      );

    return cleanDayTrackingData.filter((item) => {
      const explicitVisit =
        item.customer_visit ??
        item.is_customer_visit ??
        item.isCustomerVisit ??
        item.customerVisit ??
        item.visit;

      if (isTruthy(explicitVisit)) return true;

      const visitType = String(
        item.visit_type ??
          item.point_type ??
          item.location_type ??
          item.tracking_type ??
          "",
      )
        .trim()
        .toLowerCase()
        .replace(/[_-]/g, " ");

      return [
        "customer visit",
        "customer",
        "visit",
        "check in",
        "checkin",
      ].includes(visitType);
    });
  }, [cleanDayTrackingData]);
  const totalDistanceKm = useMemo(() => {
    let total = 0;
    for (let i = 1; i < cleanDayTrackingData.length; i++) {
      total += distanceKm(cleanDayTrackingData[i - 1], cleanDayTrackingData[i]);
    }
    return total;
  }, [cleanDayTrackingData]);
  const normalizeTime = (value) => {
    if (!value) return "";

    const raw = String(value).trim().toLowerCase();

    const ampmMatch = raw.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(am|pm)$/);

    if (ampmMatch) {
      let hour = Number(ampmMatch[1]);
      const minute = ampmMatch[2];

      if (ampmMatch[3] === "pm" && hour !== 12) hour += 12;
      if (ampmMatch[3] === "am" && hour === 12) hour = 0;

      return `${String(hour).padStart(2, "0")}:${minute}`;
    }

    const twentyFourHourMatch = raw.match(/^(\d{1,2}):(\d{2})/);

    if (twentyFourHourMatch) {
      return `${String(Number(twentyFourHourMatch[1])).padStart(2, "0")}:${twentyFourHourMatch[2]}`;
    }

    return raw;
  };

  const attendanceCheckInPoints = useMemo(() => {
    const checkInTime = normalizeTime(user?.check_in_time);
    if (!checkInTime) return [];

    // attendance_time format: "2026-10-01 07:53:32"
    const attendanceDate = user?.attendance_time?.split(" ")[0];

    // Show check-in only on the date it belongs to
    if (!attendanceDate || attendanceDate !== selectedDate) return [];

    return cleanDayTrackingData.filter(
      (item) => normalizeTime(item.tracking_time) === checkInTime,
    );
  }, [
    cleanDayTrackingData,
    user?.check_in_time,
    user?.attendance_time,
    selectedDate,
  ]);

  const route = useMemo(
    () => cleanDayTrackingData.map((item) => [item.latitude, item.longitude]),
    [cleanDayTrackingData],
  );

  const totalPages = Math.max(
    1,
    Math.ceil(cleanDayTrackingData.length / ITEMS_PER_PAGE),
  );

  const paginatedTrackingData = cleanDayTrackingData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const todayDate = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD
  const isTodaySelected = selectedDate === todayDate;
  const handleDownloadExcel = () => {
    if (!cleanDayTrackingData.length) return;

    const visitSet = new Set(customerVisits);
    const checkInSet = new Set(attendanceCheckInPoints);
    const lastIndex = cleanDayTrackingData.length - 1;

    const rows = cleanDayTrackingData.map((p, i) => {
      const types = [];
      if (i === 0) types.push("Day Start");
      if (i === lastIndex && lastIndex !== 0) types.push("Day End");
      if (visitSet.has(p)) types.push("Customer Visit");
      if (checkInSet.has(p)) types.push("Attendance Check-in");
      if (!types.length) types.push("GPS Point");

      return {
        "Point #": i + 1,
        Date: p.tracking_date,
        Time: p.tracking_time,
        Latitude: p.latitude,
        Longitude: p.longitude,
        Address: p.address || "N/A",
        "Point Type": types.join(" + "),
      };
    });

    const summary = [
      ["Employee", user?.name || "N/A"],
      ["Email", user?.email || "N/A"],
      ["Report Date", selectedDate],
      [
        "Day Start",
        `${dayStartPoint?.tracking_time || "N/A"} - ${dayStartPoint?.address || "N/A"}`,
      ],
      [
        "Day End",
        `${dayEndPoint?.tracking_time || "N/A"} - ${dayEndPoint?.address || "N/A"}`,
      ],
      ["Total Distance (KM)", Number(totalDistanceKm.toFixed(2))],
      ["Customer Visits", customerVisits.length],
      ["Total GPS Points", cleanDayTrackingData.length],
    ];

    const wsSummary = XLSX.utils.aoa_to_sheet(summary);
    wsSummary["!cols"] = [{ wch: 22 }, { wch: 70 }];

    const wsPoints = XLSX.utils.json_to_sheet(rows);
    wsPoints["!cols"] = [
      { wch: 8 },
      { wch: 12 },
      { wch: 10 },
      { wch: 12 },
      { wch: 12 },
      { wch: 60 },
      { wch: 28 },
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, wsSummary, "Summary");
    XLSX.utils.book_append_sheet(wb, wsPoints, "Checkpoints");

    const safeName = (user?.name || "user").replace(/[^a-z0-9]+/gi, "_");
    XLSX.writeFile(wb, `${safeName}_tracking_${selectedDate}.xlsx`);
  };
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
              {presentUsers.length > 0 ? (
                presentUsers.map((u) => (
                  <li
                    key={u.id}
                    onClick={() => handleUserClick(u.id)}
                    className="flex items-center justify-between border-b pb-3 last:border-b-0 cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-purple-100 overflow-hidden flex items-center justify-center">
                        <span className="text-sm font-semibold text-purple-600">
                          {u.name?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {u.name}
                        </p>

                        <p className="text-xs text-gray-400">{u.email}</p>

                        <p className="text-xs text-gray-400">
                          Check In: {u.check_in_time}
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
              {lateUsers.map((u) => (
                <li
                  key={`late-${u.id}`}
                  onClick={() => handleUserClick(u.id)}
                  className="flex items-center justify-between border-b pb-3 last:border-b-0 cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-yellow-100 overflow-hidden flex items-center justify-center">
                      <span className="text-sm font-semibold text-yellow-600">
                        {u.name?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {u.name}
                      </p>

                      <p className="text-xs text-gray-400">{u.email}</p>

                      <p className="text-xs text-gray-400">
                        Check In: {u.check_in_time}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full">
                    Late
                  </span>
                </li>
              ))}

              {absentUsers.map((u) => (
                <li
                  key={`absent-${u.id}`}
                  onClick={() => handleUserClick(u.id)}
                  className="flex items-center justify-between border-b pb-3 last:border-b-0 cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                      <span className="text-sm font-semibold text-red-600">
                        {u.name?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {u.name}
                      </p>

                      <p className="text-xs text-gray-400">{u.email}</p>

                      <p className="text-xs text-red-400">No check-in today</p>
                    </div>
                  </div>

                  <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                    Absent
                  </span>
                </li>
              ))}

              {!lateUsers.length && !absentUsers.length && (
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
                          Day-wise GPS route, travel points and visit locations
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-medium text-gray-500">
                          Report Date
                        </label>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedDate(olderDate);
                            setCurrentPage(1);
                          }}
                          disabled={!olderDate}
                          className="px-2 py-2 text-xs rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                          title="Previous day"
                        >
                          ◀
                        </button>

                        <DatePicker
                          selected={
                            selectedDate ? toDateObj(selectedDate) : null
                          }
                          onChange={(date) => {
                            if (!date) return;
                            setSelectedDate(toDateStr(date));
                            setCurrentPage(1);
                          }}
                          includeDates={availableDateObjects}
                          highlightDates={availableDateObjects}
                          dateFormat="yyyy-MM-dd"
                          placeholderText="No dates"
                          disabled={availableDates.length === 0}
                          popperContainer={CalendarPortal}
                          popperPlacement="bottom-start"
                          fixedHeight // 👈 NEW: hamesha 6 rows, calendar complete dikhega
                          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white text-gray-700 w-40 text-center focus:outline-none focus:ring-2 focus:ring-purple-200"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedDate(newerDate);
                            setCurrentPage(1);
                          }}
                          disabled={!newerDate}
                          className="px-2 py-2 text-xs rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                          title="Next day"
                        >
                          ▶
                        </button>
                      </div>

                      {!trackingLoading && (
                        <span className="text-xs font-medium bg-purple-100 text-purple-600 px-3 py-1 rounded-full">
                          {cleanDayTrackingData.length} Points
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
                    ) : cleanDayTrackingData.length > 0 ? (
                      <>
                        {/* ================= DAILY REPORT SUMMARY ================= */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                          <div className="rounded-xl border border-green-100 bg-green-50 p-4">
                            <p className="text-[11px] font-medium text-green-600">
                              Day Start
                            </p>
                            <p className="text-sm font-semibold text-gray-800 mt-1">
                              {dayStartPoint?.tracking_time || "N/A"}
                            </p>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                              {dayStartPoint?.address || "Location unavailable"}
                            </p>
                          </div>

                          <div className="rounded-xl border border-red-100 bg-red-50 p-4">
                            <p className="text-[11px] font-medium text-red-600">
                              Day End
                            </p>
                            <p className="text-sm font-semibold text-gray-800 mt-1">
                              {dayEndPoint?.tracking_time || "N/A"}
                            </p>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                              {dayEndPoint?.address || "Location unavailable"}
                            </p>
                          </div>

                          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                            <p className="text-[11px] font-medium text-blue-600">
                              Total Distance
                            </p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">
                              {totalDistanceKm.toFixed(2)} KM
                            </p>
                            <p className="text-xs text-gray-500">
                              Travelled on {selectedDate}
                            </p>
                          </div>

                          <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4">
                            <p className="text-[11px] font-medium text-indigo-600">
                              Customer Visits
                            </p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">
                              {customerVisits.length}
                            </p>
                            <p className="text-xs text-gray-500">
                              Visit points highlighted on map
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 mb-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-full bg-green-600 border border-white shadow" />
                            Day Start
                          </span>
                          <span className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-full bg-red-500 border border-white shadow" />
                            Day End
                          </span>
                          <span className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-full bg-blue-600 border border-white shadow" />
                            Customer Visit
                          </span>
                          {attendanceCheckInPoints.length > 0 && (
                            <span className="flex items-center gap-1.5">
                              <span className="w-3 h-3 rounded-full bg-amber-500 border border-white shadow" />
                              Attendance Check-in
                            </span>
                          )}
                        </div>

                        <div className="relative z-0 w-full h-[500px] rounded-xl overflow-hidden">
                          <MapContainer
                            center={route[0]}
                            zoom={16}
                            scrollWheelZoom={true}
                            className="w-full h-full"
                          >
                            <MapUpdater route={route} />

                            <TileLayer
                              attribution="&copy; OpenStreetMap contributors"
                              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />

                            <Polyline
                              positions={route}
                              pathOptions={{
                                color: "#7c3aed",
                                weight: 4,
                                opacity: 0.8,
                              }}
                            />

                            {/* DAY START POINT */}
                            {dayStartPoint && (
                              <Marker
                                position={[
                                  dayStartPoint.latitude,
                                  dayStartPoint.longitude,
                                ]}
                                icon={startMarkerIcon}
                              >
                                <Popup>
                                  <div className="min-w-[210px]">
                                    <h3 className="font-semibold text-base mb-2 text-green-600">
                                      Day Start Point
                                    </h3>
                                    <p>
                                      <strong>Date:</strong>{" "}
                                      {dayStartPoint.tracking_date}
                                    </p>
                                    <p>
                                      <strong>Time:</strong>{" "}
                                      {dayStartPoint.tracking_time}
                                    </p>
                                    <p>
                                      <strong>Address:</strong>{" "}
                                      {dayStartPoint.address || "N/A"}
                                    </p>
                                    <p>
                                      <strong>Latitude:</strong>{" "}
                                      {dayStartPoint.latitude}
                                    </p>
                                    <p>
                                      <strong>Longitude:</strong>{" "}
                                      {dayStartPoint.longitude}
                                    </p>
                                  </div>
                                </Popup>
                              </Marker>
                            )}

                            {/* DAY END POINT */}
                            {dayEndPoint && (
                              <Marker
                                position={[
                                  dayEndPoint.latitude,
                                  dayEndPoint.longitude,
                                ]}
                                icon={endMarkerIcon}
                              >
                                <Popup>
                                  <div className="min-w-[210px]">
                                    <h3 className="font-semibold text-base mb-2 text-red-600">
                                      Day End Point
                                    </h3>
                                    <p>
                                      <strong>Date:</strong>{" "}
                                      {dayEndPoint.tracking_date}
                                    </p>
                                    <p>
                                      <strong>Time:</strong>{" "}
                                      {dayEndPoint.tracking_time}
                                    </p>
                                    <p>
                                      <strong>Address:</strong>{" "}
                                      {dayEndPoint.address || "N/A"}
                                    </p>
                                    <p>
                                      <strong>Latitude:</strong>{" "}
                                      {dayEndPoint.latitude}
                                    </p>
                                    <p>
                                      <strong>Longitude:</strong>{" "}
                                      {dayEndPoint.longitude}
                                    </p>
                                  </div>
                                </Popup>
                              </Marker>
                            )}

                            {/* CUSTOMER VISIT POINTS */}
                            {customerVisits.map((visit, visitIndex) => (
                              <Marker
                                key={`customer-visit-${visit.id || visitIndex}`}
                                position={[visit.latitude, visit.longitude]}
                                icon={customerVisitIcon}
                              >
                                <Popup>
                                  <div className="min-w-[210px]">
                                    <h3 className="font-semibold text-base mb-2 text-blue-600">
                                      Customer Visit
                                    </h3>
                                    <p>
                                      <strong>Date:</strong>{" "}
                                      {visit.tracking_date}
                                    </p>
                                    <p>
                                      <strong>Time:</strong>{" "}
                                      {visit.tracking_time}
                                    </p>
                                    <p>
                                      <strong>Address:</strong>{" "}
                                      {visit.address || "N/A"}
                                    </p>
                                    <p>
                                      <strong>Latitude:</strong>{" "}
                                      {visit.latitude}
                                    </p>
                                    <p>
                                      <strong>Longitude:</strong>{" "}
                                      {visit.longitude}
                                    </p>
                                  </div>
                                </Popup>
                              </Marker>
                            ))}

                            {/* ATTENDANCE CHECK-IN POINTS */}
                            {attendanceCheckInPoints.map(
                              (point, pointIndex) => (
                                <Marker
                                  key={`check-in-${point.id || pointIndex}`}
                                  position={[point.latitude, point.longitude]}
                                  icon={checkInMarkerIcon}
                                >
                                  <Popup>
                                    <div className="min-w-[210px]">
                                      <h3 className="font-semibold text-base mb-2 text-amber-600">
                                        Attendance Check-in
                                      </h3>
                                      <p>
                                        <strong>Date:</strong>{" "}
                                        {point.tracking_date}
                                      </p>
                                      <p>
                                        <strong>Time:</strong>{" "}
                                        {point.tracking_time}
                                      </p>
                                      <p>
                                        <strong>Address:</strong>{" "}
                                        {point.address || "N/A"}
                                      </p>
                                    </div>
                                  </Popup>
                                </Marker>
                              ),
                            )}
                          </MapContainer>
                        </div>
                        {customerVisits.length > 0 && (
                          <div className="mt-4">
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">
                              Visit Points ({customerVisits.length})
                            </h4>

                            <div className="space-y-2">
                              {customerVisits.map((visit, index) => (
                                <div
                                  key={visit.id || index}
                                  className="flex items-start gap-3 rounded-lg p-3 bg-blue-50 border border-blue-100"
                                >
                                  <span className="h-6 w-6 shrink-0 flex items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold">
                                    V
                                  </span>

                                  <div>
                                    <p className="text-xs font-semibold text-gray-700">
                                      Visit {index + 1} · {visit.tracking_time}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                      {visit.address || "Address unavailable"}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="mt-4 flex justify-end">
                          <button
                            type="button"
                            onClick={handleDownloadExcel}
                            className="px-4 py-2 text-sm font-medium rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition"
                          >
                            Download Excel
                          </button>
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

                  {/* ================= ATTENDANCE ================= */}
                  <div className="border-t pt-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                      Today's Attendance
                    </h3>

                    {isTodaySelected ? (
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
                    ) : (
                      <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-500">
                        Attendance details are available only for today. For{" "}
                        {selectedDate || "the selected date"}, see the GPS
                        report above.
                      </div>
                    )}
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
