import api from "./axios";

export const getAdminLeaves = (params) => {
  return api.get("/admin/leaves", { params });
};

export const approveAdminLeave = (leaveId, payload) => {
  return api.post(`/admin/leaves/${leaveId}/approve`, payload);
};

export const rejectAdminLeave = (leaveId, payload) => {
  return api.post(`/admin/leaves/${leaveId}/reject`, payload);
};


export const getAdminLeaveSummary = async () => {
  try {
    const response = await api.get("/admin/leaves/summary");
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching admin leave summary:",
      error.response?.data || error.message
    );
    throw error;
  }
};