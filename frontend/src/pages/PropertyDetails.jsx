import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, BedDouble, Bath, User, ShieldCheck, Flag, Star, Image as ImageIcon, Phone, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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

    // Gallery State
    const [showGallery, setShowGallery] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Contact State
    const [showContact, setShowContact] = useState(false);

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const res = await api.get(`/properties/${id}`);
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

    const getImageUrl = (path) => {
        if (!path) return "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80";
        if (path.startsWith('http')) return path;
        return `http://localhost:8000${path}`;
    };

    if (loading) return <div className="min-h-screen pt-24 text-center">Loading property details...</div>;
    if (!property) return <div className="min-h-screen pt-24 text-center">Property not found</div>;

    const images = property.images || [];
    const hasImages = images.length > 0;

    return (
        <div className="bg-surface-50 min-h-[calc(100vh-4rem)] pb-20">
            {/* Image Grid Header */}
            <div className="container mx-auto px-4 pt-8 pb-4">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-semibold mb-3 inline-block">
                            {property.property_type}
                        </span>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-surface-900 mb-2">{property.title}</h1>
                        <div className="flex items-center text-surface-600">
                            <MapPin className="h-5 w-5 mr-1" />
                            {property.location}
                        </div>
                    </div>
                </div>

                {/* Hero Image Carousel */}
                <div className="relative rounded-2xl overflow-hidden h-[400px] sm:h-[500px] bg-surface-200 group">
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={currentImageIndex}
                            initial={{ opacity: 0.5 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0.5 }}
                            transition={{ duration: 0.3 }}
                            src={getImageUrl(hasImages ? images[currentImageIndex]?.file_path : null)}
                            alt={`Property view ${currentImageIndex + 1}`}
                            className="w-full h-full object-contain bg-surface-900 cursor-pointer"
                            onClick={() => setShowGallery(true)}
                        />
                    </AnimatePresence>

                    {images.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1); }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-surface-900 p-2 sm:p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-md backdrop-blur-sm"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1); }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-surface-900 p-2 sm:p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-md backdrop-blur-sm"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                            </button>
                        </>
                    )}

                    {/* Carousel Indicators */}
                    {images.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10 bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
                            {images.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                                    className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all ${currentImageIndex === idx ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'}`}
                                />
                            ))}
                        </div>
                    )}

                    <button
                        onClick={() => setShowGallery(true)}
                        className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-surface-900 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base font-medium shadow-sm border border-surface-200 hover:bg-white flex items-center gap-2 transition"
                    >
                        <ImageIcon className="h-4 w-4" />
                        {images.length} Photos
                    </button>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
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

                            <AnimatePresence>
                                {reporting && (
                                    <motion.form
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        onSubmit={handleReport}
                                        className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8 overflow-hidden"
                                    >
                                        <h3 className="font-semibold text-red-800 mb-2">Why are you reporting this listing?</h3>
                                        <textarea
                                            required
                                            value={reportReason}
                                            onChange={(e) => setReportReason(e.target.value)}
                                            className="w-full rounded-lg border-red-300 focus:ring-red-500 focus:border-red-500 mb-4 px-3 py-2 bg-white"
                                            rows="3"
                                            placeholder="E.g., Fake images, incorrect pricing, scam suspicion..."
                                        />
                                        <div className="flex gap-3 justify-end">
                                            <button type="button" onClick={() => setReporting(false)} className="px-4 py-2 text-surface-600 hover:text-surface-900 font-medium">Cancel</button>
                                            <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium shadow-sm">Submit Report</button>
                                        </div>
                                    </motion.form>
                                )}
                            </AnimatePresence>

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
                                <p className="text-surface-600 leading-relaxed whitespace-pre-line px-2">
                                    {property.description}
                                </p>
                            </div>

                            {property.reports && property.reports.length > 0 && user?.is_admin && (
                                <div className="mt-8 pt-8 border-t border-surface-200">
                                    <h3 className="text-xl font-bold text-red-600 mb-4 flex items-center gap-2">
                                        <Flag className="h-5 w-5" />
                                        Admin View: Active Reports on Listing ({property.reports.length})
                                    </h3>
                                    <div className="space-y-4">
                                        {property.reports.map((report, idx) => (
                                            <div key={idx} className="bg-red-50 border border-red-200 rounded-lg p-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-xs font-semibold uppercase px-2 py-1 bg-red-100 text-red-800 rounded">
                                                        {report.status}
                                                    </span>
                                                    <span className="text-xs text-surface-500">User ID: {report.user_id}</span>
                                                </div>
                                                <p className="text-surface-800 text-sm font-medium">"{report.reason}"</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Sidebar / Agent Info */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-surface-200 p-6 sticky top-24">
                            <h3 className="font-bold text-surface-900 mb-6 text-lg">Listed By</h3>

                            <div className="flex items-center gap-4 border-b border-surface-100 pb-6 mb-6">
                                <div className="h-16 w-16 bg-surface-100 rounded-full flex items-center justify-center text-surface-400 overflow-hidden shrink-0">
                                    <User className="h-8 w-8" />
                                </div>
                                <div>
                                    <p className="font-semibold text-surface-900 text-lg">
                                        {property.agent?.first_name ? `${property.agent.first_name} ${property.agent.last_name}` : `Agent ID: ${property.agent_id}`}
                                    </p>
                                    <div className="flex items-center gap-1 text-green-600 text-sm mt-1 font-medium shadow-sm bg-green-50 px-2 py-0.5 rounded-full inline-flex">
                                        <ShieldCheck className="h-4 w-4" />
                                        Strictly Verified
                                    </div>
                                    <div className="flex items-center gap-1 text-surface-600 text-sm mt-2">
                                        <Star className="h-4 w-4 text-amber-500 fill-current" />
                                        <span className="font-semibold">{property.agent?.average_rating ? property.agent.average_rating.toFixed(1) : 'New'}</span>
                                        <span className="text-surface-400">Rating</span>
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

                                {showContact ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="space-y-3 mt-6"
                                    >
                                        {property.agent?.phone_number && (
                                            <a href={`tel:${property.agent.phone_number}`} className="flex items-center gap-3 p-3 bg-surface-50 hover:bg-surface-100 border border-surface-200 rounded-xl transition cursor-pointer group">
                                                <div className="bg-primary-100 p-2 rounded-full text-primary-700 group-hover:bg-primary-200 transition">
                                                    <Phone className="h-5 w-5" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-semibold text-surface-500 uppercase tracking-wider">Phone</span>
                                                    <span className="text-surface-900 font-bold">{property.agent.phone_number}</span>
                                                </div>
                                            </a>
                                        )}
                                        {property.agent?.user?.email && (
                                            <a href={`mailto:${property.agent.user.email}`} className="flex items-center gap-3 p-3 bg-surface-50 hover:bg-surface-100 border border-surface-200 rounded-xl transition cursor-pointer group">
                                                <div className="bg-primary-100 p-2 rounded-full text-primary-700 group-hover:bg-primary-200 transition">
                                                    <Mail className="h-5 w-5" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-semibold text-surface-500 uppercase tracking-wider">Email</span>
                                                    <span className="text-surface-900 font-bold max-w-[180px] truncate">{property.agent.user.email}</span>
                                                </div>
                                            </a>
                                        )}
                                        {(!property.agent?.phone_number && !property.agent?.user?.email) && (
                                            <div className="text-center p-4 text-surface-500 bg-surface-50 rounded-xl border border-surface-200">
                                                No contact info available for this agent.
                                            </div>
                                        )}
                                    </motion.div>
                                ) : (
                                    <button
                                        onClick={() => setShowContact(true)}
                                        className="w-full bg-primary-600 text-white font-semibold flex justify-center items-center gap-2 py-3 rounded-xl mt-6 hover:bg-primary-700 transition shadow-lg shadow-primary-600/20"
                                    >
                                        <Phone className="h-5 w-5" />
                                        Contact Agent
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Full Screen Image Gallery Modal */}
            <AnimatePresence>
                {showGallery && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 flex flex-col"
                    >
                        <div className="flex justify-between items-center p-4 text-white p-6">
                            <div className="font-medium">
                                {currentImageIndex + 1} / {images.length || 1}
                            </div>
                            <button
                                onClick={() => setShowGallery(false)}
                                className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>

                        <div className="flex-1 flex items-center justify-center relative p-4 max-h-[80vh]">
                            <img
                                src={getImageUrl(images[currentImageIndex]?.file_path)}
                                alt={`Gallery image ${currentImageIndex + 1}`}
                                className="max-w-full max-h-full object-contain"
                            />

                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1); }}
                                        className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-3 rounded-full text-white transition backdrop-blur-sm"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1); }}
                                        className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-3 rounded-full text-white transition backdrop-blur-sm"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnail Strip */}
                        {images.length > 1 && (
                            <div className="h-24 p-4 flex justify-center gap-2 overflow-x-auto pb-6">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentImageIndex(idx)}
                                        className={`h-16 w-24 shrink-0 rounded-md overflow-hidden transition ${currentImageIndex === idx ? 'ring-2 ring-white opacity-100' : 'opacity-50 hover:opacity-100'}`}
                                    >
                                        <img
                                            src={getImageUrl(img.file_path)}
                                            alt=""
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
