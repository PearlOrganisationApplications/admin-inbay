export const fetchManagers = async (setManagers) => {
  try {

    const token = localStorage.getItem("token");

    const response = await fetch(
      "https://test.pearl-developer.com/Inbay_Innovations/public/api/admin/managers",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    setManagers?.(Array.isArray(data) ? data : data?.data || []);
  } catch (error) {
    console.error("Manager API error:", error);
  }
};


export const toggleManagerStatus = async (
  managerId,
  currentIsActive,
  fetchManagers,
  showToast
) => {
  try {
    const token = localStorage.getItem("token");
    const newStatus = currentIsActive === 1 ? 0 : 1;

    const response = await fetch(
      "https://test.pearl-developer.com/Inbay_Innovations/public/api/admin/manager-status",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: managerId,
          is_active: newStatus,
        }),
      }
    );

    if (response.ok) {
      showToast?.(
        `Manager ${newStatus === 1 ? "Activated" : "Deactivated"} successfully!`,
        "success"
      );

      fetchManagers?.(); // refresh list
    } else {
      showToast?.("Failed to update manager status", "error");
    }
  } catch (error) {
    showToast?.("Error connecting to server", "error");
  }
};




export const handleCreateManager = async (
  e,
  formData,
  setIsSubmitting,
  setIsModalOpen,
  setFormData,
  showToast,
  fetchManagers
) => {
  e.preventDefault();
  setIsSubmitting?.(true);

  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      "https://test.pearl-developer.com/Inbay_Innovations/public/api/admin/create-manager",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    const result = await response.json();

    if (response.ok) {
      showToast?.("Manager created successfully!", "success");
      setIsModalOpen?.(false);
      setFormData?.({ name: "", email: "", password: "" });
      fetchManagers?.();
    } else {
      showToast?.(result.message || "Failed to create manager", "error");
    }
  } catch (error) {
    showToast?.("An error occurred. Please try again.", "error");
  } finally {
    setIsSubmitting?.(false);
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

    const res = await fetch(
      "https://test.pearl-developer.com/Inbay_Innovations/public/api/admin/reset-password",
      {
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
      }
    );

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





export const handleViewManager = async (
  managerId,
  setSelectedManagerData,
  setViewModalOpen,
  showToast
) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `https://test.pearl-developer.com/Inbay_Innovations/public/api/admin/manager/${managerId}/users`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    if (response.ok) {
      setSelectedManagerData(result.data);
      setViewModalOpen(true);
    } else {
      showToast("Failed to fetch manager details", "error");
    }
  } catch (error) {
    showToast("Error fetching manager details", "error");
  }
};