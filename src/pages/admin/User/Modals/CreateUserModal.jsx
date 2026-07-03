import React from "react";
import { X } from "lucide-react";
import { handleCreateUser, fetchUsers } from "../userPageApis"; // path apne hisab se

const CreateUserModal = ({
    isOpen,
    setIsModalOpen,
    formData,
    setFormData,
    isSubmitting,
    setIsSubmitting,
    showToast,
    setUsers,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-purple-50">
                    <h2 className="text-xl font-bold text-gray-800">
                        Create New User
                    </h2>

                    <button
                        onClick={() => setIsModalOpen(false)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form
                    autoComplete="off"
                    onSubmit={(e) =>
                        handleCreateUser(
                            e,
                            formData,
                            setIsSubmitting,
                            setIsModalOpen,
                            setFormData,
                            showToast,
                            () => fetchUsers(setUsers)
                        )
                    }


                    className="p-6 space-y-4"
                >
                    <input
                        type="text"
                        name="username"
                        autoComplete="username"
                        style={{ display: "none" }}
                    />

                    <input
                        type="password"
                        name="password"
                        autoComplete="current-password"
                        style={{ display: "none" }}
                    />
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Full Name
                        </label>

                        <input
                            required
                            type="text"
                            name="create_user_name"
                            autoComplete="off"

                            placeholder="Enter name"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                            }
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Gmail Address
                        </label>

                        <input
                            required
                            type="email"
                            name="create_user_email"
                            autoComplete="new-email"
                            placeholder="example@gmail.com"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                            value={formData.email}
                            onChange={(e) =>
                                setFormData({ ...formData, email: e.target.value })
                            }
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Password
                        </label>

                        <input
                            required
                            type="password"
                            name="create_user_password"
                            autoComplete="new-password"
                            placeholder="••••••••"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                            value={formData.password}
                            onChange={(e) =>
                                setFormData({ ...formData, password: e.target.value })
                            }
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Headquarters
                        </label>

                        <input
                            required
                            type="text"
                            autoComplete="off"
                            placeholder="Enter headquarters"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                            value={formData.hq}
                            onChange={(e) =>
                                setFormData({ ...formData, hq: e.target.value })
                            }
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Per KM Rate
                        </label>

                        <input
                            required
                            type="number"
                            step="0.01"
                            placeholder="e.g. 12"
                            autoComplete="off"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                            value={formData.per_km_rate}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    per_km_rate: e.target.value,
                                })
                            }
                        />
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors shadow-md disabled:opacity-50"
                        >
                            {isSubmitting ? "Creating..." : "Create User"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateUserModal;