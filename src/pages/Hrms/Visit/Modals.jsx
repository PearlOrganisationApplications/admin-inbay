import { useEffect, useState } from "react";


export const DailyFilterPopup = ({
  open,
  onClose,
  onApply,
  selectedDay,
  selectedMonth,
  selectedYear,
}) => {
  const today = new Date(); // ✅ FIX: define today

  const [day, setDay] = useState(selectedDay || today.getDate());
  const [month, setMonth] = useState(selectedMonth || today.getMonth() + 1);
  const [year, setYear] = useState(selectedYear || today.getFullYear());

  if (!open) return null;

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const totalDays = new Date(year, month, 0).getDate();

  const daysArray = Array.from(
    { length: totalDays },
    (_, i) => i + 1
  );

  const years = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - i
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[90%] max-w-md rounded-xl p-5 shadow-lg">

        <h2 className="text-lg font-bold mb-4">Daily Filter</h2>

        {/* DAY */}
        <div className="mb-3">
          <label className="text-sm text-gray-600">Select Day</label>
          <select
            value={day}
            onChange={(e) => setDay(Number(e.target.value))}
            className="w-full border p-2 rounded-lg mt-1"
          >
            {daysArray.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* MONTH */}
        <div className="mb-3">
          <label className="text-sm text-gray-600">Select Month</label>
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="w-full border p-2 rounded-lg mt-1"
          >
            {months.map((m, i) => (
              <option key={i} value={i + 1}>{m}</option>
            ))}
          </select>
        </div>

        {/* YEAR */}
        <div className="mb-3">
          <label className="text-sm text-gray-600">Select Year</label>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="w-full border p-2 rounded-lg mt-1"
          >
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-2 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              onApply(day, month, year);
              onClose();
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg"
          >
            Apply
          </button>
        </div>

      </div>
    </div>
  );
};

export const CustomDatePopup = ({ open, onClose, onApply }) => {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  useEffect(() => {
    if (open) {
      setStart("");
      setEnd("");
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white w-[90%] max-w-md rounded-xl p-5 shadow-lg">

        <h2 className="text-lg font-bold mb-4">Custom Date Filter</h2>

        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-600">Start Date</label>
            <input
              type="date"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="w-full border p-2 rounded-lg mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">End Date</label>
            <input
              type="date"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="w-full border p-2 rounded-lg mt-1"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              onApply(start, end);
              onClose();
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg"
          >
            Apply
          </button>
        </div>

      </div>
    </div>
  );
};


export const MonthlyFilterPopup = ({ open, onClose, onApply, selectedMonth, selectedYear }) => {
  const [month, setMonth] = useState(selectedMonth);
  const [year, setYear] = useState(selectedYear);

  if (!open) return null;

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[90%] max-w-md rounded-xl p-5 shadow-lg">

        <h2 className="text-lg font-bold mb-4">Monthly Filter</h2>

        {/* MONTH SELECT */}
        <div className="mb-3">
          <label className="text-sm text-gray-600">Select Month</label>
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="w-full border p-2 rounded-lg mt-1"
          >
            {months.map((m, i) => (
              <option key={i} value={i + 1}>{m}</option>
            ))}
          </select>
        </div>

        {/* YEAR SELECT */}
        <div className="mb-3">
          <label className="text-sm text-gray-600">Select Year</label>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="w-full border p-2 rounded-lg mt-1"
          >
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-2 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              onApply(month, year);
              onClose();
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg"
          >
            Apply
          </button>
        </div>

      </div>
    </div>
  );
};

export const WeeklyFilterPopup = ({
  open,
  onClose,
  onApply,
  selectedEndDate,
}) => {
  const [endDate, setEndDate] = useState(selectedEndDate || "");

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[90%] max-w-md rounded-xl p-5 shadow-lg">

        <h2 className="text-lg font-bold mb-4">Weekly Filter</h2>

        {/* END DATE */}
        <div className="mb-3">
          <label className="text-sm text-gray-600">Select End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full border p-2 rounded-lg mt-1"
          />
        </div>

        <p className="text-xs text-gray-500 mb-3">
          Start date automatically calculated (7 days before end date)
        </p>

        {/* BUTTONS */}
        <div className="flex justify-end gap-2 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              onApply(endDate);
              onClose();
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg"
          >
            Apply
          </button>
        </div>

      </div>
    </div>
  );
};
