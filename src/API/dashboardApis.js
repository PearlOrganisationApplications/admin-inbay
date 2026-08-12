import api from "./axios";

export const getAdminAttendanceReport = () => {
    return api.get("/admin/attendance-report");
}

export const getUserTrackingById = (id) => {
    return api.get(`/tracking/${id}`);
}