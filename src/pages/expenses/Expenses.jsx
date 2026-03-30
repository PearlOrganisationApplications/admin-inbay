import React, { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  Wallet, 
  CheckCircle, 
  XCircle, 
  Clock, 
  MapPin, 
  Navigation, 
  Eye, 
  Car, 
  Bike, 
  FileText,
  Calendar,
  ChevronRight,
  X
} from "lucide-react";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [report, setReport] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const TOKEN = "293|0c9Zqwm4c3GUEolDbL4xUDIAmxOwIS5oMXJj27Ti5f332c16";
  const BASE_URL = "https://test.pearl-developer.com/Inbay_Innovations/public/api/admin/expenses";

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Expenses List
      const listRes = await fetch(BASE_URL, {
        headers: { Authorization: `Bearer ${TOKEN}` },
      });
      const listData = await listRes.json();

      // 2. Fetch Summary Report (Month 3, Year 2026 as per your link)
      const reportRes = await fetch(`${BASE_URL}/report?month=3&year=2026`, {
        headers: { Authorization: `Bearer ${TOKEN}` },
      });
      const reportData = await reportRes.json();

      if (listData.success) setExpenses(listData.data.data);
      if (reportData.success) setReport(reportData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchExpenseDetail = async (id) => {
    setDetailLoading(true);
    setIsModalOpen(true);
    try {
      const res = await fetch(`${BASE_URL}/${id}`, {
        headers: { Authorization: `Bearer ${TOKEN}` },
      });
      const data = await res.json();
      if (data.success) setSelectedExpense(data.data);
    } catch (error) {
      console.error("Error fetching detail:", error);
    } finally {
      setDetailLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "approved": return "bg-green-100 text-green-700 border-green-200";
      case "rejected": return "bg-red-100 text-red-700 border-red-200";
      case "draft": return "bg-gray-100 text-gray-700 border-gray-200";
      default: return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
    </div>
  );

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans pb-20">
      {/* HEADER SECTION */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            <Wallet className="text-purple-600 w-8 h-8" />
            Expense Management
          </h1>
          <p className="text-gray-500 font-medium mt-1">Track and manage employee reimbursement claims</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
           <Calendar className="text-purple-600 w-5 h-5 ml-2" />
           <span className="font-bold text-gray-700 pr-4">{report?.month || "March 2026"}</span>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard title="Total Amount" value={`₹${report?.amount_summary.total_amount}`} icon={<LayoutDashboard />} color="bg-purple-600" />
        <StatsCard title="Approved" value={`₹${report?.amount_summary.approved_amount}`} icon={<CheckCircle />} color="bg-green-600" />
        <StatsCard title="Rejected" value={`₹${report?.amount_summary.rejected_amount}`} icon={<XCircle />} color="bg-red-600" />
        <StatsCard title="Pending" value={report?.summary.total_draft} icon={<Clock />} color="bg-orange-500" subtext="Draft items" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* TRAVEL BREAKDOWN */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Navigation className="w-5 h-5 text-purple-600" /> Travel Breakdown
            </h3>
            <div className="space-y-4">
              {report?.travel_breakdown.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      {item.mode === "car" ? <Car className="text-blue-500" /> : <Bike className="text-orange-500" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-700 capitalize">{item.mode}</p>
                      <p className="text-xs text-gray-500">{item.count} Trips</p>
                    </div>
                  </div>
                  <p className="font-black text-gray-900">₹{item.total_amount}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* EXPENSES LIST */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <h3 className="font-bold text-gray-800 text-lg">Recent Expenses</h3>
              <button className="text-purple-600 text-sm font-bold hover:underline">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">User</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Travel Details</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {expenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                            {exp.user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{exp.user.name}</p>
                            <p className="text-xs text-gray-500">{exp.expense_type}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <span className="font-medium">{exp.departure_location}</span>
                          <ChevronRight className="w-3 h-3 text-gray-400" />
                          <span className="font-medium">{exp.arrival_location}</span>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-wider">{exp.travel_mode} • {exp.distance} {exp.distance_unit}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-black text-gray-900">₹{exp.total_amount}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-tighter ${getStatusColor(exp.status)}`}>
                          {exp.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => fetchExpenseDetail(exp.id)}
                          className="p-2 hover:bg-purple-50 rounded-lg text-purple-600 transition-colors"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* DETAIL MODAL (SIDE OVER) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-white h-full shadow-2xl animate-slide-in p-0 flex flex-col">
            {detailLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-purple-600"></div>
              </div>
            ) : selectedExpense && (
              <>
                <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                  <h2 className="text-xl font-bold text-gray-900">Expense Details</h2>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                    <X className="w-6 h-6 text-gray-500" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                  {/* User Profile Info */}
                  <div className="flex items-center gap-4 bg-purple-50 p-4 rounded-2xl">
                    <div className="w-16 h-16 rounded-full bg-purple-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg">
                      {selectedExpense.user.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-gray-900">{selectedExpense.user.name}</h4>
                      <p className="text-sm text-purple-600 font-bold">{selectedExpense.user.email}</p>
                    </div>
                  </div>

                  {/* Route Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <DetailItem label="From" value={selectedExpense.departure_location} icon={<MapPin className="text-red-500"/>} />
                    <DetailItem label="To" value={selectedExpense.arrival_location} icon={<MapPin className="text-green-500"/>} />
                  </div>

                  <div className="bg-gray-50 p-5 rounded-2xl grid grid-cols-2 gap-y-6">
                    <DetailItem label="Travel Mode" value={selectedExpense.travel_mode} icon={<Car className="text-purple-600 w-4 h-4"/>} isCompact />
                    <DetailItem label="Total Distance" value={`${selectedExpense.distance} ${selectedExpense.distance_unit}`} icon={<Navigation className="text-purple-600 w-4 h-4"/>} isCompact />
                    <DetailItem label="DA Amount" value={`₹${selectedExpense.da_amount}`} icon={<Wallet className="text-purple-600 w-4 h-4"/>} isCompact />
                    <DetailItem label="Hotel Cost" value={`₹${selectedExpense.hotel_cost}`} icon={<Wallet className="text-purple-600 w-4 h-4"/>} isCompact />
                  </div>

                  {/* Total Amount Focus */}
                  <div className="border-2 border-dashed border-purple-200 p-6 rounded-2xl flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase">Total Reclaimable</p>
                      <p className="text-3xl font-black text-gray-900">₹{selectedExpense.total_amount}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase border ${getStatusColor(selectedExpense.status)}`}>
                      {selectedExpense.status}
                    </span>
                  </div>

                  {/* Purpose */}
                  <div>
                    <h5 className="text-xs font-bold text-gray-400 uppercase mb-2">Purpose of visit</h5>
                    <p className="text-gray-700 bg-gray-50 p-4 rounded-xl italic">"{selectedExpense.purpose || "No purpose provided"}"</p>
                  </div>

                  {/* Photos */}
                  <div>
                    <h5 className="text-xs font-bold text-gray-400 uppercase mb-3">Attachments & Proofs</h5>
                    {selectedExpense.photos.length > 0 ? (
                      <div className="grid grid-cols-2 gap-3">
                        {selectedExpense.photos.map((photo, i) => (
                          <div key={i} className="group relative rounded-xl overflow-hidden border border-gray-200">
                             {photo.photo_type === 'pdf' ? (
                               <div className="h-24 bg-gray-100 flex items-center justify-center flex-col gap-1 cursor-pointer">
                                  <FileText className="text-red-500" />
                                  <span className="text-[10px] font-bold">PDF FILE</span>
                               </div>
                             ) : (
                               <img src={photo.photo_url} alt="Proof" className="h-24 w-full object-cover" />
                             )}
                             <a href={photo.photo_url} target="_blank" rel="noreferrer" className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <Eye className="text-white w-6 h-6" />
                             </a>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 text-center py-4 bg-gray-50 rounded-xl border-2 border-dashed">No photos uploaded</p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// UI COMPONENTS
const StatsCard = ({ title, value, icon, color, subtext }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5">
    <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
      {React.cloneElement(icon, { size: 28 })}
    </div>
    <div>
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{title}</p>
      <p className="text-2xl font-black text-gray-900">{value}</p>
      {subtext && <p className="text-[10px] font-bold text-gray-400 mt-0.5">{subtext}</p>}
    </div>
  </div>
);

const DetailItem = ({ label, value, icon, isCompact }) => (
  <div className="flex gap-3">
    {icon && <div className={`mt-0.5 ${!isCompact && 'p-2 bg-gray-50 rounded-lg'}`}>{icon}</div>}
    <div>
      <p className="text-[10px] font-bold text-gray-400 uppercase">{label}</p>
      <p className={`${isCompact ? 'text-sm' : 'text-md'} font-bold text-gray-800 capitalize`}>{value || "N/A"}</p>
    </div>
  </div>
);

export default Expenses;