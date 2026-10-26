import React, { useEffect, useState, useCallback } from "react";
// NOTE: apna sahi path yahan set karein (getAdminClientTypes jis file me hai wahan se import karein)
import {
  getAdminCustomers,
  deleteAdminCustomer,
  getAdminClientTypes,
} from "../../API/customer";
import EditCustomerModal from "./Editcustomermodal";

const formatDate = (iso) => {
  if (!iso) return "-";
  const d = new Date(iso);
  return isNaN(d.getTime())
    ? "-"
    : d.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
};

const val = (v) => (v === null || v === undefined || v === "" ? "-" : v);


const extractList = (res) => {
  const body = res?.data;
  if (Array.isArray(body?.data)) return body.data;
  if (Array.isArray(body?.data?.data)) return body.data.data;
  if (Array.isArray(body)) return body;
  return [];
};

export default function Customer() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  // client types (filter dropdown)
  const [clientTypes, setClientTypes] = useState([]);
  const [typesLoading, setTypesLoading] = useState(false);

  // filters
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [clientTypeId, setClientTypeId] = useState("");
  const [userId, setUserId] = useState("");
  const [perPage, setPerPage] = useState(20);
  const [page, setPage] = useState(1);

  // pagination meta
  const [meta, setMeta] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    from: 0,
    to: 0,
  });

  // edit / delete state
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // page load par client types fetch karo
  useEffect(() => {
    let cancelled = false;

    const fetchClientTypes = async () => {
      try {
        setTypesLoading(true);
        const res = await getAdminClientTypes();
        // Each item: { id, type_name, description, ... }
        if (!cancelled) setClientTypes(extractList(res));
      } catch (err) {
        if (!cancelled) setClientTypes([]);
        console.error("Failed to load client types", err);
      } finally {
        if (!cancelled) setTypesLoading(false);
      }
    };

    fetchClientTypes();
    return () => {
      cancelled = true;
    };
  }, []);

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 500);
    return () => clearTimeout(t);
  }, [searchInput]);

  // toast auto hide
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getAdminCustomers({
        search,
        client_type_id: clientTypeId,
        user_id: userId,
        per_page: perPage,
        page,
      });

      // Response: { success, message, data: { current_page, data: [...], last_page, total ... } }
      if (res?.data?.success) {
        const paginated = res.data.data || {};
        setCustomers(Array.isArray(paginated.data) ? paginated.data : []);
        setMeta({
          current_page: paginated.current_page || 1,
          last_page: paginated.last_page || 1,
          total: paginated.total || 0,
          from: paginated.from || 0,
          to: paginated.to || 0,
        });
      } else {
        setCustomers([]);
        setError(res?.data?.message || "Something went wrong");
      }
    } catch (err) {
      setCustomers([]);
      setError(
        err?.response?.data?.message || err.message || "Failed to fetch customers"
      );
    } finally {
      setLoading(false);
    }
  }, [search, clientTypeId, userId, perPage, page]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const resetFilters = () => {
    setSearchInput("");
    setSearch("");
    setClientTypeId("");
    setUserId("");
    setPerPage(20);
    setPage(1);
  };

  const goTo = (p) => {
    if (p >= 1 && p <= meta.last_page && p !== meta.current_page) setPage(p);
  };

  // ---------- Edit ----------
  const handleEditSuccess = (message) => {
    setEditTarget(null);
    setToast(message);
    fetchCustomers();
  };

  // ---------- Delete ----------
  const openDelete = (customer) => {
    setDeleteError("");
    setDeleteTarget(customer);
  };

  const closeDelete = () => {
    if (deleting) return;
    setDeleteTarget(null);
    setDeleteError("");
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      setDeleteError("");
      const res = await deleteAdminCustomer(deleteTarget.id);
      if (res?.data?.success === false) {
        setDeleteError(res?.data?.message || "Delete failed");
        return;
      }
      setToast(res?.data?.message || "Customer deleted successfully");
      setDeleteTarget(null);

      // agar page ka last item delete hua to pichle page par jao
      if (customers.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        fetchCustomers();
      }
    } catch (err) {
      setDeleteError(
        err?.response?.data?.message || err.message || "Failed to delete customer"
      );
    } finally {
      setDeleting(false);
    }
  };

  // page numbers window
  const pageNumbers = () => {
    const pages = [];
    const start = Math.max(1, meta.current_page - 2);
    const end = Math.min(meta.last_page, meta.current_page + 2);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const pn = pageNumbers();

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <h2 style={styles.title}>Customers</h2>
        <span style={styles.count}>Total: {meta.total}</span>
      </div>

      {toast && <div style={styles.toast}>{toast}</div>}

      {/* Filters */}
      <div style={styles.filters}>
        <input
          type="text"
          placeholder="Search name, company, phone..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          style={{ ...styles.input, minWidth: 240 }}
        />

        <select
          value={clientTypeId}
          onChange={(e) => {
            setClientTypeId(e.target.value);
            setPage(1);
          }}
          disabled={typesLoading}
          style={styles.input}
        >
          <option value="">
            {typesLoading ? "Loading types..." : "All Types"}
          </option>
          {clientTypes.map((t) => (
            <option key={t.id} value={t.id}>
              {t.type_name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="User ID"
          value={userId}
          onChange={(e) => {
            setUserId(e.target.value);
            setPage(1);
          }}
          style={{ ...styles.input, width: 110 }}
        />

        <select
          value={perPage}
          onChange={(e) => {
            setPerPage(Number(e.target.value));
            setPage(1);
          }}
          style={styles.input}
        >
          {[10, 20, 50, 100].map((n) => (
            <option key={n} value={n}>
              {n} / page
            </option>
          ))}
        </select>

        <button onClick={resetFilters} style={styles.resetBtn}>
          Reset
        </button>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {/* Table */}
      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              {[
                "#",
                "Client Name",
                "Company",
                "Type",
                "Phone",
                "Email",
                "Address",
                "GST No.",
                "Designation",
                "Added By",
                "Device",
                "Location",
                "Created At",
                "Action",
              ].map((h) => (
                <th key={h} style={styles.th}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={14} style={styles.centerCell}>
                  Loading...
                </td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan={14} style={styles.centerCell}>
                  No customers found
                </td>
              </tr>
            ) : (
              customers.map((c, index) => (
                <tr key={c.id} style={styles.tr}>
                  <td style={styles.td}>{(meta.from || 1) + index}</td>
                  <td style={styles.td}>
                    <strong>{val(c.client_name)}</strong>
                  </td>
                  <td style={styles.td}>{val(c.company)}</td>
                  <td style={styles.td}>
                    <span style={styles.badge}>
                      {val(c.client_type?.type_name)}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {val(c.phone)}
                    {c.landline ? (
                      <div style={styles.sub}>{c.landline}</div>
                    ) : null}
                  </td>
                  <td style={styles.td}>{val(c.email)}</td>
                  <td style={styles.td}>{val(c.address || c.auto_address)}</td>
                  <td style={styles.td}>{val(c.gst_number)}</td>
                  <td style={styles.td}>{val(c.designation)}</td>
                  <td style={styles.td}>
                    {val(c.user?.name)}
                    <div style={styles.sub}>{val(c.user?.email)}</div>
                  </td>
                  <td style={styles.td}>{val(c.device_name)}</td>
                  <td style={styles.td}>
                    {c.latitude && c.longitude ? (
                      <a
                        href={`https://www.google.com/maps?q=${c.latitude},${c.longitude}`}
                        target="_blank"
                        rel="noreferrer"
                        style={styles.link}
                      >
                        View Map
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td style={styles.td}>{formatDate(c.created_at)}</td>
                  <td style={styles.td}>
                    <div style={styles.actions}>
                      <button
                        style={styles.editBtn}
                        onClick={() => setEditTarget(c)}
                      >
                        Edit
                      </button>
                      <button
                        style={styles.deleteBtn}
                        onClick={() => openDelete(c)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={styles.pagination}>
        <span style={styles.info}>
          Showing {meta.from || 0} to {meta.to || 0} of {meta.total} entries
        </span>
        <div style={styles.pageBtns}>
          <button
            style={styles.pageBtn}
            disabled={meta.current_page === 1}
            onClick={() => goTo(meta.current_page - 1)}
          >
            Prev
          </button>

          {pn.length > 0 && pn[0] > 1 && (
            <>
              <button style={styles.pageBtn} onClick={() => goTo(1)}>
                1
              </button>
              {pn[0] > 2 && <span>...</span>}
            </>
          )}

          {pn.map((p) => (
            <button
              key={p}
              onClick={() => goTo(p)}
              style={{
                ...styles.pageBtn,
                ...(p === meta.current_page ? styles.activePage : {}),
              }}
            >
              {p}
            </button>
          ))}

          {pn.length > 0 && pn[pn.length - 1] < meta.last_page && (
            <>
              {pn[pn.length - 1] < meta.last_page - 1 && <span>...</span>}
              <button
                style={styles.pageBtn}
                onClick={() => goTo(meta.last_page)}
              >
                {meta.last_page}
              </button>
            </>
          )}

          <button
            style={styles.pageBtn}
            disabled={meta.current_page === meta.last_page}
            onClick={() => goTo(meta.current_page + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {/* Edit popup */}
      {editTarget && (
        <EditCustomerModal
          customer={editTarget}
          onClose={() => setEditTarget(null)}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Delete confirmation popup */}
      {deleteTarget && (
        <div style={styles.overlay} onClick={closeDelete}>
          <div style={styles.confirmModal} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: "0 0 8px", fontSize: 18 }}>Delete Customer</h3>
            <p style={{ margin: "0 0 6px", color: "#374151" }}>
              Are you sure you want to delete this customer?
            </p>
            <p style={{ margin: "0 0 14px", fontWeight: 600 }}>
              {deleteTarget.client_name}
              {deleteTarget.company ? ` (${deleteTarget.company})` : ""}
            </p>

            {deleteError && <div style={styles.error}>{deleteError}</div>}

            <div style={styles.confirmFooter}>
              <button
                style={styles.cancelBtn}
                onClick={closeDelete}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                style={styles.confirmDeleteBtn}
                onClick={confirmDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  wrapper: { padding: 20, fontFamily: "system-ui, sans-serif" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: { margin: 0, fontSize: 22 },
  count: { fontSize: 14, color: "#555" },
  toast: {
    background: "#dcfce7",
    color: "#166534",
    padding: "10px 14px",
    borderRadius: 6,
    marginBottom: 12,
    fontSize: 14,
  },
  filters: { display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 16 },
  input: {
    padding: "8px 10px",
    border: "1px solid #ccc",
    borderRadius: 6,
    fontSize: 14,
    background: "#fff",
  },
  resetBtn: {
    padding: "8px 16px",
    border: "none",
    borderRadius: 6,
    background: "#e5e7eb",
    cursor: "pointer",
    fontSize: 14,
  },
  error: {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: "10px 14px",
    borderRadius: 6,
    marginBottom: 12,
    fontSize: 14,
  },
  tableWrap: {
    overflowX: "auto",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
  },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 14 },
  th: {
    textAlign: "left",
    padding: "10px 12px",
    background: "#f3f4f6",
    borderBottom: "1px solid #e5e7eb",
    whiteSpace: "nowrap",
  },
  tr: { borderBottom: "1px solid #f0f0f0" },
  td: { padding: "10px 12px", verticalAlign: "top" },
  sub: { fontSize: 12, color: "#777" },
  centerCell: { textAlign: "center", padding: 30, color: "#666" },
  badge: {
    background: "#dbeafe",
    color: "#1d4ed8",
    padding: "2px 8px",
    borderRadius: 12,
    fontSize: 12,
    whiteSpace: "nowrap",
  },
  link: { color: "#2563eb", textDecoration: "none" },
  actions: { display: "flex", gap: 6 },
  editBtn: {
    padding: "5px 12px",
    border: "none",
    borderRadius: 5,
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer",
    fontSize: 13,
  },
  deleteBtn: {
    padding: "5px 12px",
    border: "none",
    borderRadius: 5,
    background: "#dc2626",
    color: "#fff",
    cursor: "pointer",
    fontSize: 13,
  },
  pagination: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
    flexWrap: "wrap",
    gap: 10,
  },
  info: { fontSize: 13, color: "#555" },
  pageBtns: { display: "flex", gap: 6, alignItems: "center" },
  pageBtn: {
    padding: "6px 12px",
    border: "1px solid #d1d5db",
    background: "#fff",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 13,
  },
  activePage: { background: "#2563eb", color: "#fff", borderColor: "#2563eb" },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: 16,
  },
  confirmModal: {
    background: "#fff",
    borderRadius: 10,
    padding: 22,
    width: "100%",
    maxWidth: 420,
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
  },
  confirmFooter: { display: "flex", justifyContent: "flex-end", gap: 10 },
  cancelBtn: {
    padding: "8px 18px",
    border: "1px solid #d1d5db",
    background: "#fff",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 14,
  },
  confirmDeleteBtn: {
    padding: "8px 18px",
    border: "none",
    background: "#dc2626",
    color: "#fff",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 14,
  },
};