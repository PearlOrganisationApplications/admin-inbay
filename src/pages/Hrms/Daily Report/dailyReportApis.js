export const fetchReport = async (
  reportType,
  selectedDay,
  selectedMonth,
  selectedYear,
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
    if (reportType === "daily") {
      url = `https://test.pearl-developer.com/Inbay_Innovations/public/api/daily-report?date=${selectedYear}-${selectedMonth}-${selectedDay}`;
    }

    // WEEKLY
    else if (reportType === "weekly") {
      url = `https://test.pearl-developer.com/Inbay_Innovations/public/api/daily-report?start_date=${weeklyStartDate}&end_date=${weeklyEndDate}`;
    }

    // MONTHLY
    else if (reportType === "monthly") {
      url = `https://test.pearl-developer.com/Inbay_Innovations/public/api/daily-report?month=${selectedMonth}&year=${selectedYear}`;
    }

    // CUSTOM
    else if (reportType === "custom") {
      url = `https://test.pearl-developer.com/Inbay_Innovations/public/api/daily-report?start_date=${customStartDate}&end_date=${customEndDate}`;
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

    if (!result.success) return;

    const employees = result.data.flatMap((day) =>
      day.employees.map((emp) => ({
        ...emp,
        date: day.date,
        day: day.day,
      }))
    );

    setData?.(employees);

    const totalPresent = result.data.reduce(
      (acc, item) => acc + (item.summary?.total_present || 0),
      0
    );

    const totalAbsent = result.data.reduce(
      (acc, item) => acc + (item.summary?.total_absent || 0),
      0
    );

    setSummary?.({
      total_employees: result.data[0]?.summary?.total_employees || 0,
      total_present: totalPresent,
      total_absent: totalAbsent,
    });
  } catch (error) {
    console.log(error);
  }
};