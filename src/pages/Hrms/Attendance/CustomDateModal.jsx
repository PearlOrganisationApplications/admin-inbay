import React from "react";
import { X, CalendarDays } from "lucide-react";

const CustomDateModal = ({
  isOpen,
  setShowCustomPopup,
  customStartDate,
  setCustomStartDate,
  customEndDate,
  setCustomEndDate,
  setActiveTab,
}) => {
  if (!isOpen) return null;

  const handleApply = () => {
    if (!customStartDate || !customEndDate) {
      return alert("Please select start and end date");
    }

    if (new Date(customEndDate) < new Date(customStartDate)) {
      return alert("End date cannot be before start date");
    }

    setShowCustomPopup(false);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">

      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}

        <div className="px-6 py-5 border-b bg-purple-50 flex justify-between items-center">

          <div className="flex items-center gap-2">
            <CalendarDays className="text-purple-600" size={22} />
            <h2 className="text-lg font-bold text-gray-800">
              Custom Date Range
            </h2>
          </div>

          <button
            onClick={() => {
              setShowCustomPopup(false);
              setActiveTab("monthly");
            }}
            className="text-gray-400 hover:text-gray-700 transition"
          >
            <X size={22} />
          </button>

        </div>

        {/* Body */}

        <div className="p-6 space-y-5">

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Start Date
            </label>

            <input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              End Date
            </label>

            <input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

        </div>

        {/* Footer */}

        <div className="px-6 py-4 border-t flex gap-3">

          <button
            onClick={() => {
              setShowCustomPopup(false);
              setActiveTab("monthly");
            }}
            className="flex-1 py-2.5 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            onClick={handleApply}
            className="flex-1 py-2.5 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-700"
          >
            Apply Filter
          </button>

        </div>

      </div>

    </div>
  );
};

export default CustomDateModal;