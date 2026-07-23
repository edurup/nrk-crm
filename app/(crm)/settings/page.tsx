"use client";

import { useState, useEffect } from "react";
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, UserPlus, Users, Shield } from "lucide-react";
import { changePassword, createCRMUser, getAllCRMUsers, deleteCRMUser } from "@/lib/api";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"password" | "users">("password");
  
  // Get current user from localStorage
  const currentUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('crmUser') || '{}') : {};
  const isAdmin = currentUser.role === 'admin' || !currentUser.role; // CRMAdmin has no role field
  
  // Change Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Create User State
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userRole, setUserRole] = useState("salesperson");
  const [assignedCourses, setAssignedCourses] = useState<string[]>([]);
  const [showUserPassword, setShowUserPassword] = useState(false);
  const [creatingUser, setCreatingUser] = useState(false);
  const [userMessage, setUserMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
  // Users List State
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const availableCourses = [
    "Digital Marketing",
    "Data Analytics",
    "Data Science",
    "Full Stack Developer"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage({ type: "error", text: "All fields are required" });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "New password must be at least 6 characters" });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }

    setLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      setMessage({ type: "success", text: "Password changed successfully" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      setMessage({ 
        type: "error", 
        text: error.response?.data?.message || "Failed to change password" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserMessage(null);

    if (!userName || !userEmail || !userPassword) {
      setUserMessage({ type: "error", text: "All fields are required" });
      return;
    }

    if (userPassword.length < 8) {
      setUserMessage({ type: "error", text: "Password must be at least 8 characters" });
      return;
    }

    if (assignedCourses.length === 0) {
      setUserMessage({ type: "error", text: "Please assign at least one course" });
      return;
    }

    setCreatingUser(true);
    try {
      await createCRMUser({
        name: userName,
        email: userEmail,
        password: userPassword,
        role: userRole,
        assignedCourses
      });
      setUserMessage({ type: "success", text: "User created successfully" });
      setUserName("");
      setUserEmail("");
      setUserPassword("");
      setAssignedCourses([]);
      fetchUsers();
    } catch (error: any) {
      setUserMessage({ 
        type: "error", 
        text: error.response?.data?.message || "Failed to create user" 
      });
    } finally {
      setCreatingUser(false);
    }
  };

  const toggleCourse = (course: string) => {
    if (assignedCourses.includes(course)) {
      setAssignedCourses(assignedCourses.filter(c => c !== course));
    } else {
      setAssignedCourses([...assignedCourses, course]);
    }
  };

  const fetchUsers = async () => {
    if (loadingUsers) return;
    
    setLoadingUsers(true);
    try {
      const data = await getAllCRMUsers();
      setUsers(data.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    
    try {
      await deleteCRMUser(userId);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Fetch users when switching to users tab
  useEffect(() => {
    if (activeTab === "users" && users.length === 0 && !loadingUsers) {
      fetchUsers();
    }
  }, [activeTab]);

  return (
    <div className="w-full p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Settings
        </h1>
        <p className="text-gray-500 mt-1">
          Manage your account settings and team members
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-2 inline-flex gap-2">
        <button
          onClick={() => setActiveTab("password")}
          className={`px-6 py-3 rounded-xl font-medium transition-all ${
            activeTab === "password"
              ? "bg-green-600 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <div className="flex items-center gap-2">
            <Lock size={18} />
            Change Password
          </div>
        </button>
        {isAdmin && (
          <button
            onClick={() => setActiveTab("users")}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === "users"
                ? "bg-green-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center gap-2">
              <Users size={18} />
              Manage Users
            </div>
          </button>
        )}
      </div>

      {/* Change Password Tab */}
      {activeTab === "password" && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <Shield className="text-green-700" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>
              <p className="text-sm text-gray-500">Update your password to keep your account secure</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {message && (
              <div
                className={`flex items-center gap-2 p-4 rounded-xl ${
                  message.type === "success"
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {message.type === "success" ? (
                  <CheckCircle size={20} />
                ) : (
                  <AlertCircle size={20} />
                )}
                <span className="text-sm">{message.text}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Changing Password..." : "Change Password"}
            </button>
          </form>
        </div>
      )}

      {/* Manage Users Tab */}
      {activeTab === "users" && (
        <div className="space-y-6">
          {/* Create User Form */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <UserPlus className="text-blue-700" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Create New User</h2>
                <p className="text-sm text-gray-500">Add a new salesperson to your team</p>
              </div>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-5 max-w-2xl">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter email"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showUserPassword ? "text" : "password"}
                      value={userPassword}
                      onChange={(e) => setUserPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowUserPassword(!showUserPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showUserPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <select
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                  >
                    <option value="salesperson">Salesperson</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assign Courses
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableCourses.map((course) => (
                    <button
                      key={course}
                      type="button"
                      onClick={() => toggleCourse(course)}
                      className={`px-4 py-2 rounded-xl border transition-all ${
                        assignedCourses.includes(course)
                          ? "bg-green-600 text-white border-green-600"
                          : "bg-white text-gray-700 border-gray-300 hover:border-green-500"
                      }`}
                    >
                      {course}
                    </button>
                  ))}
                </div>
              </div>

              {userMessage && (
                <div
                  className={`flex items-center gap-2 p-4 rounded-xl ${
                    userMessage.type === "success"
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {userMessage.type === "success" ? (
                    <CheckCircle size={20} />
                  ) : (
                    <AlertCircle size={20} />
                  )}
                  <span className="text-sm">{userMessage.text}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={creatingUser}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creatingUser ? "Creating User..." : "Create User"}
              </button>
            </form>
          </div>

          {/* Users List */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
                <p className="text-sm text-gray-500">View and manage your sales team</p>
              </div>
              <button
                onClick={fetchUsers}
                disabled={loadingUsers}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
              >
                {loadingUsers ? "Loading..." : "Refresh"}
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Assigned Courses
                    </th>
                    <th className="p-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loadingUsers ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-500">
                        Loading users...
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-500">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr
                        key={user._id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="p-4">
                          <div className="font-medium text-gray-900">{user.name}</div>
                        </td>
                        <td className="p-4">
                          <div className="text-gray-700">{user.email}</div>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              user.role === 'admin'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-green-100 text-green-700'
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1">
                            {user.assignedCourses?.map((course: string) => (
                              <span
                                key={course}
                                className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs"
                              >
                                {course}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
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
          </div>
        </div>
      )}
    </div>
  );
}
