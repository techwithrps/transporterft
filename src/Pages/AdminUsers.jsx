import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { userAPI } from "../utils/Api";
import { useAuth } from "../contexts/AuthContext";
import {
  Users,
  Search,
  RefreshCw,
  UserPlus,
  Trash2,
  Edit2,
  X,
  Shield,
  Key,
  Mail,
  Phone,
  User as UserIcon,
} from "lucide-react";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Customer",
    password: "",
  });

  const { user: currentUser } = useAuth();

  // Load all users
  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userAPI.getAllUsers();
      if (response && response.success) {
        setUsers(response.data || response.users || []);
      } else if (Array.isArray(response)) {
        setUsers(response);
      }
    } catch (err) {
      console.error("Error loading users:", err);
      const msg = err.message || "Failed to load users";
      setError(msg);
      toast.error(msg);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Open modal for Add User
  const handleOpenAddModal = () => {
    setModalMode("add");
    setSelectedUserId(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "Customer",
      password: "",
    });
    setIsModalOpen(true);
  };

  // Open modal for Edit User
  const handleOpenEditModal = (targetUser) => {
    setModalMode("edit");
    setSelectedUserId(targetUser.id);
    const normalizedRole =
      (targetUser.role || "Customer").charAt(0).toUpperCase() +
      (targetUser.role || "Customer").slice(1).toLowerCase();

    setFormData({
      name: targetUser.name || "",
      email: targetUser.email || "",
      phone: targetUser.phone || "",
      role: normalizedRole,
      password: "", // Leave blank if keeping existing password
    });
    setIsModalOpen(true);
  };

  // Form submit for Add or Edit User
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.warn("Please enter user name");
      return;
    }
    if (!formData.email.trim()) {
      toast.warn("Please enter email address");
      return;
    }
    if (modalMode === "add" && !formData.password.trim()) {
      toast.warn("Please enter a password for the new user");
      return;
    }

    setIsSubmitting(true);
    try {
      if (modalMode === "add") {
        const res = await userAPI.createUser(formData);
        toast.success(res.message || "User created successfully!");
      } else {
        const res = await userAPI.updateUser(selectedUserId, formData);
        toast.success(res.message || "User updated successfully!");
      }

      setIsModalOpen(false);
      loadUsers();
    } catch (err) {
      console.error("User save error:", err);
      toast.error(err.message || "Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete user
  const handleDeleteUser = async (userId, userEmail) => {
    if (
      !window.confirm(
        `Are you sure you want to delete user "${userEmail || userId}"? This cannot be undone.`
      )
    ) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await userAPI.deleteUser(userId);
      toast.success(response.message || "User deleted successfully!");
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error(err.message || "Failed to delete user");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update user role from dropdown
  const handleUpdateUserRole = async (userId, newRole) => {
    setIsSubmitting(true);
    try {
      const response = await userAPI.updateUserRole(userId, { role: newRole });
      toast.success(response.message || `Role updated to ${newRole}`);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? {
                ...u,
                role:
                  newRole.charAt(0).toUpperCase() +
                  newRole.slice(1).toLowerCase(),
              }
            : u
        )
      );
    } catch (err) {
      console.error("Error updating user role:", err);
      toast.error(err.message || "Error updating user role");
      loadUsers();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter((u) => {
    const q = searchTerm.toLowerCase();
    return (
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.phone && u.phone.toLowerCase().includes(q)) ||
      (u.role && u.role.toLowerCase().includes(q))
    );
  });

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 font-semibold text-xs uppercase tracking-wider">
            <Shield className="w-4 h-4" /> System Administration
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-1">
            User Management
          </h1>
          <p className="text-gray-500 text-sm">
            Add system users, assign role privileges (Admin, Customer, Driver), and manage credentials.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadUsers}
            disabled={loading || isSubmitting}
            className="flex items-center gap-2 px-3.5 py-2 bg-white border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
          >
            <UserPlus className="w-4 h-4" /> Add User
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by name, email, phone, or role..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="text-xs font-semibold text-gray-500 w-full sm:w-auto text-right">
          Total Users: <strong className="text-gray-900">{users.length}</strong>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase">
                  Name
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase">
                  Email
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase">
                  Phone
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase">
                  Role Privilege
                </th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                    <div className="flex justify-center items-center gap-2">
                      <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />
                      <span>Loading users...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-400">
                    No users found matching your search.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const roleStr = (u.role || "Customer").toLowerCase();
                  return (
                    <tr key={u.id} className="hover:bg-gray-50/70 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                            {(u.name || "U").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">{u.name}</div>
                            <div className="text-[11px] text-gray-400">ID #{u.id}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-gray-700 font-mono text-xs">
                        {u.email}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-xs">
                        {u.phone || "N/A"}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          className={`px-3 py-1 text-xs font-bold rounded-lg border cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                            roleStr === "admin"
                              ? "bg-purple-100 text-purple-900 border-purple-300"
                              : roleStr === "driver"
                              ? "bg-green-100 text-green-900 border-green-300"
                              : "bg-blue-100 text-blue-900 border-blue-300"
                          }`}
                          value={roleStr}
                          onChange={(e) => handleUpdateUserRole(u.id, e.target.value)}
                          disabled={isSubmitting}
                        >
                          <option value="admin">Admin</option>
                          <option value="customer">Customer</option>
                          <option value="driver">Driver</option>
                        </select>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium space-x-3">
                        <button
                          onClick={() => handleOpenEditModal(u)}
                          className="text-blue-600 hover:text-blue-800 font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u.id, u.email)}
                          className="text-red-600 hover:text-red-800 font-semibold"
                          disabled={isSubmitting}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                  {modalMode === "add" ? <UserPlus className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="font-bold text-base text-gray-900">
                    {modalMode === "add" ? "Add New System User" : "Edit User Account"}
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    {modalMode === "add"
                      ? "Create credentials and assign access permissions."
                      : "Modify user profile, role, or update password."}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Email Address / Login ID *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. user@transporter.com"
                    className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="9999999999"
                      className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Role Privilege *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 font-semibold"
                  >
                    <option value="Customer">Customer</option>
                    <option value="Admin">Admin</option>
                    <option value="Driver">Driver</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Password {modalMode === "edit" ? "(Leave blank to keep unchanged)" : "*"}
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required={modalMode === "add"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder={modalMode === "edit" ? "•••••••• (Unchanged)" : "Enter login password"}
                    className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 shadow-sm"
                >
                  {isSubmitting
                    ? "Saving..."
                    : modalMode === "add"
                    ? "Create User"
                    : "Update User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
