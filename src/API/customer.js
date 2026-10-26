import api from "./axios";

export const getAdminCustomers = (params = {}) => {
  return api.get("/admin/customers", {
    params: {
      search: params.search || "",
      client_type_id: params.client_type_id || "",
      user_id: params.user_id || "",
      per_page: params.per_page || 20,
      page: params.page || 1,
    },
  });
};

export const updateAdminCustomer = (id, payload) => {
  return api.post(`/admin/customer/update/${id}`, payload);
};

export const deleteAdminCustomer = (id) => {
  return api.delete(`/admin/customers/${id}`);
};
export const getAdminClientTypes = () => {
  return api.get("/admin/client-types");
};