const BASE_URL =
  "https://test.pearl-developer.com/Inbay_Innovations/public/api/admin/expenses";

// ============================
// FETCH EXPENSES LIST
// ============================
export const fetchInitialData = async (
  setExpenses,
  setLoading
) => {
  setLoading(true);

  try {
    const token = localStorage.getItem("token");

    const res = await fetch(BASE_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const listData = await res.json();

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
    let url = "";

    if (filterMode === "date" && startDate && endDate) {
      url = `${BASE_URL}/report?start_date=${startDate}&end_date=${endDate}`;
    } else {
      url = `${BASE_URL}/report?month=${month}&year=${year}`;
    }

    const token = localStorage.getItem("token");

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

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
    const token = localStorage.getItem("token");

    const res = await fetch(`${BASE_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (data.success) {
      setSelectedExpense(data.data);
    }
  } catch (error) {
    console.error("Error fetching expense detail:", error);
  } finally {
    setDetailLoading(false);
  }
};