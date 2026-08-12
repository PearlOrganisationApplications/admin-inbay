import React from "react";

const VisitFilters = ({
  selectedEmployees,
  showEmployeeDropdown,
  setShowEmployeeDropdown,
  employeeSearch,
  setEmployeeSearch,

  uniqueEmployees,
  filteredEmployeeOptions,

  handleEmployeeSelect,
  handleSelectAllEmployees,

  reportType,

  setShowDailyPopup,
  setShowWeeklyPopup,
  setShowMonthlyPopup,
  setShowCustomPopup,

  dropdownRef,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">

      {/* Tabs */}

      <div className="flex flex-wrap gap-3 mb-6">
        {["monthly", "custom"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              if (tab === "daily") setShowDailyPopup(true);
              else if (tab === "weekly") setShowWeeklyPopup(true);
              else if (tab === "monthly") setShowMonthlyPopup(true);
              else if (tab === "custom") setShowCustomPopup(true);
            }}
            className={`h-10 px-6 rounded-full text-sm font-semibold transition-all duration-300
            ${
              reportType === tab
                ? "bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Filters */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">

        {/* Employee */}

        <div
          ref={dropdownRef}
          className="relative xl:col-span-2"
        >
          <div
            onClick={() =>
              setShowEmployeeDropdown(!showEmployeeDropdown)
            }
            className="h-12 rounded-2xl border border-gray-300 bg-white px-4 flex items-center justify-between cursor-pointer hover:border-purple-500 transition"
          >
            <span className="text-sm">
              {selectedEmployees.length === 0 ? (
                <span className="text-gray-400">
                  Search & Select Employees
                </span>
              ) : (
                <span className="font-semibold text-purple-600">
                  {selectedEmployees.length} Employees Selected
                </span>
              )}
            </span>

            <svg
              className={`w-5 h-5 transition ${
                showEmployeeDropdown ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          {showEmployeeDropdown && (
            <div className="absolute top-14 left-0 w-full bg-white rounded-2xl border shadow-xl z-50">

              <div className="p-3 border-b">
                <input
                  value={employeeSearch}
                  onChange={(e) =>
                    setEmployeeSearch(e.target.value)
                  }
                  placeholder="Search employee..."
                  className="w-full h-11 border rounded-xl px-3 outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <label className="flex items-center gap-2 px-4 py-3 border-b cursor-pointer">
                <input
                  type="checkbox"
                  checked={
                    selectedEmployees.length ===
                      uniqueEmployees.length &&
                    uniqueEmployees.length > 0
                  }
                  onChange={handleSelectAllEmployees}
                />

                Select All
              </label>

              <div className="max-h-60 overflow-y-auto">
                {filteredEmployeeOptions.map((name) => (
                  <label
                    key={name}
                    className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedEmployees.includes(name)}
                      onChange={() =>
                        handleEmployeeSelect(name)
                      }
                    />

                    {name}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>    

        {/* Reset */}

        <div className="flex gap-3">

          <button className="flex-1 h-12 rounded-2xl bg-gray-100 hover:bg-gray-200 font-semibold transition flex items-center justify-center gap-2">

            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 4v6h6M20 20v-6h-6M20 9A8 8 0 005 5l-1 1M4 15a8 8 0 0015 4l1-1"
              />
            </svg>

            Reset

          </button>

        </div>

      </div>
    </div>
  );
};

export default VisitFilters;