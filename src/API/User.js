import api from "./axios";

export const getAdminUsers = () => {
  return api.get("/admin/get/user");
};