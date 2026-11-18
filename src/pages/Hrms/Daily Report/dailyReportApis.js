import api from "../../../API/axios";

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
    let params = {};

    // DAILY
    if (reportType === "daily") {
      params.date = `${selectedYear}-${selectedMonth}-${selectedDay}`;
    }

    // WEEKLY
    else if (reportType === "weekly") {
      params = { start_date: weeklyStartDate, end_date: weeklyEndDate };
    }

    // MONTHLY
    else if (reportType === "monthly") {
      params = { month: selectedMonth, year: selectedYear };
    }

    // CUSTOM
    else if (reportType === "custom") {
      params = { start_date: customStartDate, end_date: customEndDate };
    }

    const res = await api.get("/daily-report", { params });
    const result = res.data;

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