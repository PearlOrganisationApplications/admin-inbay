import React from "react";
import { X } from "lucide-react";
import { handleCreateManager } from "../managerPageApis"; // adjust path

const CreateManagerModal = ({
  isOpen,
  setIsModalOpen,
  formData,
  setFormData,
  isSubmitting,
  setIsSubmitting,
  showToast,
  fetchManagers,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-indigo-50">
          <h2 className="text-xl font-bold text-gray-800">
            Create New Manager
          </h2>

          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form
          autoComplete="off"
          onSubmit={(e) =>
            handleCreateManager(
              e,
              formData,
              setIsSubmitting,
              setIsModalOpen,
              setFormData,
              showToast,
              fetchManagers
            )
          }
        >
          <div className="p-6 space-y-4">

            {/* Name */}
            <input
              type="text"
              name="manager-name"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck={false}
              required
              placeholder="Enter name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />

            {/* Email */}
            <input
              type="email"
              name="manager-email"
              autoComplete="off"
              required
              placeholder="manager@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />

            {/* Password */}
            <input
              type="password"
              name="manager-password"
              autoComplete="new-password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />

            {/* HQ */}
            <input
              type="text"
              name="manager-hq"
              autoComplete="off"
              required
              placeholder="Headquarters"
              value={formData.hq}
              onChange={(e) =>
                setFormData({ ...formData, hq: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />

          </div>

          {/* Footer */}
          <div className="px-6 py-4 flex gap-3 border-t">

            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create Manager"}
            </button>

          </div>
        </form>

      </div>
    </div>
  );
};

export default CreateManagerModal;