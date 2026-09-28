export const fetchAttendance = async (
  activeTab,
  selectedDay,
  month,
  year,
  customStartDate,
  customEndDate,
  weeklyStartDate,
  weeklyEndDate,
  setRawResponse,
  setData,
  setSummary
) => {
  try {
    let url = "";

    // DAILY
    if (activeTab === "daily") {
      url = `https://test.pearl-developer.com/Inbay_Innovations/public/api/attendance/dashboard?date=${year}-${String(month).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`;
    }

    // WEEKLY
    else if (activeTab === "weekly") {
      url = `https://test.pearl-developer.com/Inbay_Innovations/public/api/attendance/dashboard?start_date=${weeklyStartDate}&end_date=${weeklyEndDate}`;
    }

    // MONTHLY
    else if (activeTab === "monthly") {
      url = `https://test.pearl-developer.com/Inbay_Innovations/public/api/attendance/dashboard?month=${month}&year=${year}`;
    }

    // CUSTOM
    else if (activeTab === "custom") {
      url = `https://test.pearl-developer.com/Inbay_Innovations/public/api/attendance/dashboard?start_date=${customStartDate}&end_date=${customEndDate}`;
    }

    const token = localStorage.getItem("token");

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    setRawResponse?.(result);

    // ================= MONTHLY =================
    if (activeTab === "monthly") {
      const allEmployees = result.data.flatMap((dayData) =>
        dayData.employees.map((emp) => ({
          id: `${emp.id}-${dayData.date}`,
          name: emp.name || "N/A",
          email: emp.email || "N/A",
          group: emp.group || "N/A",
          department: emp.department || "N/A",
          attendance: emp.status || "Absent",

          scheduledStart:
            emp.time_tracking?.scheduled?.split(" - ")[0] || "--",
          scheduledEnd:
            emp.time_tracking?.scheduled?.split(" - ")[1] || "--",

          actualStart: emp.time_tracking?.actual?.split(" - ")[0] || "--",
          actualEnd: emp.time_tracking?.actual?.split(" - ")[1] || "--",

          totalHours: emp.time_tracking?.total_hours || "0h 0m",

          location: emp.location,
          endLocation: emp.travel_details?.end_location || "--",

          distance: emp.travel_details?.total_distance || "0 KM",

          morningRemark: emp.remarks?.morning || "--",
          eveningRemark: emp.remarks?.evening || "--",
          remarks: emp.remarks?.general || "--",

          morningOdo:
            emp.travel_details?.odometer?.split(" → ")[0] || "0",
          eveningOdo:
            emp.travel_details?.odometer?.split(" → ")[1] || "0",

          attendance_images: emp.attendance_images || null,

          date: dayData.date,
          day: dayData.day,
        }))
      );

      setData?.(allEmployees);

      setSummary?.({
        total_employees: result.data[0]?.summary?.total_employees || 0,

        total_present: result.data.reduce(
          (acc, item) => acc + item.summary.total_present,
          0
        ),

        total_absent: result.data.reduce(
          (acc, item) => acc + item.summary.total_absent,
          0
        ),
      });
    }

    // ============== DAILY / WEEKLY / CUSTOM ==============
    else {
      const source = result.data
        ? result.data
        : result.employees
          ? [
            {
              date: result.date,
              day: result.day,
              summary: result.summary,
              employees: result.employees,
            },
          ]
          : [];

      const employees = source.flatMap((day) =>
        (day.employees || []).map((emp) => ({
          id: `${emp.id}-${day.date}`,

          name: emp.name || "N/A",
          email: emp.email || "N/A",
          group: emp.group || "N/A",
          department: emp.department || "N/A",

          attendance: emp.status || "Absent",

          scheduledStart:
            emp.time_tracking?.scheduled?.split(" - ")[0] || "--",
          scheduledEnd:
            emp.time_tracking?.scheduled?.split(" - ")[1] || "--",

          actualStart: emp.time_tracking?.actual?.split(" - ")[0] || "--",
          actualEnd: emp.time_tracking?.actual?.split(" - ")[1] || "--",

          totalHours: emp.time_tracking?.total_hours || "0h 0m",

          location: "Office",
          endLocation: emp.travel_details?.end_location || "--",

          remarks: emp.remarks?.general || "--",

          distance: emp.travel_details?.total_distance || "0 KM",

          morningRemark: emp.remarks?.morning || "--",
          eveningRemark: emp.remarks?.evening || "--",

          morningOdo:
            emp.travel_details?.odometer?.split(" → ")[0] || "0",
          eveningOdo:
            emp.travel_details?.odometer?.split(" → ")[1] || "0",

          date: emp.date,
          day: emp.day,

          attendance_images: emp.attendance_images || null,
        }))
      );

      setData?.(employees);

      setSummary?.({
        total_employees: source[0]?.summary?.total_employees || 0,

        total_present: source.reduce(
          (acc, item) => acc + (item.summary?.total_present || 0),
          0
        ),

        total_absent: source.reduce(
          (acc, item) => acc + (item.summary?.total_absent || 0),
          0
        ),
      });
    }
  } catch (error) {
    console.log(error);
  }
};