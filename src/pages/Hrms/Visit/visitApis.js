import api from "../../../API/axios";

export const fetchVisitSummary = async (
  reportType,
  selectedDay,
  selectedMonth,
  selectedYear,
  weeklyStartDate,
  weeklyEndDate,
  customStartDate,
  customEndDate,
  setVisitData,
  setSummary,
  setRawResponse,
  setLoading
) => {
  try {
    setLoading(true);

    let params = {};

    if (reportType === "daily") {
      const date = `${selectedYear}-${selectedMonth}-${selectedDay}`;
      params = { date };
    } else if (reportType === "weekly") {
      params = { start_date: weeklyStartDate, end_date: weeklyEndDate };
    } else if (reportType === "monthly") {
      params = { month: selectedMonth, year: selectedYear };
    } else if (reportType === "custom") {
      params = { start_date: customStartDate, end_date: customEndDate };
    }

    const response = await api.get("/daily-Summary", { params });
    const json = response.data;

    setRawResponse(json);

    if (!json.success) return;

    const allVisits = [];

    json.data.forEach((day) => {
      day.visits.forEach((visit) => {
        allVisits.push({
          salesRepEmail: visit.user_details.email,
          salesRep: visit.user_details.name,
          customer: visit.customer_details.customer,
          phone: visit.customer_details.mobile,
          department: visit.user_details.team || "N/A",
          contactPerson: visit.customer_details.contact,
          address: visit.customer_details.address,
          city: visit.customer_details.address.split(" ").pop(),
          state: visit.user_details.state,
          order: `₹${visit.outcomes.order}`,
          expense: `₹${visit.outcomes.expense}`,
          actualVisitDate: day.date,
          actualVisitStartTime: visit.schedule_and_time.actual,
          durationTime: visit.schedule_and_time.duration,
          remark: visit.outcomes.remark,
          location: visit.location.checkin_address,
          signature: visit.signature,
        });
      });
    });

    setVisitData(allVisits);

    setSummary({
      total_visits: json.summary.total_visits,
      orders_placed: json.summary.orders_placed,
      total_expenses: json.summary.total_expenses,
    });
  } catch (error) {
    console.error("Error fetching daily summary:", error);
  } finally {
    setLoading(false);
  }
};