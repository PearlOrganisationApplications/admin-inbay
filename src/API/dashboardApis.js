import api from "./axios";

export const getAdminAttendanceReport = () => {
    return api.get("/admin/attendance-report");
}

