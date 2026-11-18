
import api from "../../../API/axios";

// 1. Fetch All Managers
export const fetchManagers = async () => {
  const response = await api.get("/admin/managers");
  const data = response.data;
  const managers = Array.isArray(data) ? data : data?.data;

  if (!Array.isArray(managers)) {
    throw new Error("Unexpected managers API response");
  }

  return managers;
};

// 2. Toggle Manager Status
export const toggleManagerStatus = async (
  managerId,
  currentIsActive,
  refreshManagers,
  showToast
) => {
  try {
    const newStatus =
      Number(currentIsActive) === 1 ? 0 : 1;

    const response = await api.post(
      "/admin/user-status",
      {
        user_id: managerId,
        is_active: newStatus,
      }
    );

    const result = response.data;

    if (
      result?.success === false ||
      result?.status === false
    ) {
      showToast?.(
        result.message || "Failed to update manager status",
        "error"
      );
      return null;
    }

    showToast?.(
      result?.message ||
        `Manager ${
          newStatus === 1 ? "Activated" : "Deactivated"
        } successfully!`,
      "success"
    );

    await refreshManagers?.();
    return newStatus;
  } catch (error) {
    console.error(
      "Toggle manager status error:",
      error.response?.data || error
    );

    showToast?.(
      error.response?.data?.message ||
        "Error connecting to server",
      "error"
    );
    return null;
  }
};

// 3. Create Manager
export const handleCreateManager = async (
  e,
  formData,
  setIsSubmitting,
  setIsModalOpen,
  setFormData,
  showToast,
  refreshManagers
) => {
  e.preventDefault();
  setIsSubmitting?.(true);

  try {
    const response = await api.post(
      "/admin/create-manager",
      formData
    );

    const result = response.data;

    if (
      result?.success === false ||
      result?.status === false
    ) {
      showToast?.(
        result.message || "Failed to create manager",
        "error"
      );
      return;
    }

    showToast?.(
      result?.message || "Manager created successfully!",
      "success"
    );

    setIsModalOpen?.(false);

    setFormData?.({
      name: "",
      email: "",
      password: "",
      hq: "",
    });

    await refreshManagers?.();
  } catch (error) {
    console.error(
      "Create manager error:",
      error.response?.data || error
    );

    showToast?.(
      error.response?.data?.message ||
        "An error occurred. Please try again.",
      "error"
    );
  } finally {
    setIsSubmitting?.(false);
  }
};

// 4. Reset Password
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

    if (
      data?.success === false ||
      data?.status === false
    ) {
      showToast?.(
        data.message || "Something went wrong",
        "error"
      );
      return;
    }

    showToast?.(
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

    showToast?.(
      error.response?.data?.message ||
        "Failed to reset password",
      "error"
    );
  }
};

// 5. View Manager Details
export const handleViewManager = async (
  managerId,
  setSelectedManagerData,
  setViewModalOpen,
  showToast
) => {
  try {
    const response = await api.get(
      // `/admin/manager/users/${managerId}`
      `/admin/manager/${managerId}/users`
    );

    const result = response.data;

    if (result?.success === false || result?.status === false) {
      showToast?.(
        result.message || "Failed to fetch manager details",
        "error"
      );
      return;
    }

    setSelectedManagerData(result.data);
    setViewModalOpen(true);
  } catch (error) {
    console.error(
      "View manager error:",
      error.response?.data || error
    );

    showToast?.(
      error.response?.data?.message ||
        "Error fetching manager details",
      "error"
    );
  }
};
