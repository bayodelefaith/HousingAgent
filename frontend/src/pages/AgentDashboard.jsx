import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Building2, PlusCircle, CheckCircle2, Edit, Trash2, MapPin, Banknote, BedDouble, Bath } from 'lucide-react';
import PostPropertyForm from '../components/PostPropertyForm';
import EditPropertyModal from '../components/EditPropertyModal';
import api from '../lib/api';

export default function AgentDashboard() {
    const { user } = useAuth();
    const [successMsg, setSuccessMsg] = useState('');
    const [properties, setProperties] = useState([]);
    const [loadingProps, setLoadingProps] = useState(true);
    const [editProperty, setEditProperty] = useState(null);

    const fetchProperties = async () => {
        setLoadingProps(true);
        try {
            const res = await api.get('/properties/me/listings');
            setProperties(res.data);
        } catch (error) {
            console.error("Failed to fetch properties:", error);
        } finally {
            setLoadingProps(false);
        }
    };

    useEffect(() => {
        fetchProperties();
    }, []);

    const handlePropertySuccess = () => {
        setSuccessMsg('Your property has been successfully listed on the platform!');
        fetchProperties(); // Refresh the list

        // Hide success message after 5 seconds
        setTimeout(() => {
            setSuccessMsg('');
        }, 5000);
    };

    const handleEditSuccess = () => {
        setEditProperty(null);
        setSuccessMsg('Property updated successfully!');
        fetchProperties(); // Refresh the list

        setTimeout(() => setSuccessMsg(''), 5000);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this property?")) return;

        try {
            await api.delete(`/properties/${id}`);
            setSuccessMsg('Property deleted successfully.');
            setProperties(properties.filter(p => p.id !== id));
            setTimeout(() => setSuccessMsg(''), 5000);
        } catch (error) {
            console.error("Failed to delete property:", error);
            alert("Failed to delete property. " + (error.response?.data?.detail || ""));
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
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

            <div className="grid lg:grid-cols-3 gap-8 items-start">
                {/* Left Side: Actions and Multi-Listings */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl shadow-sm border border-emerald-100 p-8">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-surface-900">Your Listings</h2>
                                <p className="text-surface-600">Total: {properties.length}</p>
                            </div>
                        </div>

                        {loadingProps ? (
                            <div className="text-center py-8 text-surface-500">Loading properties...</div>
                        ) : properties.length === 0 ? (
                            <div className="text-center py-12 bg-surface-50 rounded-xl border border-surface-200 border-dashed">
                                <Building2 className="h-12 w-12 text-surface-300 mx-auto mb-3" />
                                <p className="text-surface-500 font-medium">No properties listed yet.</p>
                                <p className="text-sm text-surface-400 mt-1">Use the form to post your first property.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {properties.map((prop) => (
                                    <div key={prop.id} className="bg-white border border-surface-200 rounded-xl p-5 flex flex-col sm:flex-row gap-5 shadow-sm hover:shadow-md transition">
                                        {/* Thumbnail thumbnail */}
                                        <div className="w-full sm:w-32 h-32 bg-surface-100 rounded-lg overflow-hidden flex-shrink-0">
                                            {prop.images && prop.images.length > 0 ? (
                                                <img
                                                    src={prop.images[0].file_path}
                                                    alt={prop.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-surface-400">
                                                    <Building2 className="h-8 w-8" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start">
                                                    <h3 className="font-bold text-lg text-surface-900 line-clamp-1">{prop.title}</h3>
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${prop.is_available ? 'bg-emerald-100 text-emerald-700' : 'bg-surface-200 text-surface-700'}`}>
                                                        {prop.is_available ? 'Available' : 'Unavailable'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center text-surface-500 text-sm mt-1">
                                                    <MapPin className="h-4 w-4 mr-1 shrink-0" />
                                                    <span className="truncate">{prop.location}</span>
                                                </div>

                                                <div className="flex gap-4 mt-3 text-sm text-surface-600">
                                                    <div className="flex items-center"><Banknote className="h-4 w-4 mr-1 text-primary-500" /> ${prop.price?.toLocaleString()}</div>
                                                    <div className="flex items-center"><BedDouble className="h-4 w-4 mr-1 text-surface-400" /> {prop.bedrooms}</div>
                                                    <div className="flex items-center"><Bath className="h-4 w-4 mr-1 text-surface-400" /> {prop.bathrooms}</div>
                                                </div>
                                            </div>

                                            <div className="flex gap-2 mt-4 pt-4 border-t border-surface-100">
                                                <button
                                                    onClick={() => setEditProperty(prop)}
                                                    className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-sm font-medium transition"
                                                >
                                                    <Edit className="h-4 w-4" /> Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(prop.id)}
                                                    className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-sm font-medium transition"
                                                >
                                                    <Trash2 className="h-4 w-4" /> Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side: Post property form */}
                <div className="lg:col-span-1 lg:-mt-4 relative z-10 sticky top-24">
                    <PostPropertyForm onSuccess={handlePropertySuccess} />
                </div>
            </div>

            {/* Edit Modal */}
            {editProperty && (
                <EditPropertyModal
                    property={editProperty}
                    onClose={() => setEditProperty(null)}
                    onSuccess={handleEditSuccess}
                />
            )}
        </div>
    );
}
