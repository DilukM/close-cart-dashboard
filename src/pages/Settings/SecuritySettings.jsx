import React, { useState } from "react";
import {
  Shield,
  Eye,
  EyeOff,
  Save,
  Users,
  FileDown,
  Trash2,
  Lock,
  Shield as ShieldIcon,
} from "lucide-react";
import { toast } from "react-toastify";
import SettingsSection from "../../components/settings/SettingsSection";
import SaveButton from "../../components/settings/SaveButton";

const SecuritySettings = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordData, setPasswordData] = useState({
    password: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showConfirmDeleteDialog, setShowConfirmDeleteDialog] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const [employees, setEmployees] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", role: "manager" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "staff" },
  ]);

  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    role: "staff",
  });

  const handlePasswordChange = (e) => {
    setPasswordData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEmployeeChange = (e) => {
    setNewEmployee((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRoleChange = (employeeId, newRole) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === employeeId ? { ...emp, role: newRole } : emp
      )
    );
    toast.success(`Role updated successfully`);
  };

  const handleRemoveEmployee = (employeeId) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== employeeId));
    toast.success("Employee removed successfully");
  };

  const handleAddEmployee = () => {
    if (!newEmployee.name || !newEmployee.email) {
      toast.error("Name and email are required");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmployee.email)) {
      toast.error("Please enter a valid email");
      return;
    }

    // In a real app, you would call an API to add the employee
    const newEmployeeWithId = {
      ...newEmployee,
      id: Date.now(), // simple unique ID generation
    };

    setEmployees((prev) => [...prev, newEmployeeWithId]);
    setNewEmployee({ name: "", email: "", role: "staff" });
    toast.success("Employee added successfully");
  };

  const handleToggle2FA = () => {
    // In a real app, this would involve QR codes and verification
    setTwoFactorEnabled(!twoFactorEnabled);
    toast.success(
      `Two-factor authentication ${!twoFactorEnabled ? "enabled" : "disabled"}`
    );
  };

  const handleDownloadData = () => {
    // In a real app, this would trigger a data export
    toast.info(
      "Your data is being prepared for download. You will be notified when it's ready."
    );
  };

  const handleInitiateAccountDeletion = () => {
    setShowConfirmDeleteDialog(true);
  };

  const handleConfirmAccountDeletion = () => {
    if (deleteConfirmText !== "DELETE") {
      toast.error('Please type "DELETE" to confirm');
      return;
    }

    // In a real app, this would call an API to schedule account deletion
    toast.success(
      "Account deletion has been scheduled. Your account will be deleted in 30 days."
    );
    setShowConfirmDeleteDialog(false);
    setDeleteConfirmText("");
  };

  const handleSavePassword = async () => {
    // Password validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    if (passwordData.newPassword && passwordData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      // Create data object to send
      const passwordChangeData = {
        currentPassword: passwordData.password,
        newPassword: passwordData.newPassword,
      };

      // Send updated data to server
      const response = await fetch(
        "https://closecart-backend.vercel.app/api/v1/auth/change-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(passwordChangeData),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Password changed successfully!");
        setPasswordData({
          password: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toast.error(data.message || "Failed to change password");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Security & Privacy Settings
        </h2>
        <SaveButton onClick={handleSavePassword} loading={loading} />
      </div>

      {/* Change Password */}
      <SettingsSection title="Change Password" icon={Lock}>
        <div className="space-y-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={passwordData.password}
                onChange={handlePasswordChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </div>
      </SettingsSection>

      {/* Two-Factor Authentication */}
      <SettingsSection title="Two-Factor Authentication" icon={ShieldIcon}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-md font-medium text-gray-900 dark:text-white">
                Enable 2FA
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Add an extra layer of security to your account
              </p>
            </div>
            <div className="flex items-center">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={twoFactorEnabled}
                  onChange={handleToggle2FA}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-yellow-500 dark:peer-focus:ring-yellow-600 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-yellow-500"></div>
              </label>
            </div>
          </div>

          {twoFactorEnabled && (
            <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-100 dark:border-yellow-800">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                In a real application, this would display a QR code for you to
                scan with an authenticator app.
              </p>
            </div>
          )}
        </div>
      </SettingsSection>

      {/* User Permissions */}
      <SettingsSection title="User Permissions" icon={Users}>
        <div className="space-y-6">
          <div>
            <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">
              Add Employee
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                name="name"
                value={newEmployee.name}
                onChange={handleEmployeeChange}
                placeholder="Full Name"
                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <input
                type="email"
                name="email"
                value={newEmployee.email}
                onChange={handleEmployeeChange}
                placeholder="Email Address"
                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <div className="flex items-center gap-2">
                <select
                  name="role"
                  value={newEmployee.role}
                  onChange={handleEmployeeChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="staff">Staff</option>
                </select>
                <button
                  onClick={handleAddEmployee}
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">
              Manage Employees
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-xs uppercase text-gray-700 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-3 py-3">Name</th>
                    <th className="px-3 py-3">Email</th>
                    <th className="px-3 py-3">Role</th>
                    <th className="px-3 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr
                      key={employee.id}
                      className="border-b border-gray-200 dark:border-gray-700"
                    >
                      <td className="px-3 py-3 text-gray-900 dark:text-white">
                        {employee.name}
                      </td>
                      <td className="px-3 py-3 text-gray-900 dark:text-white">
                        {employee.email}
                      </td>
                      <td className="px-3 py-3">
                        <select
                          value={employee.role}
                          onChange={(e) =>
                            handleRoleChange(employee.id, e.target.value)
                          }
                          className="px-2 py-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        >
                          <option value="admin">Admin</option>
                          <option value="manager">Manager</option>
                          <option value="staff">Staff</option>
                        </select>
                      </td>
                      <td className="px-3 py-3">
                        <button
                          onClick={() => handleRemoveEmployee(employee.id)}
                          className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </SettingsSection>

      {/* Data Privacy */}
      <SettingsSection title="Data Privacy" icon={Shield}>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <h3 className="text-md font-medium text-gray-900 dark:text-white">
                Download Your Data
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Download a copy of your shop data, including orders, products,
                and customers
              </p>
            </div>
            <button
              onClick={handleDownloadData}
              className="flex items-center gap-1 px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
            >
              <FileDown size={16} />
              <span>Download</span>
            </button>
          </div>

          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-lg">
            <h3 className="text-md font-medium text-red-800 dark:text-red-400">
              Delete Account
            </h3>
            <p className="text-sm text-red-600 dark:text-red-300 mt-1 mb-2">
              This will permanently delete your account and all associated data
              after a 30 day grace period.
            </p>

            {!showConfirmDeleteDialog ? (
              <button
                onClick={handleInitiateAccountDeletion}
                className="mt-2 flex items-center gap-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                <Trash2 size={16} />
                <span>Delete Account</span>
              </button>
            ) : (
              <div className="mt-3 space-y-3">
                <p className="text-sm text-red-600 dark:text-red-300 font-medium">
                  Type "DELETE" to confirm:
                </p>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-red-300 dark:border-red-600 bg-white dark:bg-gray-700 text-red-900 dark:text-white w-full"
                  placeholder="Type DELETE"
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleConfirmAccountDeletion}
                    disabled={deleteConfirmText !== "DELETE"}
                    className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Confirm Deletion
                  </button>
                  <button
                    onClick={() => {
                      setShowConfirmDeleteDialog(false);
                      setDeleteConfirmText("");
                    }}
                    className="px-3 py-2 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </SettingsSection>
    </div>
  );
};

export default SecuritySettings;
