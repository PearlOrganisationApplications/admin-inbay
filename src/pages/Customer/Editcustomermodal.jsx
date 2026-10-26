import React, { useEffect, useState } from "react";
// NOTE: apna sahi path set karein (getAdminClientTypes jis file me hai wahan se import karein)
import { updateAdminCustomer, getAdminClientTypes } from "../../API/customer";
import { getAdminUsers } from "../../API/User";

const emptyForm = {
  client_name: "",
  client_type_id: "",
  user_id: "",
  company: "",
  phone: "",
  address: "",
  designation: "",
  hq: "",
};

// API response se array nikalne ka helper
// { data: [...] }  ya  { data: { data: [...] } }  dono handle hote hain
const extractList = (res) => {
  const body = res?.data;
  if (Array.isArray(body?.data)) return body.data;
  if (Array.isArray(body?.data?.data)) return body.data.data;
  if (Array.isArray(body)) return body;
  return [];
};

// name se initials nikalne ka helper (avatar ke liye)
const getInitials = (name) => {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return "C";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/* ---------------- Small inline SVG icons (no extra library needed) ---------------- */
const Svg = ({ children, size = 14 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

const Icons = {
  pencil: (size) => (
    <Svg size={size}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </Svg>
  ),
  close: (size) => (
    <Svg size={size}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </Svg>
  ),
  user: (size) => (
    <Svg size={size}>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </Svg>
  ),
  tag: (size) => (
    <Svg size={size}>
      <path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82Z" />
      <circle cx="7" cy="7" r="1.5" />
    </Svg>
  ),
  users: (size) => (
    <Svg size={size}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </Svg>
  ),
  building: (size) => (
    <Svg size={size}>
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01" />
    </Svg>
  ),
  phone: (size) => (
    <Svg size={size}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" />
    </Svg>
  ),
  briefcase: (size) => (
    <Svg size={size}>
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </Svg>
  ),
  pin: (size) => (
    <Svg size={size}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </Svg>
  ),
  save: (size) => (
    <Svg size={size}>
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
      <path d="M17 21v-8H7v8" />
      <path d="M7 3v5h8" />
    </Svg>
  ),
};

export default function EditCustomerModal({ customer, onClose, onSuccess }) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  // users dropdown
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState("");

  // client types dropdown
  const [clientTypes, setClientTypes] = useState([]);
  const [typesLoading, setTypesLoading] = useState(false);
  const [typesError, setTypesError] = useState("");

  // modal khulte hi users fetch karo
  useEffect(() => {
    let cancelled = false;

    const fetchUsers = async () => {
      try {
        setUsersLoading(true);
        setUsersError("");
        const res = await getAdminUsers();
        // Response: { status: true, counts: {...}, data: [ { id, name, ... } ] }
        const list = extractList(res);
        if (!cancelled) setUsers(list);
      } catch (err) {
        if (!cancelled) {
          setUsers([]);
          setUsersError(
            err?.response?.data?.message || err.message || "Failed to load users"
          );
        }
      } finally {
        if (!cancelled) setUsersLoading(false);
      }
    };

    fetchUsers();
    return () => {
      cancelled = true;
    };
  }, []);

  // modal khulte hi client types fetch karo
  useEffect(() => {
    let cancelled = false;

    const fetchClientTypes = async () => {
      try {
        setTypesLoading(true);
        setTypesError("");
        const res = await getAdminClientTypes();
        // Each item: { id, type_name, description, ... }
        const list = extractList(res);
        if (!cancelled) setClientTypes(list);
      } catch (err) {
        if (!cancelled) {
          setClientTypes([]);
          setTypesError(
            err?.response?.data?.message ||
              err.message ||
              "Failed to load client types"
          );
        }
      } finally {
        if (!cancelled) setTypesLoading(false);
      }
    };

    fetchClientTypes();
    return () => {
      cancelled = true;
    };
  }, []);

  // customer aate hi form prefill karo
  useEffect(() => {
    if (customer) {
      setForm({
        client_name: customer.client_name ?? "",
        client_type_id: customer.client_type_id ?? "",
        user_id: customer.user_id ?? "",
        company: customer.company ?? "",
        phone: customer.phone ?? "",
        address: customer.address ?? "",
        designation: customer.designation ?? "",
        hq: customer.hq ?? "",
      });
      setError("");
      setFieldErrors({});
    }
  }, [customer]);

  if (!customer) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const errs = {};
    if (!form.client_name.trim()) errs.client_name = "Client name is required";
    if (!form.client_type_id) errs.client_type_id = "Select client type";
    if (!form.user_id) errs.user_id = "User ID is required";
    if (!form.company.trim()) errs.company = "Company is required";
    if (!/^\d{10}$/.test(String(form.phone).trim()))
      errs.phone = "Enter valid 10 digit phone number";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      return;
    }

    const payload = {
      client_name: form.client_name.trim(),
      client_type_id: Number(form.client_type_id),
      user_id: Number(form.user_id),
      company: form.company.trim(),
      phone: String(form.phone).trim(),
      address: form.address.trim(),
      designation: form.designation.trim(),
      hq: form.hq.trim(),
    };

    try {
      setSaving(true);
      setError("");
      const res = await updateAdminCustomer(customer.id, payload);
      if (res?.data?.success === false) {
        setError(res?.data?.message || "Update failed");
        return;
      }
      onSuccess && onSuccess(res?.data?.message || "Customer updated successfully");
    } catch (err) {
      const data = err?.response?.data;
      if (data?.errors) {
        // Laravel validation errors: { field: ["msg"] }
        const mapped = {};
        Object.keys(data.errors).forEach((k) => {
          mapped[k] = Array.isArray(data.errors[k])
            ? data.errors[k][0]
            : data.errors[k];
        });
        setFieldErrors(mapped);
      }
      setError(data?.message || err.message || "Failed to update customer");
    } finally {
      setSaving(false);
    }
  };

  // header me dikhane ke liye selected client type ka naam
  const selectedType = clientTypes.find(
    (t) => String(t.id) === String(form.client_type_id)
  );

  return (
    <div style={styles.overlay} onClick={saving ? undefined : onClose}>
      {/* hover / focus / placeholder / scrollbar styles */}
      <style>{css}</style>

      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* ---------- Gradient header ---------- */}
        <div style={styles.header}>
          <h3 style={styles.title}>
            {Icons.pencil(18)}
            <span>Edit Customer Details</span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="ecm-close"
            style={styles.closeBtn}
            aria-label="Close"
          >
            {Icons.close(20)}
          </button>
        </div>

        {/* ---------- Profile strip ---------- */}
        <div style={styles.profile}>
          <div style={styles.avatar}>{getInitials(form.client_name)}</div>
          <div style={{ minWidth: 0 }}>
            <div style={styles.profileName}>
              {form.client_name || customer.client_name || "Customer"}
            </div>
            <div style={styles.profileSub}>
              {form.company || "No company"}
              {form.phone ? ` • ${form.phone}` : ""}
            </div>
            <div style={styles.badgeRow}>
              {selectedType && (
                <span style={styles.badgePurple}>{selectedType.type_name}</span>
              )}
              <span style={styles.idText}>ID: #{customer.id}</span>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", minHeight: 0, flex: 1 }}
        >
          <div style={styles.body} className="ecm-body">
            {error && <div style={styles.error}>{error}</div>}

            <div style={styles.grid}>
              <Field
                label="Client Name"
                icon={Icons.user}
                required
                error={fieldErrors.client_name}
              >
                <input
                  name="client_name"
                  value={form.client_name}
                  onChange={handleChange}
                  className="ecm-input"
                  style={styles.input}
                  placeholder="Client name"
                />
              </Field>

              <Field
                label="Client Type"
                icon={Icons.tag}
                required
                error={fieldErrors.client_type_id || typesError}
              >
                <select
                  name="client_type_id"
                  value={form.client_type_id}
                  onChange={handleChange}
                  disabled={typesLoading}
                  className="ecm-input"
                  style={{ ...styles.input, cursor: "pointer" }}
                >
                  <option value="">
                    {typesLoading ? "Loading types..." : "Select type"}
                  </option>
                  {clientTypes.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.type_name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field
                label="User"
                icon={Icons.users}
                required
                error={fieldErrors.user_id || usersError}
              >
                <select
                  name="user_id"
                  value={form.user_id}
                  onChange={handleChange}
                  disabled={usersLoading}
                  className="ecm-input"
                  style={{ ...styles.input, cursor: "pointer" }}
                >
                  <option value="">
                    {usersLoading ? "Loading users..." : "Select user"}
                  </option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                      {u.hq ? ` - ${u.hq}` : ""}
                      {u.is_active === 0 ? " (Inactive)" : ""}
                    </option>
                  ))}
                </select>
              </Field>

              <Field
                label="Company"
                icon={Icons.building}
                required
                error={fieldErrors.company}
              >
                <input
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  className="ecm-input"
                  style={styles.input}
                  placeholder="Company"
                />
              </Field>

              <Field
                label="Phone"
                icon={Icons.phone}
                required
                error={fieldErrors.phone}
              >
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  maxLength={10}
                  className="ecm-input"
                  style={styles.input}
                  placeholder="10 digit phone"
                />
              </Field>

              <Field
                label="Designation"
                icon={Icons.briefcase}
                error={fieldErrors.designation}
              >
                <input
                  name="designation"
                  value={form.designation}
                  onChange={handleChange}
                  className="ecm-input"
                  style={styles.input}
                  placeholder="Manager, Engineer, etc."
                />
              </Field>

              <Field label="HQ" icon={Icons.pin} error={fieldErrors.hq}>
                <input
                  name="hq"
                  value={form.hq}
                  onChange={handleChange}
                  className="ecm-input"
                  style={styles.input}
                  placeholder="Head quarter"
                />
              </Field>

              <Field
                label="Address"
                icon={Icons.pin}
                error={fieldErrors.address}
                full
              >
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  rows={3}
                  className="ecm-input"
                  style={{ ...styles.input, resize: "vertical" }}
                  placeholder="Address"
                />
              </Field>
            </div>
          </div>

          {/* ---------- Footer ---------- */}
          <div style={styles.footer}>
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="ecm-cancel"
              style={styles.cancelBtn}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="ecm-save"
              style={{ ...styles.saveBtn, opacity: saving ? 0.7 : 1 }}
            >
              {Icons.save(16)}
              <span>{saving ? "Saving..." : "Update"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, icon, required, error, full, children }) {
  return (
    <div
      className={`ecm-card${error ? " ecm-card-error" : ""}`}
      style={{ ...styles.card, gridColumn: full ? "1 / -1" : "auto" }}
    >
      <label style={styles.label}>
        <span style={styles.labelIcon}>{icon && icon(14)}</span>
        <span>
          {label}
          {required && <span style={{ color: "#dc2626" }}> *</span>}
        </span>
      </label>
      {children}
      {error && <div style={styles.fieldError}>{error}</div>}
    </div>
  );
}

const PURPLE = "#9333ea";
const INDIGO = "#4f46e5";

const css = `
  .ecm-card { transition: border-color .15s ease, box-shadow .15s ease, background .15s ease; }
  .ecm-card:hover { border-color: #d8b4fe; }
  .ecm-card:focus-within {
    border-color: ${PURPLE};
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.15);
  }
  .ecm-card-error { border-color: #f87171 !important; }
  .ecm-card-error:focus-within { box-shadow: 0 0 0 3px rgba(248, 113, 113, 0.2); }

  .ecm-input { outline: none; }
  .ecm-input::placeholder { color: #9ca3af; font-weight: 400; }
  .ecm-input:disabled { color: #9ca3af; cursor: not-allowed; }

  .ecm-close { transition: background .15s ease; }
  .ecm-close:hover:not(:disabled) { background: rgba(255,255,255,0.2) !important; }

  .ecm-cancel { transition: background .15s ease, border-color .15s ease; }
  .ecm-cancel:hover:not(:disabled) { background: #f9fafb !important; border-color: #c4b5fd !important; }

  .ecm-save { transition: transform .15s ease, box-shadow .15s ease; }
  .ecm-save:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 8px 20px rgba(124, 58, 237, 0.4) !important;
  }
  .ecm-save:disabled, .ecm-cancel:disabled { cursor: not-allowed; }

  .ecm-body::-webkit-scrollbar { width: 8px; }
  .ecm-body::-webkit-scrollbar-track { background: transparent; }
  .ecm-body::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 8px; }
  .ecm-body::-webkit-scrollbar-thumb:hover { background: #a78bfa; }
`;

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(17, 24, 39, 0.55)",
    backdropFilter: "blur(4px)",
    WebkitBackdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: 16,
  },
  modal: {
    background: "#fff",
    borderRadius: 18,
    width: "100%",
    maxWidth: 680,
    maxHeight: "92vh",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    boxShadow: "0 25px 60px rgba(76, 29, 149, 0.35)",
  },

  /* header */
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 22px",
    background: `linear-gradient(90deg, ${PURPLE} 0%, ${INDIGO} 100%)`,
    color: "#fff",
  },
  title: {
    margin: 0,
    fontSize: 19,
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    gap: 10,
    color: "#fff",
  },
  closeBtn: {
    border: "none",
    background: "transparent",
    color: "#fff",
    cursor: "pointer",
    width: 34,
    height: 34,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  /* profile strip */
  profile: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    padding: "18px 22px",
    background: "#fff",
    borderBottom: "1px solid #e5e7eb",
  },
  avatar: {
    width: 62,
    height: 62,
    flexShrink: 0,
    borderRadius: "50%",
    background: "#e5e7eb",
    border: "3px solid #ede9fe",
    color: "#1f2937",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 24,
    fontWeight: 500,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 700,
    color: "#111827",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  profileSub: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 2,
  },
  badgeRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
    flexWrap: "wrap",
  },
  badgePurple: {
    background: "#f3e8ff",
    color: "#7e22ce",
    fontSize: 12,
    fontWeight: 600,
    padding: "3px 12px",
    borderRadius: 999,
  },
  idText: { fontSize: 12, color: "#9ca3af" },

  /* body */
  body: {
    padding: 20,
    overflowY: "auto",
    background: "#fff",
    flex: 1,
    minHeight: 0,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 14,
  },
  card: {
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: "12px 16px",
  },
  label: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    fontSize: 11.5,
    fontWeight: 600,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    color: "#4b5563",
    marginBottom: 6,
  },
  labelIcon: {
    color: PURPLE,
    display: "inline-flex",
    alignItems: "center",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: 0,
    border: "none",
    background: "transparent",
    fontSize: 14.5,
    fontWeight: 600,
    color: "#111827",
    fontFamily: "inherit",
  },
  fieldError: { color: "#dc2626", fontSize: 12, marginTop: 5 },
  error: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#b91c1c",
    padding: "10px 14px",
    borderRadius: 10,
    marginBottom: 14,
    fontSize: 14,
  },

  /* footer */
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    padding: "14px 22px",
    borderTop: "1px solid #e5e7eb",
    background: "#f9fafb",
  },
  cancelBtn: {
    padding: "10px 22px",
    border: "1px solid #e5e7eb",
    background: "#fff",
    color: "#111827",
    borderRadius: 10,
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 600,
  },
  saveBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 22px",
    border: "none",
    background: `linear-gradient(90deg, ${PURPLE} 0%, ${INDIGO} 100%)`,
    color: "#fff",
    borderRadius: 10,
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 600,
    boxShadow: "0 4px 12px rgba(124, 58, 237, 0.3)",
  },
};