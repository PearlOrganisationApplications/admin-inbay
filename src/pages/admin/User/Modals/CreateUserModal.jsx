import React from "react";
import { X, User, Mail, Lock, MapPin, Briefcase, IndianRupee } from "lucide-react";
import { handleCreateUser, fetchUsers } from "../userPageApis";

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
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-4 flex items-center justify-between border-b bg-gradient-to-r from-purple-50 to-white">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">
                            Create New User
                        </h2>
                        <p className="text-sm text-gray-500">
                            Fill in the details below
                        </p>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(false)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition"
                    >
                        <X size={22} />
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
                    className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5"
                >
                    {/* Hidden Inputs */}
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

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Full Name
                        </label>

                        <div className="relative">
                            <User
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                required
                                type="text"
                                autoComplete="off"
                                placeholder="Enter full name"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        name: e.target.value,
                                    })
                                }
                                className="w-full pl-10 pr-4 py-2.5 text-sm border rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Gmail Address
                        </label>

                        <div className="relative">
                            <Mail
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                required
                                type="email"
                                autoComplete="off"
                                placeholder="example@gmail.com"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        email: e.target.value,
                                    })
                                }
                                className="w-full pl-10 pr-4 py-2.5 text-sm border rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Password
                        </label>

                        <div className="relative">
                            <Lock
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                required
                                type="password"
                                autoComplete="new-password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        password: e.target.value,
                                    })
                                }
                                className="w-full pl-10 pr-4 py-2.5 text-sm border rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none"
                            />
                        </div>
                    </div>

                    {/* Headquarters */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Headquarters
                        </label>

                        <div className="relative">
                            <MapPin
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                required
                                type="text"
                                autoComplete="off"
                                placeholder="Enter headquarters"
                                value={formData.hq}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        hq: e.target.value,
                                    })
                                }
                                className="w-full pl-10 pr-4 py-2.5 text-sm border rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none"
                            />
                        </div>
                    </div>

                    {/* Per KM Rate */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Per KM Rate
                        </label>

                        <div className="relative">
                            <IndianRupee
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                required
                                type="number"
                                step="0.01"
                                autoComplete="off"
                                placeholder="12"
                                value={formData.per_km_rate}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        per_km_rate: e.target.value,
                                    })
                                }
                                className="w-full pl-10 pr-4 py-2.5 text-sm border rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none"
                            />
                        </div>
                    </div>

                    {/* Designation */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Designation
                        </label>

                        <div className="relative">
                            <Briefcase
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                required
                                type="text"
                                autoComplete="off"
                                placeholder="Software Engineer"
                                value={formData.designation}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        designation: e.target.value,
                                    })
                                }
                                className="w-full pl-10 pr-4 py-2.5 text-sm border rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none"
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="md:col-span-2 flex justify-end gap-3 border-t pt-5 mt-2">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2.5 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
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