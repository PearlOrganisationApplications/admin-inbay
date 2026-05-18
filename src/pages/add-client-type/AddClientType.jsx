import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaSave,
    FaTimes,
    FaUserTag,
    FaAlignLeft,
} from "react-icons/fa";

const AddClientType = () => {
    const [clientTypes, setClientTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [showDeletePopup, setShowDeletePopup] = useState(false);

    const [formData, setFormData] = useState({
        type_name: "",
        description: "",
    });

    const [editId, setEditId] = useState(null);

    const token = localStorage.getItem("token");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const totalPages = Math.ceil(clientTypes.length / itemsPerPage);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const currentItems = clientTypes.slice(indexOfFirstItem, indexOfLastItem);

    // ================= PAGE CHANGE =================
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const getPaginationNumbers = () => {
        const pages = [];

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);

            if (currentPage > 3) pages.push("...");

            let start = Math.max(2, currentPage - 1);
            let end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 2) pages.push("...");

            pages.push(totalPages);
        }

        return pages;
    };

    // ================= GET =================
    const fetchClientTypes = async () => {
        try {
            setLoading(true);

            const res = await fetch(
                "https://test.pearl-developer.com/Inbay_Innovations/public/api/admin/client-types",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const result = await res.json();
            setClientTypes(result.data || []);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClientTypes();
    }, []);

    // ================= CHANGE =================
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // ================= ADD / UPDATE =================
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            let url =
                "https://test.pearl-developer.com/Inbay_Innovations/public/api/admin/client-types";

            // First Letter Capital Logic
            const capitalizeFirst = (text) =>
                text.trim().charAt(0).toUpperCase() + text.trim().slice(1);

            const typeName = capitalizeFirst(formData.type_name);
            const description = capitalizeFirst(formData.description);

            let payload = new FormData();
            payload.append("type_name", typeName);
            payload.append("description", description);

            if (editId) {
                url = `${url}/${editId}`;
            }

            const res = await fetch(url, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
                body: payload,
            });

            const result = await res.json();
            toast.success(result.message);

            if (res.ok) {
                fetchClientTypes();
                setShowForm(false);
                setEditId(null);

                setFormData({
                    type_name: "",
                    description: "",
                });
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    // ================= EDIT =================
    const handleEdit = (item) => {
        setFormData({
            type_name: item.type_name,
            description: item.description,
        });

        setEditId(item.id);
        setShowForm(true);
    };

    // ================= DELETE =================
    const handleDelete = async (id) => {
        setDeleteId(id);
        setShowDeletePopup(true);
    };

    const confirmDelete = async () => {
        try {
            await fetch(
                `https://test.pearl-developer.com/Inbay_Innovations/public/api/admin/client-types/${deleteId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success("Deleted Successfully");

            fetchClientTypes();
            setShowDeletePopup(false);
            setDeleteId(null);

        } catch (error) {
            console.log(error);
            toast.error("Delete Failed");
        }
    };

    // ================= OPEN ADD FORM =================
    const openAddForm = () => {
        setEditId(null);
        setFormData({
            type_name: "",
            description: "",
        });
        setShowForm(true);
    };

    return (

        <div className="w-full max-w-full overflow-x-hidden space-y-6 px-3 sm:px-4 lg:px-0">
            {/* Top */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h1 className="text-xl sm:text-2xl font-extrabold text-gray-800 break-words">
                    Client Type Dashboard
                </h1>

                <button
                    onClick={openAddForm}
                    className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white px-4 sm:px-5 py-3 rounded-xl flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                    <FaPlus />
                    Add Client Type
                </button>
            </div>

            {/* Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-3">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[92vh] overflow-y-auto p-4 sm:p-6">
                        <div className="flex items-center justify-between gap-3 mb-5">
                            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                                {editId ? "Update Client Type" : "Add Client Type"}
                            </h2>

                            <button
                                onClick={() => setShowForm(false)}
                                className="text-gray-500 text-xl shrink-0"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="relative">
                                <FaUserTag className="absolute left-4 top-4 text-purple-500" />

                                <input
                                    type="text"
                                    name="type_name"
                                    value={formData.type_name}
                                    onChange={handleChange}
                                    placeholder="Enter Type Name"
                                    className="w-full min-w-0 border border-gray-200 rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>

                            <div className="relative">
                                <FaAlignLeft className="absolute left-4 top-4 text-purple-500" />

                                <input
                                    type="text"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Enter Description"
                                    className="w-full min-w-0 border border-gray-200 rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                <button
                                    type="submit"
                                    className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-xl flex items-center justify-center gap-2"
                                >
                                    <FaSave />
                                    {editId ? "Update" : "Save"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-3 rounded-xl flex items-center justify-center gap-2"
                                >
                                    <FaTimes />
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Listing */}
            <div className="bg-white rounded-xl shadow-sm p-3 sm:p-5 lg:p-6 w-full max-w-full">
                <h2 className="text-base sm:text-lg font-bold mb-4 text-gray-800">
                    Client Type List
                </h2>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((item) => (
                            <div
                                key={item}
                                className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-pulse border-b pb-4"
                            >
                                <div className="h-4 bg-gray-200 rounded"></div>
                                <div className="h-4 bg-gray-200 rounded"></div>
                                <div className="h-4 bg-gray-200 rounded"></div>
                                <div className="h-4 bg-gray-200 rounded"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto w-full">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b text-left text-sm text-gray-500">
                                        <th className="py-3">#</th>
                                        <th className="py-3">Type Name</th>
                                        <th className="py-3">Description</th>
                                        <th className="py-3">Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {currentItems.map((item, index) => (
                                        <tr key={item.id} className="border-b">
                                            <td className="py-3">{indexOfFirstItem + index + 1}</td>
                                            <td className="py-3 font-medium">{item.type_name}</td>
                                            <td className="py-3">{item.description}</td>

                                            <td className="py-3">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEdit(item)}
                                                        className="bg-blue-100 text-blue-600 p-2 rounded-lg"
                                                    >
                                                        <FaEdit />
                                                    </button>

                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="bg-red-100 text-red-600 p-2 rounded-lg"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}

                                    {clientTypes.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="text-center py-5 text-gray-400">
                                                No Data Found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>


                        </div>


                        {/* Mobile Cards */}
                        <div className="grid grid-cols-1 gap-4 md:hidden">
                            {currentItems.map((item, index) => (
                                <div
                                    key={item.id}
                                    className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300"
                                >
                                    {/* Top */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <span className="text-xs font-medium bg-purple-100 text-purple-600 px-3 py-1 rounded-full">
                                                #{index + 1}
                                            </span>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"
                                            >
                                                <FaEdit />
                                            </button>

                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="h-9 w-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">
                                                Type Name
                                            </p>

                                            <p className="text-base font-semibold text-gray-800 break-words">
                                                {item.type_name}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">
                                                Description
                                            </p>

                                            <p className="text-sm text-gray-600 leading-6 break-words">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Bottom */}
                                    <div className="grid grid-cols-2 gap-3 mt-5">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="bg-blue-600 text-white py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-medium"
                                        >
                                            <FaEdit />
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="bg-red-600 text-white py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-medium"
                                        >
                                            <FaTrash />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {clientTypes.length === 0 && (
                                <div className="text-center py-10 text-gray-400 bg-white rounded-2xl shadow-sm">
                                    No Data Found
                                </div>
                            )}
                        </div>

                        {/* pagination UI  */}
                        {clientTypes.length > itemsPerPage && (
                            <div className="flex items-center gap-2 flex-wrap justify-center my-10">
                                <button
                                    onClick={handlePrev}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 rounded-lg border text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                                >
                                    Prev
                                </button>

                                {getPaginationNumbers().map((page, i) =>
                                    page === "..." ? (
                                        <span
                                            key={i}
                                            className="px-2 text-gray-500 font-bold"
                                        >
                                            ...
                                        </span>
                                    ) : (
                                        <button
                                            key={i}
                                            onClick={() => handlePageChange(page)}
                                            className={`h-10 w-10 rounded-lg text-sm font-medium transition ${currentPage === page
                                                ? "bg-purple-600 text-white"
                                                : "border hover:bg-gray-100"
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    )
                                )}

                                <button
                                    onClick={handleNext}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 rounded-lg border text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
            {showDeletePopup && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-xl animate-scaleIn">
                        <h2 className="text-xl font-semibold text-gray-800 mb-3">
                            Confirm Delete
                        </h2>

                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete this item?
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setShowDeletePopup(false);
                                    setDeleteId(null);
                                }}
                                className="px-4 py-2 rounded-lg border hover:bg-gray-100"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddClientType;