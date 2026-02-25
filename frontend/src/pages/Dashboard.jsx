import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, User as UserIcon, AlertCircle, Building, CheckCircle2 } from 'lucide-react';
import api from '../lib/api';
import PostPropertyForm from '../components/PostPropertyForm';

export default function Dashboard() {
    const { user, setUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [agentProfile, setAgentProfile] = useState(null);
    const [nin, setNin] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetchAgentStatus = async () => {
        try {
            if (user?.is_agent) {
                // Since we don't have a direct /agents/me route yet, we'll assume the frontend knows 
                // the user is an agent and rely on the agent endpoints created.
                // We'll simulate checking by attempting to submit a verification request which 
                // will tell us if one is pending, or if we pass verify logic we can mock the view.
                setAgentProfile({
                    is_verified: user.verification_level > 0,
                    level: user.verification_level || 0
                });
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchAgentStatus();
    }, [user]);

    const handleBecomeAgent = async () => {
        setLoading(true);
        setError('');
        try {
            await api.post('/agents/register');
            const userRes = await api.get('/auth/me'); // Refresh user data
            setUser(userRes.data);
            setSuccess('Successfully registered as an Agent!');
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to become an agent.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerificationSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            await api.post('/agents/verify/submit', {
                nin_submitted: nin,
                phone_submitted: phone
            });
            setSuccess('Verification request submitted successfully. It is now pending approval.');
            setNin('');
            setPhone('');
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to submit verification.');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-surface-900">Welcome, {user.email.split('@')[0]}</h1>
                <p className="mt-2 text-surface-600">Manage your profile and properties.</p>
            </div>

            {error && (
                <div className="mb-6 rounded-lg bg-red-50 p-4 border border-red-200 flex items-center gap-3 text-red-700">
                    <AlertCircle className="h-5 w-5" />
                    <p>{error}</p>
                </div>
            )}

            {success && (
                <div className="mb-6 rounded-lg bg-green-50 p-4 border border-green-200 flex items-center gap-3 text-green-700">
                    <CheckCircle2 className="h-5 w-5" />
                    <p>{success}</p>
                </div>
            )}

            <div className="grid md:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="bg-white rounded-xl shadow-sm border border-surface-200 p-6 h-fit">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-16 w-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
                            <UserIcon className="h-8 w-8" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">{user.email}</h2>
                            <span className="inline-flex items-center rounded-full bg-surface-100 px-2.5 py-0.5 text-xs font-medium text-surface-800 mt-1">
                                {user.is_agent ? 'Real Estate Agent' : 'Standard User'}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-surface-100">
                            <span className="text-surface-500 text-sm">Member Since</span>
                            <span className="text-surface-900 font-medium text-sm">
                                {new Date(user.created_at).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Agent Controls & Verification */}
                <div className="md:col-span-2 space-y-6">
                    {!user.is_agent ? (
                        <div className="bg-gradient-to-br from-primary-50 to-white rounded-xl border border-primary-200 p-8 text-center">
                            <Building className="h-12 w-12 text-primary-500 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-surface-900 mb-2">Become an Agent</h2>
                            <p className="text-surface-600 max-w-md mx-auto mb-6">
                                Join our platform to start listing properties right away.
                            </p>
                            <button
                                onClick={handleBecomeAgent}
                                disabled={loading}
                                className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
                            >
                                Register as Agent
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-bold text-emerald-800 flex items-center gap-2">
                                        <ShieldCheck className="h-5 w-5" />
                                        Active Agent
                                    </h3>
                                    <p className="text-emerald-700 mt-1">You can now post and manage property listings.</p>
                                </div>
                                <button
                                    onClick={() => window.location.href = '/agent-panel'}
                                    className="bg-emerald-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-emerald-700 transition text-sm shadow-sm"
                                >
                                    Open Agent Panel
                                </button>
                            </div>

                            {/* Render property form directly on the dashboard as requested */}
                            <PostPropertyForm onSuccess={() => setSuccess('Property posted successfully!')} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
