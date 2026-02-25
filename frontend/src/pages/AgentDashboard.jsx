import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Building2, PlusCircle, CheckCircle2 } from 'lucide-react';
import PostPropertyForm from '../components/PostPropertyForm';

export default function AgentDashboard() {
    const { user } = useAuth();
    const [successMsg, setSuccessMsg] = useState('');

    const handlePropertySuccess = () => {
        setSuccessMsg('Your property has been successfully listed on the platform!');

        // Hide success message after 5 seconds
        setTimeout(() => {
            setSuccessMsg('');
        }, 5000);
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="mb-8 flex items-center gap-3">
                <div className="p-3 bg-emerald-100 rounded-full text-emerald-600">
                    <Building2 className="h-8 w-8" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-surface-900 tracking-tight">Agent Dashboard</h1>
                    <p className="text-surface-500 mt-1 text-lg">Manage your business and property listings</p>
                </div>
            </div>

            {successMsg && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                    <p className="font-medium">{successMsg}</p>
                </div>
            )}

            <div className="grid lg:grid-cols-2 gap-8 items-start">
                {/* Left Side: Actions and Stats (placeholder) */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl shadow-sm border border-emerald-100 p-8">
                        <div className="bg-emerald-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                            <PlusCircle className="h-6 w-6 text-emerald-600" />
                        </div>
                        <h2 className="text-xl font-bold text-surface-900 mb-2">Create New Listing</h2>
                        <p className="text-surface-600 mb-6">
                            Use the form to post a new property. Ensure all details are accurate to attract potential buyers or tenants.
                        </p>

                        <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-emerald-100">
                            <div className="text-center">
                                <p className="text-surface-500 text-sm font-medium mb-1">Total Listings</p>
                                <p className="text-2xl font-bold text-surface-900">--</p>
                            </div>
                            <div className="text-center">
                                <p className="text-surface-500 text-sm font-medium mb-1">Active Leads</p>
                                <p className="text-2xl font-bold text-surface-900">--</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Post property form */}
                <div className="lg:-mt-4 relative z-10">
                    <PostPropertyForm onSuccess={handlePropertySuccess} />
                </div>
            </div>
        </div>
    );
}
