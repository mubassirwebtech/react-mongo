import { useEffect, useState } from "react";
import {
    Users,
    UserPlus,
    Trash2,
    Search,
    Shield,
    X,
    Check,
    AlertCircle,
    UserCheck,
    RefreshCw,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const UsersPage = () => {
    const { user: currentAdmin } = useAuth();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");

    // Modal state for adding new user
    const [showModal, setShowModal] = useState(false);
    const [newUser, setNewUser] = useState({
        name: "",
        email: "",
        password: "",
        role: "user",
    });
    const [createLoading, setCreateLoading] = useState(false);
    const [modalError, setModalError] = useState("");

    // Delete confirmation state
    const [deleteModal, setDeleteModal] = useState(null); // user object to delete
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Global alert message
    const [feedback, setFeedback] = useState({ type: "", message: "" });

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get("/admin/users");
            setUsers(response.data.users || []);
        } catch (err) {
            setFeedback({
                type: "error",
                message: err.response?.data?.message || "Failed to load users",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Filtered users
    const filteredUsers = users.filter((u) => {
        const matchesSearch =
            u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole =
            roleFilter === "all" || u.role === roleFilter;

        return matchesSearch && matchesRole;
    });

    // Create User
    const handleCreateUser = async (e) => {
        e.preventDefault();
        setModalError("");

        if (newUser.password.length < 8) {
            setModalError("Password must be at least 8 characters");
            return;
        }

        try {
            setCreateLoading(true);
            const response = await api.post("/admin/users", newUser);
            setShowModal(false);
            setNewUser({ name: "", email: "", password: "", role: "user" });
            setFeedback({
                type: "success",
                message: response.data.message || "User created successfully!",
            });
            fetchUsers();
        } catch (err) {
            setModalError(
                err.response?.data?.message || "Failed to create user"
            );
        } finally {
            setCreateLoading(false);
        }
    };

    // Delete User
    const confirmDelete = async () => {
        if (!deleteModal) return;

        try {
            setDeleteLoading(true);
            const response = await api.delete(`/admin/users/${deleteModal._id}`);
            setDeleteModal(null);
            setFeedback({
                type: "success",
                message: response.data.message || "User removed successfully!",
            });
            fetchUsers();
        } catch (err) {
            setFeedback({
                type: "error",
                message: err.response?.data?.message || "Failed to delete user",
            });
            setDeleteModal(null);
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <div className="page-content">
            <div className="topbar">
                <div>
                    <span className="breadcrumb">Pages / Administration</span>
                    <h2>User Management</h2>
                </div>

                <div className="topbar-actions">
                    <button
                        className="primary-btn-sm"
                        onClick={() => {
                            setModalError("");
                            setShowModal(true);
                        }}
                    >
                        <UserPlus size={17} />
                        <span>Add New User</span>
                    </button>
                </div>
            </div>

            {feedback.message && (
                <div
                    className={
                        feedback.type === "success"
                            ? "success-message"
                            : "error-message"
                    }
                >
                    {feedback.message}
                </div>
            )}

            <div className="content-card">
                {/* Search & Filter Toolbar */}
                <div className="table-toolbar">
                    <div className="search-bar">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button
                                className="icon-clear-btn"
                                onClick={() => setSearchTerm("")}
                            >
                                <X size={15} />
                            </button>
                        )}
                    </div>

                    <div className="filter-group">
                        <label>Filter Role:</label>
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">All Roles ({users.length})</option>
                            <option value="admin">
                                Admins ({users.filter((u) => u.role === "admin").length})
                            </option>
                            <option value="user">
                                Users ({users.filter((u) => u.role === "user").length})
                            </option>
                        </select>

                        <button
                            className="icon-refresh-btn"
                            onClick={fetchUsers}
                            title="Refresh list"
                        >
                            <RefreshCw size={16} className={loading ? "spin" : ""} />
                        </button>
                    </div>
                </div>

                {/* Table */}
                {loading ? (
                    <div className="table-loading">
                        <div className="spinner"></div>
                        <span>Loading user accounts...</span>
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="empty-state">
                        <Users size={40} />
                        <p>No user accounts matched your search criteria.</p>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>User Account</th>
                                    <th>Role</th>
                                    <th>Registration Date</th>
                                    <th style={{ textAlign: "right" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((u) => {
                                    const isSelf = u._id === currentAdmin?._id || u._id === currentAdmin?.id;

                                    return (
                                        <tr key={u._id}>
                                            <td>
                                                <div className="table-user-cell">
                                                    <div
                                                        className={`avatar sm-avatar ${
                                                            u.role === "admin"
                                                                ? "admin-avatar"
                                                                : ""
                                                        }`}
                                                    >
                                                        {u.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <strong>
                                                            {u.name}
                                                            {isSelf && (
                                                                <span className="self-tag">
                                                                    (You)
                                                                </span>
                                                            )}
                                                        </strong>
                                                        <span className="table-user-email">
                                                            {u.email}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span
                                                    className={`role-badge ${
                                                        u.role === "admin"
                                                            ? "role-badge-admin"
                                                            : "role-badge-user"
                                                    }`}
                                                >
                                                    {u.role === "admin" ? (
                                                        <>
                                                            <Shield size={13} /> Admin
                                                        </>
                                                    ) : (
                                                        <>
                                                            <UserCheck size={13} /> User
                                                        </>
                                                    )}
                                                </span>
                                            </td>
                                            <td>
                                                {u.createdAt
                                                    ? new Date(
                                                          u.createdAt
                                                      ).toLocaleDateString(undefined, {
                                                          year: "numeric",
                                                          month: "short",
                                                          day: "numeric",
                                                      })
                                                    : "—"}
                                            </td>
                                            <td style={{ textAlign: "right" }}>
                                                {isSelf ? (
                                                    <span className="text-muted-sm">
                                                        Active Session
                                                    </span>
                                                ) : (
                                                    <button
                                                        className="btn-delete"
                                                        onClick={() => setDeleteModal(u)}
                                                        title="Delete user"
                                                    >
                                                        <Trash2 size={16} />
                                                        <span>Delete</span>
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="table-footer">
                    <span>
                        Showing {filteredUsers.length} of {users.length} accounts
                    </span>
                </div>
            </div>

            {/* CREATE USER MODAL */}
            {showModal && (
                <div className="modal-backdrop">
                    <div className="modal-box">
                        <div className="modal-header">
                            <div>
                                <h3>Create New User</h3>
                                <p>Add a new account directly to the database</p>
                            </div>
                            <button
                                className="modal-close"
                                onClick={() => setShowModal(false)}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {modalError && (
                            <div className="error-message">{modalError}</div>
                        )}

                        <form onSubmit={handleCreateUser}>
                            <label>Full Name</label>
                            <div className="input-wrapper">
                                <input
                                    type="text"
                                    placeholder="e.g. Sarah Jenkins"
                                    value={newUser.name}
                                    onChange={(e) =>
                                        setNewUser({ ...newUser, name: e.target.value })
                                    }
                                    required
                                    minLength={2}
                                />
                            </div>

                            <label>Email Address</label>
                            <div className="input-wrapper">
                                <input
                                    type="email"
                                    placeholder="sarah@example.com"
                                    value={newUser.email}
                                    onChange={(e) =>
                                        setNewUser({ ...newUser, email: e.target.value })
                                    }
                                    required
                                />
                            </div>

                            <label>Initial Password (min 8 characters)</label>
                            <div className="input-wrapper">
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={newUser.password}
                                    onChange={(e) =>
                                        setNewUser({
                                            ...newUser,
                                            password: e.target.value,
                                        })
                                    }
                                    required
                                    minLength={8}
                                />
                            </div>

                            <label>Account Role</label>
                            <div className="role-selector-radios">
                                <label
                                    className={`role-radio-card ${
                                        newUser.role === "user" ? "selected" : ""
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="role"
                                        value="user"
                                        checked={newUser.role === "user"}
                                        onChange={() =>
                                            setNewUser({ ...newUser, role: "user" })
                                        }
                                    />
                                    <div>
                                        <strong>Standard User</strong>
                                        <span>Regular access to user portal</span>
                                    </div>
                                </label>

                                <label
                                    className={`role-radio-card ${
                                        newUser.role === "admin" ? "selected" : ""
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="role"
                                        value="admin"
                                        checked={newUser.role === "admin"}
                                        onChange={() =>
                                            setNewUser({ ...newUser, role: "admin" })
                                        }
                                    />
                                    <div>
                                        <strong>Administrator</strong>
                                        <span>Full access to admin controls</span>
                                    </div>
                                </label>
                            </div>

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="secondary-btn"
                                    onClick={() => setShowModal(false)}
                                    disabled={createLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="primary-btn-dialog"
                                    disabled={createLoading}
                                >
                                    {createLoading ? "Creating..." : "Create User"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* DELETE CONFIRMATION MODAL */}
            {deleteModal && (
                <div className="modal-backdrop">
                    <div className="modal-box modal-box-sm">
                        <div className="modal-danger-header">
                            <div className="danger-icon-circle">
                                <AlertCircle size={24} />
                            </div>
                            <h3>Delete Account?</h3>
                            <p>
                                Are you sure you want to delete user account{" "}
                                <strong>{deleteModal.name}</strong> ({deleteModal.email})?
                                This action cannot be reversed.
                            </p>
                        </div>

                        <div className="modal-actions">
                            <button
                                type="button"
                                className="secondary-btn"
                                onClick={() => setDeleteModal(null)}
                                disabled={deleteLoading}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="danger-btn-dialog"
                                onClick={confirmDelete}
                                disabled={deleteLoading}
                            >
                                {deleteLoading ? "Deleting..." : "Yes, Delete User"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersPage;
