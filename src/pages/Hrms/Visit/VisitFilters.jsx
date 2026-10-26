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

  setShowMonthlyPopup,
  setShowCustomPopup,

  onReset,
  dropdownRef,
}) => {
  const tabs = ["monthly", "custom"];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-3 sm:p-4 mb-4 shrink-0">
      {/* Ek hi line: Monthly | Custom | Employee dropdown | Reset (mobile pe wrap hoga) */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Tabs */}
        <div className="flex items-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                if (tab === "monthly") setShowMonthlyPopup(true);
                else if (tab === "custom") setShowCustomPopup(true);
              }}
              className={`h-10 px-5 rounded-full text-sm font-semibold transition-all duration-300 ${
                reportType === tab
                  ? "bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Employee dropdown + Reset (desktop: Custom ke baad same line, mobile: full width next line) */}
        <div className="flex w-full sm:w-auto sm:flex-1 items-center gap-3 min-w-0">
          {/* Employee */}
          <div
            ref={dropdownRef}
            className="relative flex-1 min-w-0 sm:max-w-md"
          >
            <div
              onClick={() => setShowEmployeeDropdown(!showEmployeeDropdown)}
              className="h-10 rounded-xl border border-gray-300 bg-white px-3 flex items-center justify-between gap-2 cursor-pointer hover:border-purple-500 transition"
            >
              <span className="text-sm truncate">
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
                className={`w-4 h-4 shrink-0 transition ${
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
              <div className="absolute top-12 left-0 w-full min-w-[240px] bg-white rounded-xl border shadow-xl z-50">
                <div className="p-3 border-b">
                  <input
                    value={employeeSearch}
                    onChange={(e) => setEmployeeSearch(e.target.value)}
                    placeholder="Search employee..."
                    className="w-full h-10 border rounded-lg px-3 text-sm outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <label className="flex items-center gap-2 px-4 py-2.5 border-b cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    checked={
                      selectedEmployees.length === uniqueEmployees.length &&
                      uniqueEmployees.length > 0
                    }
                    onChange={handleSelectAllEmployees}
                  />
                  Select All
                </label>

                <div className="max-h-60 overflow-y-auto">
                  {filteredEmployeeOptions.length === 0 ? (
                    <p className="px-4 py-3 text-sm text-gray-400">
                      No employees found
                    </p>
                  ) : (
                    filteredEmployeeOptions.map((name) => (
                      <label
                        key={name}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedEmployees.includes(name)}
                          onChange={() => handleEmployeeSelect(name)}
                        />
                        {name}
                      </label>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Reset */}
          <button
            onClick={onReset}
            className="h-10 px-4 shrink-0 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm font-semibold transition flex items-center justify-center gap-2"
          >
            <svg
              className="w-4 h-4"
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