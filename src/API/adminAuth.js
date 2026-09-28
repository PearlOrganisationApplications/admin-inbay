import api from "./axios";

export const adminLogin = (data)=>{
return api.post('/admin-login', data)
}

export const getUserById = (id) => {
    return api.get(`/admin/get/user/${id}`)
}