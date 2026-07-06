import React from "react";
import { Search, CalendarDays, RotateCcw } from "lucide-react";

const AttendanceFilters = ({
    activeTab,
    setActiveTab,

    selectedDay,
    setSelectedDay,

    month,
    setMonth,

    year,
    setYear,

    weekType,
    setWeekType,

    customStartDate,
    setCustomStartDate,

    customEndDate,
    setCustomEndDate,

    employeeSearch,
    setEmployeeSearch,
    setSelectedEmployees,
    setShiftFilter,

    selectedEmployees,
    showEmployeeDropdown,
    setShowEmployeeDropdown,

    uniqueEmployees,
    filteredEmployeeOptions,

    handleEmployeeSelect,
    handleSelectAllEmployees,

    shiftFilter,
    uniqueShifts,
    handleShiftFilter,

    dropdownRef,
    daysArray,
    setShowCustomPopup,
    setShowDailyPopup,
    setShowWeeklyPopup,
    setShowMonthlyPopup,

}) => {
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const years = Array.from(
        { length: 6 },
        (_, i) => new Date().getFullYear() - 2 + i
    );

    const resetFilters = () => {
        setEmployeeSearch("");
        setSelectedEmployees?.([]);
        setActiveTab("daily");

        setSelectedDay(new Date().getDate());
        setMonth(new Date().getMonth() + 1);
        setYear(new Date().getFullYear());

        setWeekType("this_week");
        setShiftFilter("");

        setCustomStartDate("");
        setCustomEndDate("");
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 mb-6">

            {/* Tabs */}

            <div className="flex flex-wrap gap-2 mb-5">
                {["daily", "weekly", "monthly", "custom"].map((tab) => (
                    <button
                        key={tab}


                        onClick={() => {
                            setActiveTab(tab);

                            if (tab === "daily") {
                                setShowDailyPopup(true);
                            } else if (tab === "weekly") {
                                setShowWeeklyPopup(true);
                            } else if (tab === "monthly") {
                                setShowMonthlyPopup(true);
                            } else if (tab === "custom") {
                                setShowCustomPopup(true);
                            }
                        }}
                        className={`px-5 py-2 rounded-full text-sm font-semibold transition-all
              ${activeTab === tab
                                ? "bg-purple-600 text-white shadow"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

                {/* Search */}

                <div
                    ref={dropdownRef}
                    className="md:col-span-4 relative"
                >
                    <div
                        onClick={() => setShowEmployeeDropdown(!showEmployeeDropdown)}
                        className="w-full min-h-[46px] border border-gray-300 rounded-xl px-4 flex items-center justify-between cursor-pointer bg-white"
                    >
                        {selectedEmployees.length === 0 ? (
                            <span className="text-gray-400">
                                Search & Select Employees
                            </span>
                        ) : (
                            <span className="text-purple-600 font-semibold">
                                {selectedEmployees.length} Selected
                            </span>
                        )}
                    </div>

                    {showEmployeeDropdown && (
                        <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl border shadow-xl z-50 p-3">

                            <input
                                type="text"
                                autoComplete="off"
                                placeholder="Search employee..."
                                value={employeeSearch}
                                onChange={(e) => setEmployeeSearch(e.target.value)}
                                className="w-full border rounded-lg px-3 py-2 mb-3 outline-none focus:ring-2 focus:ring-purple-500"
                            />

                            <label className="flex items-center gap-2 mb-2 cursor-pointer">
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
                                {filteredEmployeeOptions.map((name) => (
                                    <label
                                        key={name}
                                        className="flex items-center gap-2 py-2 cursor-pointer hover:bg-gray-50 px-2 rounded-lg"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedEmployees.includes(name)}
                                            onChange={() => handleEmployeeSelect(name)}
                                        />

                                        {name}
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Shift Filter */}

                <div className="md:col-span-3">
                    <select
                        value={shiftFilter}
                        onChange={handleShiftFilter}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300"
                    >
                        <option value="">All Shifts</option>

                        {uniqueShifts.map((shift) => (
                            <option key={shift} value={shift}>
                                {shift}
                            </option>
                        ))}
                    </select>
                </div>



                {/* Reset */}

                <button
                    onClick={resetFilters}
                    className="md:col-span-2 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center gap-2 font-semibold transition"
                >
                    <RotateCcw size={18} />
                    Reset
                </button>
            </div>
        </div>
    );
};

export default AttendanceFilters;