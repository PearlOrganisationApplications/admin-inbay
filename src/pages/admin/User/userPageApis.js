// import api from "./axios";


// const BASE_URL =
//   "https://test.pearl-developer.com/Inbay_Innovations/public/api";

// // userApi.js
// export const fetchUsers = async (setUsers) => {
//   try {
//     const token = localStorage.getItem("token");

//     const response = await fetch(`${BASE_URL}/admin/get/user`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     const data = await response.json();
//     setUsers(Array.isArray(data) ? data : data?.data || []);
//   } catch (err) {
//     console.log(err);
//   }
// };


// export const fetchSingleUser = async (
//   userId,
//   setSelectedUser,
//   setIsViewModalOpen
// ) => {
//   try {
//     const token = localStorage.getItem("token");

//     const response = await fetch(`${BASE_URL}/admin/get/user/${userId}`, {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//     });

//     const result = await response.json();

//     if (response.ok && result.status) {
//       setSelectedUser(result.data);
//       setIsViewModalOpen(true);
//     } else {
//       alert("User fetch failed");
//     }
//   } catch (error) {
//     alert("Error");
//   }
// };




// export const handleResetPassword = async (
//   selectedUserId,
//   resetPassword,
//   setIsResetModalOpen,
//   setResetPassword,
//   showToast
// ) => {
//   try {
//     const token = localStorage.getItem("token");

//     const res = await fetch(`${BASE_URL}/admin/reset-password`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//         Accept: "application/json",
//       },
//       body: JSON.stringify({
//         user_id: selectedUserId,
//         password: resetPassword,
//       }),
//     });

//     const data = await res.json();

//     if (!res.ok) {
//       showToast(data.message || "Something went wrong", "error");
//       return;
//     }

//     showToast(data.message, "success");

//     setIsResetModalOpen(false);
//     setResetPassword("");
//   } catch (err) {
//     showToast(err.message || "Error", "error");
//   }
// };



// export const handleCreateUser = async (
//   e,
//   formData,
//   setIsSubmitting,
//   setIsModalOpen,
//   setFormData,
//   showToast,
//   fetchUsers
// ) => {
//   e.preventDefault();
//   setIsSubmitting(true);

//   try {
//     const token = localStorage.getItem("token");

//     const response = await fetch(`${BASE_URL}/admin/create-user`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(formData),
//     });

//     const result = await response.json();

//     if (response.ok) {
//       showToast("User created successfully!", "success");
//       setIsModalOpen(false);
//       setFormData({
//         name: "",
//         email: "",
//         password: "",
//         per_km_rate: "",
//       });

//       fetchUsers();
//     } else {
//       showToast(result.message || "Failed to create user", "error");
//     }
//   } catch (error) {
//     showToast("An error occurred. Please try again.", "error");
//   } finally {
//     setIsSubmitting(false);
//   }
// };




// export const toggleUserStatus = async (
//   userId,
//   currentIsActive,
//   showToast,
//   fetchUsers
// ) => {
//   try {
//     const token = localStorage.getItem("token");

//     // Agar current status 1 (Active) hai toh 0 (Deactivate) bhejenge, warna 1 (Activate)
//     const newStatus = currentIsActive === 1 ? 0 : 1;

//     const response = await fetch(`${BASE_URL}/admin/user-status`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         user_id: userId,
//         is_active: newStatus,
//       }),
//     });

//     if (response.ok) {
//       showToast(
//         `User ${newStatus === 1 ? "Activated" : "Deactivated"} successfully!`,
//         "success"
//       );

//       fetchUsers();
//     } else {
//       showToast("Failed to update user status", "error");
//     }
//   } catch (error) {
//     showToast("Error connecting to server", "error");
//   }
// };

// export const updateAdminUser = (id, payload) => {
//   return api.post(`/admin/user/update/${id}`, payload);
// };


import api from "../../../API/axios";

// Fetch All Users
export const fetchUsers = async (setUsers) => {
  try {
    const response = await api.get("/admin/get/user");

    const data = response.data;

    console.log("Users API Response:", data);

    setUsers(Array.isArray(data?.data) ? data.data : []);
  } catch (error) {
    console.error(
      "Fetch users error:",
      error.response?.data || error.message
    );
  }
};
// 2. Fetch Single User
export const fetchSingleUser = async (
  userId,
  setSelectedUser,
  setIsViewModalOpen
) => {
  try {
    const response = await api.get(
      `/admin/get/user/${userId}`
    );

    const result = response.data;

    if (result?.status || result?.success) {
      setSelectedUser(result.data);
      setIsViewModalOpen(true);
    } else {
      alert(result?.message || "User fetch failed");
    }
  } catch (error) {
    console.error(
      "Fetch single user error:",
      error.response?.data || error
    );

    alert(
      error.response?.data?.message ||
        "Error fetching user"
    );
  }
};

// 3. Reset Password
export const handleResetPassword = async (
  selectedUserId,
  resetPassword,
  setIsResetModalOpen,
  setResetPassword,
  showToast
) => {
  try {
    const response = await api.post(
      "/admin/reset-password",
      {
        user_id: selectedUserId,
        password: resetPassword,
      }
    );

    const data = response.data;

    if (data?.success === false || data?.status === false) {
      showToast(
        data.message || "Something went wrong",
        "error"
      );
      return;
    }

    showToast(
      data?.message || "Password reset successfully",
      "success"
    );

    setIsResetModalOpen(false);
    setResetPassword("");
  } catch (error) {
    console.error(
      "Reset password error:",
      error.response?.data || error
    );

    showToast(
      error.response?.data?.message ||
        "Failed to reset password",
      "error"
    );
  }
};

// 4. Create User
export const handleCreateUser = async (
  e,
  formData,
  setIsSubmitting,
  setIsModalOpen,
  setFormData,
  showToast,
  fetchUsers
) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    const response = await api.post(
      "/admin/create-user",
      formData
    );

    const result = response.data;

    if (
      result?.success === false ||
      result?.status === false
    ) {
      showToast(
        result.message || "Failed to create user",
        "error"
      );
      return;
    }

    showToast(
      result?.message || "User created successfully!",
      "success"
    );

    setIsModalOpen(false);

    setFormData({
      name: "",
      email: "",
      password: "",
      per_km_rate: "",
    });

    if (typeof fetchUsers === "function") {
      fetchUsers();
    }
  } catch (error) {
    console.error(
      "Create user error:",
      error.response?.data || error
    );

    showToast(
      error.response?.data?.message ||
        "An error occurred. Please try again.",
      "error"
    );
  } finally {
    setIsSubmitting(false);
  }
};

// 5. Toggle User Status
export const toggleUserStatus = async (
  userId,
  currentIsActive,
  showToast,
  fetchUsers
) => {
  try {
    const newStatus =
      Number(currentIsActive) === 1 ? 0 : 1;

    const response = await api.post(
      "/admin/user-status",
      {
        user_id: userId,
        is_active: newStatus,
      }
    );

    const result = response.data;

    if (
      result?.success === false ||
      result?.status === false
    ) {
      showToast(
        result.message || "Failed to update user status",
        "error"
      );
      return;
    }

    showToast(
      result?.message ||
        `User ${
          newStatus === 1 ? "Activated" : "Deactivated"
        } successfully!`,
      "success"
    );

    if (typeof fetchUsers === "function") {
      fetchUsers();
    }
  } catch (error) {
    console.error(
      "Toggle user status error:",
      error.response?.data || error
    );

    showToast(
      error.response?.data?.message ||
        "Error connecting to server",
      "error"
    );
  }
};

// 6. Update Admin User
export const updateAdminUser = (id, payload) => {
  return api.post(
    `/admin/user/update/${id}`,
    payload
  );
};
