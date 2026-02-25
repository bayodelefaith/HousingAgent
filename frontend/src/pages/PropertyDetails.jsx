import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, BedDouble, Bath, User, ShieldCheck, Flag, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

export default function PropertyDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reporting, setReporting] = useState(false);
    const [reportReason, setReportReason] = useState('');
    const [ratingLoading, setRatingLoading] = useState(false);

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const res = await api.get(`/properties/${id}`);
                // We will fetch agent profile data in a real app, 
                // mocked simple response below if the endpoint didn't fully expand agent
                setProperty(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProperty();
    }, [id]);

    const handleReport = async (e) => {
        e.preventDefault();
        if (!user) return navigate('/login');

        try {
            await api.post('/reviews/reports', {
                property_id: property.id,
                reason: reportReason
            });
            alert('Report submitted successfully. Our team will review this listing.');
            setReporting(false);
            setReportReason('');
        } catch (err) {
            alert('Failed to submit report');
        }
    };

    const handleRateAgent = async (score) => {
        if (!user) return navigate('/login');
        setRatingLoading(true);

        try {
            await api.post('/reviews/ratings', {
                agent_id: property.agent_id,
                score: score,
                review: "Rated via property view"
            });
            alert('Thanks for rating this agent!');
        } catch (err) {
            alert(err.response?.data?.detail || 'Failed to rate agent');
        } finally {
            setRatingLoading(false);
        }
    };

    if (loading) return <div className="min-h-screen pt-24 text-center">Loading property details...</div>;
    if (!property) return <div className="min-h-screen pt-24 text-center">Property not found</div>;

    return (
        <div className="bg-surface-50 min-h-[calc(100vh-4rem)] pb-20">
            <div className="bg-surface-900 h-96 w-full relative overflow-hidden">
                <img
                    src={property.images && property.images.length > 0
                        ? (property.images[0].file_path.startsWith('http') ? property.images[0].file_path : `http://localhost:8000${property.images[0].file_path}`)
                        : "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80"}
                    alt={property.title}
                    className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-900 via-transparent to-transparent"></div>

                <div className="absolute bottom-0 left-0 w-full">
                    <div className="container mx-auto px-4 pb-12">
                        <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold mb-4 inline-block">
                            {property.property_type}
                        </span>
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">{property.title}</h1>
                        <div className="flex items-center text-surface-200 text-lg">
                            <MapPin className="h-5 w-5 mr-2" />
                            {property.location}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">

                        <section>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-3xl font-bold text-surface-900">${property.price.toLocaleString()}</h2>
                                {user?.id !== property.agent_id && (
                                    <button
                                        onClick={() => setReporting(!reporting)}
                                        className="text-red-500 hover:text-red-600 flex items-center gap-2 text-sm font-medium transition"
                                    >
                                        <Flag className="h-4 w-4" />
                                        Report Listing
                                    </button>
                                )}
                            </div>

                            {reporting && (
                                <motion.form
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    onSubmit={handleReport}
                                    className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8"
                                >
                                    <h3 className="font-semibold text-red-800 mb-2">Why are you reporting this listing?</h3>
                                    <textarea
                                        required
                                        value={reportReason}
                                        onChange={(e) => setReportReason(e.target.value)}
                                        className="w-full rounded-lg border-red-300 focus:ring-red-500 focus:border-red-500 mb-4 px-3 py-2"
                                        rows="3"
                                        placeholder="E.g., Fake images, incorrect pricing, scam suspicion..."
                                    />
                                    <div className="flex gap-3 justify-end">
                                        <button type="button" onClick={() => setReporting(false)} className="px-4 py-2 text-surface-600 hover:text-surface-900">Cancel</button>
                                        <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Submit Report</button>
                                    </div>
                                </motion.form>
                            )}

                            <div className="flex gap-8 py-6 border-y border-surface-200">
                                <div className="flex items-center gap-3">
                                    <BedDouble className="h-6 w-6 text-primary-600" />
                                    <div>
                                        <p className="text-xl font-bold text-surface-900">{property.bedrooms}</p>
                                        <p className="text-sm text-surface-500">Bedrooms</p>
                                    </div>
                                </div>
                                <div className="w-px bg-surface-200"></div>
                                <div className="flex items-center gap-3">
                                    <Bath className="h-6 w-6 text-primary-600" />
                                    <div>
                                        <p className="text-xl font-bold text-surface-900">{property.bathrooms}</p>
                                        <p className="text-sm text-surface-500">Bathrooms</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <h3 className="text-xl font-bold text-surface-900 mb-4">Description</h3>
                                <p className="text-surface-600 leading-relaxed whitespace-pre-line">
                                    {property.description}
                                </p>
                            </div>
                        </section>
                    </div>

                    {/* Sidebar / Agent Info */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-surface-200 p-6 sticky top-24">
                            <h3 className="font-bold text-surface-900 mb-6 text-lg">Listed By</h3>

                            <div className="flex items-center gap-4 border-b border-surface-100 pb-6 mb-6">
                                <div className="h-16 w-16 bg-surface-100 rounded-full flex items-center justify-center text-surface-400">
                                    <User className="h-8 w-8" />
                                </div>
                                <div>
                                    <p className="font-semibold text-surface-900 text-lg">Agent ID: {property.agent_id}</p>
                                    <div className="flex items-center gap-1 text-green-600 text-sm mt-1 font-medium shadow-sm bg-green-50 px-2 py-0.5 rounded-full inline-flex">
                                        <ShieldCheck className="h-4 w-4" />
                                        Strictly Verified
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <p className="text-sm font-medium text-surface-600 mb-2">Rate this Agent's service:</p>
                                <div className="flex justify-between items-center bg-surface-50 rounded-lg p-3 border border-surface-100">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            disabled={ratingLoading}
                                            onClick={() => handleRateAgent(star)}
                                            className="text-surface-300 hover:text-amber-400 focus:text-amber-400 transition transform hover:scale-110"
                                        >
                                            <Star className="h-8 w-8 fill-current" />
                                        </button>
                                    ))}
                                </div>
                                <p className="text-xs text-center text-surface-500">
                                    Ratings help prevent scams and maintain premium service
                                </p>

                                <button className="w-full bg-primary-600 text-white font-semibold py-3 rounded-xl mt-6 hover:bg-primary-700 transition shadow-lg shadow-primary-600/20">
                                    Contact Agent
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
