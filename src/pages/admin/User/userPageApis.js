const BASE_URL =
  "https://test.pearl-developer.com/Inbay_Innovations/public/api";

// userApi.js
export const fetchUsers = async (setUsers) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${BASE_URL}/admin/get/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    setUsers(Array.isArray(data) ? data : data?.data || []);
  } catch (err) {
    console.log(err);
  }
};


export const fetchSingleUser = async (
  userId,
  setSelectedUser,
  setIsViewModalOpen
) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${BASE_URL}/admin/get/user/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (response.ok && result.status) {
      setSelectedUser(result.data);
      setIsViewModalOpen(true);
    } else {
      alert("User fetch failed");
    }
  } catch (error) {
    alert("Error");
  }
};




export const handleResetPassword = async (
  selectedUserId,
  resetPassword,
  setIsResetModalOpen,
  setResetPassword,
  showToast
) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${BASE_URL}/admin/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: JSON.stringify({
        user_id: selectedUserId,
        password: resetPassword,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      showToast(data.message || "Something went wrong", "error");
      return;
    }

    showToast(data.message, "success");

    setIsResetModalOpen(false);
    setResetPassword("");
  } catch (err) {
    showToast(err.message || "Error", "error");
  }
};



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
    const token = localStorage.getItem("token");

    const response = await fetch(`${BASE_URL}/admin/create-user`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (response.ok) {
      showToast("User created successfully!", "success");
      setIsModalOpen(false);
      setFormData({
        name: "",
        email: "",
        password: "",
        per_km_rate: "",
      });

      fetchUsers();
    } else {
      showToast(result.message || "Failed to create user", "error");
    }
  } catch (error) {
    showToast("An error occurred. Please try again.", "error");
  } finally {
    setIsSubmitting(false);
  }
};




export const toggleUserStatus = async (
  userId,
  currentIsActive,
  showToast,
  fetchUsers
) => {
  try {
    const token = localStorage.getItem("token");

    // Agar current status 1 (Active) hai toh 0 (Deactivate) bhejenge, warna 1 (Activate)
    const newStatus = currentIsActive === 1 ? 0 : 1;

    const response = await fetch(`${BASE_URL}/admin/user-status`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        is_active: newStatus,
      }),
    });

    if (response.ok) {
      showToast(
        `User ${newStatus === 1 ? "Activated" : "Deactivated"} successfully!`,
        "success"
      );

      fetchUsers();
    } else {
      showToast("Failed to update user status", "error");
    }
  } catch (error) {
    showToast("Error connecting to server", "error");
  }
};