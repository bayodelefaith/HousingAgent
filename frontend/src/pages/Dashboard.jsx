import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, User as UserIcon, AlertCircle, Building, CheckCircle2, Clock } from 'lucide-react';
import api from '../lib/api';
import PostPropertyForm from '../components/PostPropertyForm';

export default function Dashboard() {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [agentProfile, setAgentProfile] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [termsAgreed, setTermsAgreed] = useState(false);

    // Agent Registration Form State
    const [showAgentForm, setShowAgentForm] = useState(false);
    const [agentFirstName, setAgentFirstName] = useState('');
    const [agentLastName, setAgentLastName] = useState('');
    const [agentNin, setAgentNin] = useState('');
    const [agentNinFile, setAgentNinFile] = useState(null);
    const [agentPhone, setAgentPhone] = useState('');

    const fetchAgentStatus = async () => {
        try {
            if (user?.is_agent) {
                const res = await api.get('/agents/me');
                setAgentProfile({
                    is_verified: res.data.is_verified,
                    level: res.data.verification_level
                });
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchAgentStatus();
        // Check if user has already agreed to terms
        const hasAgreed = sessionStorage.getItem('agentTermsAgreed') === 'true';
        setTermsAgreed(hasAgreed);
    }, [user]);

    const handleBecomeAgent = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setError('');
        try {
            // 1. Register agent
            await api.post('/agents/register', {
                first_name: agentFirstName,
                last_name: agentLastName,
                nin: agentNin,
                nin_image: "",
                phone_number: agentPhone
            });
            
            // 2. Upload NIN image if provided
            if (agentNinFile) {
                const formData = new FormData();
                formData.append('file', agentNinFile);
                await api.post('/agents/upload-nin-image', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            
            const userRes = await api.get('/auth/me');
            setUser(userRes.data);
            setSuccess('Successfully registered as an Agent! Your verification is pending approval.');
            setShowAgentForm(false);
            // Reset form
            setAgentFirstName('');
            setAgentLastName('');
            setAgentNin('');
            setAgentNinFile(null);
            setAgentPhone('');
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to become an agent.');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    const isApprovedAgent = user.is_agent;
    const isPendingAgent = !user.is_agent && user.has_agent_profile;
    const isRegularUser = !user.is_agent && !user.has_agent_profile;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-surface-900">Welcome, {user.email.split('@')[0]}</h1>
                <p className="mt-2 text-surface-600">Manage your profile and properties.</p>
            </div>

            {error && (
                <div className="mb-6 rounded-lg bg-red-50 p-4 border border-red-200 flex items-center gap-3 text-red-700">
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    <p>{error}</p>
                </div>
            )}

            {success && (
                <div className="mb-6 rounded-lg bg-green-50 p-4 border border-green-200 flex items-center gap-3 text-green-700">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
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
                                {isApprovedAgent ? 'Real Estate Agent' : isPendingAgent ? 'Agent (Pending)' : 'Standard User'}
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

                    {/* STATE 1: Regular user — never registered as agent */}
                    {isRegularUser && (
                        <div className="bg-gradient-to-br from-primary-50 to-white rounded-xl border border-primary-200 p-8 text-center">
                            <Building className="h-12 w-12 text-primary-500 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-surface-900 mb-2">Become an Agent</h2>

                            {!termsAgreed ? (
                                <>
                                    <p className="text-surface-600 max-w-md mx-auto mb-6">
                                        Join our platform to start listing properties right away. Review and agree to our terms and conditions first.
                                    </p>
                                    <button
                                        onClick={() => navigate('/terms-and-conditions')}
                                        className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
                                    >
                                        Review Terms & Conditions
                                    </button>
                                </>
                            ) : (
                                <>
                                    <p className="text-surface-600 max-w-md mx-auto mb-6">
                                        You have agreed to our terms. Please fill in your details to register as an agent.
                                    </p>
                                    {!showAgentForm ? (
                                        <button
                                            onClick={() => setShowAgentForm(true)}
                                            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
                                        >
                                            Complete Registration
                                        </button>
                                    ) : (
                                        <form onSubmit={handleBecomeAgent} className="max-w-md mx-auto space-y-4 text-left mt-6">
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-surface-700">First Name</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={agentFirstName}
                                                    onChange={(e) => setAgentFirstName(e.target.value)}
                                                    placeholder="Enter your first name"
                                                    className="block w-full rounded-lg border border-surface-300 px-4 py-2.5 text-surface-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-surface-700">Last Name</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={agentLastName}
                                                    onChange={(e) => setAgentLastName(e.target.value)}
                                                    placeholder="Enter your last name"
                                                    className="block w-full rounded-lg border border-surface-300 px-4 py-2.5 text-surface-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-surface-700">NIN (National Identification Number)</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={agentNin}
                                                    onChange={(e) => setAgentNin(e.target.value)}
                                                    placeholder="Enter your 11-digit NIN"
                                                    className="block w-full rounded-lg border border-surface-300 px-4 py-2.5 text-surface-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                                                    maxLength={11}
                                                    minLength={11}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-surface-700">NIN Image</label>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => setAgentNinFile(e.target.files?.[0] || null)}
                                                    placeholder="Upload NIN image"
                                                    className="block w-full rounded-lg border border-surface-300 px-4 py-2.5 text-surface-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-surface-700">Phone Number</label>
                                                <input
                                                    type="tel"
                                                    required
                                                    value={agentPhone}
                                                    onChange={(e) => setAgentPhone(e.target.value)}
                                                    placeholder="e.g. 08012345678"
                                                    className="block w-full rounded-lg border border-surface-300 px-4 py-2.5 text-surface-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                                                />
                                            </div>
                                    
                                            <div className="flex gap-3 pt-4">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setShowAgentForm(false);
                                                        sessionStorage.removeItem('agentTermsAgreed');
                                                        setTermsAgreed(false);
                                                    }}
                                                    className="flex-1 bg-white border border-surface-300 text-surface-700 px-4 py-2.5 rounded-lg font-medium hover:bg-surface-50 transition"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={loading}
                                                    className="flex-1 bg-primary-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-primary-700 transition disabled:opacity-70"
                                                >
                                                    {loading ? 'Submitting...' : 'Submit Details'}
                                                </button>
                                    </div>
                                </form>
                            )}
                                </>
                            )}
                        </div>
                    )}

                    {/* STATE 2: Registered but awaiting admin approval */}
                    {isPendingAgent && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 flex items-start gap-4">
                            <div className="p-2 bg-amber-100 rounded-full text-amber-600 flex-shrink-0">
                                <Clock className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-amber-800">Verification Pending</h3>
                                <p className="text-amber-700 mt-1">
                                    Your agent details have been submitted and are being reviewed. You will be able to post properties once an admin approves your account.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* STATE 3: Approved agent */}
                    {isApprovedAgent && (
                        <div className="space-y-6">
                            {agentProfile?.is_verified ? (
                                <>
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
                                    <PostPropertyForm onSuccess={() => setSuccess('Property posted successfully!')} />
                                </>
                            ) : (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 flex items-start gap-4">
                                    <div className="p-2 bg-blue-100 rounded-full text-blue-600 flex-shrink-0">
                                        <AlertCircle className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-blue-800">Account Approved</h3>
                                        <p className="text-blue-700 mt-1">
                                            Your account is active but not fully verified. Please complete NIN verification to unlock all features.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
