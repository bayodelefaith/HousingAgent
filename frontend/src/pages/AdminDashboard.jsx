import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Loader2, ShieldAlert, UserX, CheckCircle2, Trash2, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import api from '../lib/api';

export default function AdminDashboard() {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [verifications, setVerifications] = useState([]);
    const [activeTab, setActiveTab] = useState('users'); // 'users' or 'verifications'
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null); // id of user being acted upon
    const [error, setError] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [usersRes, verifsRes] = await Promise.all([
                api.get('/admin/users'),
                api.get('/admin/verifications')
            ]);
            setUsers(usersRes.data);
            setVerifications(verifsRes.data);
            setError('');
        } catch (err) {
            console.error("Failed to fetch data:", err);
            setError('Failed to load data. Please ensure you have admin privileges.');
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

    const handleVerificationAction = async (requestId, action) => {
        setActionLoading(`verify-${requestId}`);
        try {
            await api.put(`/admin/verifications/${requestId}/${action}`);
            // Refresh data so both users and verifications lists are up-to-date
            await fetchData();
        } catch (err) {
            console.error(`Failed to ${action} verification:`, err);
            alert(`Failed to ${action} verification request`);
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

            <div className="mb-6 flex space-x-2 border-b border-surface-200">
                <button
                    onClick={() => setActiveTab('users')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'users'
                        ? 'border-purple-600 text-purple-600'
                        : 'border-transparent text-surface-500 hover:text-surface-700 hover:border-surface-300'
                        }`}
                >
                    User Directory
                </button>
                <button
                    onClick={() => setActiveTab('verifications')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'verifications'
                        ? 'border-purple-600 text-purple-600'
                        : 'border-transparent text-surface-500 hover:text-surface-700 hover:border-surface-300'
                        }`}
                >
                    Agent Verifications
                    {verifications.length > 0 && (
                        <span className="bg-orange-100 text-orange-600 py-0.5 px-2 rounded-full text-xs">
                            {verifications.length}
                        </span>
                    )}
                </button>
            </div>

            {activeTab === 'users' ? (
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
                                                        Agent (Verified)
                                                    </span>
                                                ) : u.has_agent_profile ? (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-orange-100 text-orange-700">
                                                        Agent (Pending)
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

                                                        {u.has_agent_profile && !u.is_verified && (
                                                            <>
                                                                <div className="h-4 w-px bg-surface-200"></div>
                                                                <button
                                                                    onClick={() => {
                                                                        setActiveTab('verifications');
                                                                    }}
                                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium"
                                                                    title="Go to Verifications"
                                                                >
                                                                    <CheckCircle2 className="h-4 w-4" />
                                                                    <span className="hidden lg:inline">Verify Agent</span>
                                                                </button>
                                                            </>
                                                        )}

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
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden">
                    <div className="p-6 border-b border-surface-200 bg-surface-50">
                        <h2 className="text-lg font-semibold text-surface-900">Pending Verifications</h2>
                        <p className="text-sm text-surface-500">{verifications.length} agents waiting for approval.</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-surface-500 uppercase bg-surface-50/50 border-b border-surface-200">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Agent Email</th>
                                    <th className="px-6 py-4 font-medium">NIN</th>
                                    <th className="px-6 py-4 font-medium">Phone</th>
                                    <th className="px-6 py-4 font-medium text-right">Submitted</th>
                                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-100">
                                {verifications.map((v) => (
                                    <tr key={v.id} className="hover:bg-surface-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="font-medium text-surface-900">{v.user_email}</span>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-surface-600 text-xs">
                                            {v.nin_submitted || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-surface-600">
                                            {v.phone_submitted || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-right text-surface-500 whitespace-nowrap">
                                            {v.created_at ? format(new Date(v.created_at), 'MMM d, yyyy') : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleVerificationAction(v.id, 'approve')}
                                                    disabled={actionLoading === `verify-${v.id}`}
                                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium"
                                                    title="Approve"
                                                >
                                                    {actionLoading === `verify-${v.id}` ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <>
                                                            <CheckCircle2 className="h-4 w-4" />
                                                            <span className="hidden lg:inline">Approve</span>
                                                        </>
                                                    )}
                                                </button>
                                                <div className="h-4 w-px bg-surface-200"></div>
                                                <button
                                                    onClick={() => handleVerificationAction(v.id, 'reject')}
                                                    disabled={actionLoading === `verify-${v.id}`}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium"
                                                    title="Reject"
                                                >
                                                    {actionLoading === `verify-${v.id}` ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <>
                                                            <XCircle className="h-4 w-4" />
                                                            <span className="hidden lg:inline">Reject</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {verifications.length === 0 && !error && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center text-surface-500">
                                            No pending verifications.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
