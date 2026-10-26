import api from "./axios";

export const getAdminAttendanceReport = () => {
    return api.get("/admin/attendance-report");
}

export const getUserTrackingById = (id) => {
    return api.get(`/tracking/${id}`);
}



export const getUsersByManagerId = (managerId)=>{
    return api.get(`/admin/manager/${managerId}/users`);
}

export const removeUserFromManager = (payload) => {
  return api.delete("/admin/remove-user-from-manager", {
    data: payload,
  });
};

export const removeAllUserFromManager = (payload) => {
  return api.delete("/admin/remove-user-from-manager", {
    data: payload,
  });
};

