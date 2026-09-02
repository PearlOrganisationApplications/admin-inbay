import api from "./axios";

export const getAdminAttendanceReport = () => {
    return api.get("/admin/attendance-report");
}

export const getUserTrackingById = (id) => {
    return api.get(`/tracking/${id}`);
}



export const getUsersByManagerId = (managerId)=>{
    return api.get(`/admin/manager-users/${managerId}`);
}