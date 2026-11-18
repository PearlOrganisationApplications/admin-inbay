import api from "../../API/axios";

// ============================
// FETCH EXPENSES LIST
// ============================
export const fetchInitialData = async (
  setExpenses,
  setLoading
) => {
  setLoading(true);

  try {
    const res = await api.get("/admin/expenses");
    const listData = res.data;

    if (listData.success) {
      setExpenses(listData.data?.data || []);
    }
  } catch (error) {
    console.error("Error fetching expenses:", error);
  } finally {
    setLoading(false);
  }
};

// ============================
// FETCH REPORT
// ============================
export const fetchReport = async (
  month,
  year,
  startDate,
  endDate,
  filterMode,
  setReport,
  setLoading
) => {
  setLoading(true);

  try {
    let params;

    if (filterMode === "date" && startDate && endDate) {
      params = { start_date: startDate, end_date: endDate };
    } else {
      params = { month, year };
    }

    const res = await api.get("/admin/expenses/report", { params });
    const data = res.data;

    if (data.success) {
      setReport(data);
    }
  } catch (error) {
    console.error("Error fetching report:", error);
  } finally {
    setLoading(false);
  }
};

// ============================
// FETCH EXPENSE DETAIL
// ============================
export const fetchExpenseDetail = async (
  id,
  setSelectedExpense,
  setDetailLoading,
  setIsModalOpen
) => {
  setDetailLoading(true);
  setIsModalOpen(true);

  try {
    const res = await api.get(`/admin/expenses/${id}`);
    const data = res.data;

    if (data.success) {
      setSelectedExpense(data.data);
    }
  } catch (error) {
    console.error("Error fetching expense detail:", error);
  } finally {
    setDetailLoading(false);
  }
};