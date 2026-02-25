import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Loader2, ShieldAlert, UserX, CheckCircle2, Trash2, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import api from '../lib/api';

export default function AdminDashboard() {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null); // id of user being acted upon
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/admin/users');
            setUsers(response.data);
            setError('');
        } catch (err) {
            console.error("Failed to fetch users:", err);
            setError('Failed to load users. Please ensure you have admin privileges.');
        } finally {
            setLoading(false);
        }
    };

    const toggleActiveStatus = async (userId, currentStatus) => {
        setActionLoading(userId);
        try {
            await api.put(`/admin/users/${userId}/toggle-active`);
            // Update local state
            setUsers(users.map(u => u.id === userId ? { ...u, is_active: !currentStatus } : u));
        } catch (err) {
            console.error("Failed to toggle status:", err);
            alert("Failed to update user status");
        } finally {
            setActionLoading(null);
        }
    };

    const deleteUser = async (userId) => {
        if (!window.confirm("Are you sure you want to permanently delete this user? This action cannot be undone.")) return;

        setActionLoading(userId);
        try {
            await api.delete(`/admin/users/${userId}`);
            // Remove from local state
            setUsers(users.filter(u => u.id !== userId));
        } catch (err) {
            console.error("Failed to delete user:", err);
            const msg = err.response?.data?.detail || "Failed to delete user";
            alert(msg);
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="mb-8 flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-full text-purple-600">
                    <ShieldAlert className="h-8 w-8" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-surface-900 tracking-tight">Admin Dashboard</h1>
                    <p className="text-surface-500 mt-1 text-lg">Manage platform users and permissions</p>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3">
                    <XCircle className="h-5 w-5 flex-shrink-0" />
                    <p className="font-medium">{error}</p>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden">
                <div className="p-6 border-b border-surface-200 bg-surface-50">
                    <h2 className="text-lg font-semibold text-surface-900">User Directory</h2>
                    <p className="text-sm text-surface-500">A total of {users.length} registered users.</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-surface-500 uppercase bg-surface-50/50 border-b border-surface-200">
                            <tr>
                                <th className="px-6 py-4 font-medium">User Details</th>
                                <th className="px-6 py-4 font-medium">Role</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium text-right">Joined</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-100">
                            {users.map((u) => (
                                <tr key={u.id} className="hover:bg-surface-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-surface-900">{u.email}</span>
                                            <span className="text-xs text-surface-400">ID: {u.id}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {u.is_admin ? (
                                                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-700">
                                                    Admin
                                                </span>
                                            ) : u.is_agent ? (
                                                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-700">
                                                    Agent
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-surface-100 text-surface-700">
                                                    User
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {u.is_active ? (
                                            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                                                <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                                                Active
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                                                <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                                                Suspended
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right text-surface-500 whitespace-nowrap">
                                        {u.created_at ? format(new Date(u.created_at), 'MMM d, yyyy') : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            {u.id !== user?.id && (
                                                <>
                                                    <button
                                                        onClick={() => toggleActiveStatus(u.id, u.is_active)}
                                                        disabled={actionLoading === u.id}
                                                        className={`p-2 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium ${u.is_active
                                                                ? 'text-orange-600 hover:bg-orange-50'
                                                                : 'text-green-600 hover:bg-green-50'
                                                            }`}
                                                        title={u.is_active ? "Suspend User" : "Activate User"}
                                                    >
                                                        {actionLoading === u.id ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : u.is_active ? (
                                                            <>
                                                                <UserX className="h-4 w-4" />
                                                                <span className="hidden lg:inline">Suspend</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <CheckCircle2 className="h-4 w-4" />
                                                                <span className="hidden lg:inline">Activate</span>
                                                            </>
                                                        )}
                                                    </button>

                                                    <div className="h-4 w-px bg-surface-200"></div>

                                                    <button
                                                        onClick={() => deleteUser(u.id)}
                                                        disabled={actionLoading === u.id}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium"
                                                        title="Delete User"
                                                    >
                                                        {actionLoading === u.id ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <>
                                                                <Trash2 className="h-4 w-4" />
                                                                <span className="hidden lg:inline">Delete</span>
                                                            </>
                                                        )}
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && !error && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-surface-500">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
