import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, BedDouble, Bath, Search, Filter } from 'lucide-react';
import api from '../lib/api';

export default function Properties() {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [search, setSearch] = useState('');
    const [type, setType] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    const fetchProperties = async () => {
        setLoading(true);
        try {
            let url = '/properties?skip=0&limit=50';
            if (search) url += `&location=${search}`;
            if (type) url += `&property_type=${type}`;
            if (minPrice) url += `&min_price=${minPrice}`;
            if (maxPrice) url += `&max_price=${maxPrice}`;

            const res = await api.get(url);
            setProperties(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProperties();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchProperties();
    };

    return (
        <div className="bg-surface-50 min-h-[calc(100vh-4rem)] pb-20">
            {/* Search Header */}
            <div className="bg-white border-b border-surface-200 sticky top-16 z-40">
                <div className="container mx-auto px-4 py-4">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 h-5 w-5" />
                            <input
                                type="text"
                                placeholder="Search by location..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-surface-100 rounded-lg border-transparent focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                            />
                        </div>

                        <div className="flex gap-4 md:w-auto">
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="bg-surface-100 rounded-lg px-4 py-2 border-transparent focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                            >
                                <option value="">All Types</option>
                                <option value="Apartment">Apartment</option>
                                <option value="House">House</option>
                                <option value="Condo">Condo</option>
                            </select>

                            <div className="flex bg-surface-100 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary-200 focus-within:bg-white transition-all">
                                <input
                                    type="number"
                                    placeholder="Min $"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    className="w-24 px-3 py-2 bg-transparent border-r border-surface-200 outline-none"
                                />
                                <input
                                    type="number"
                                    placeholder="Max $"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    className="w-24 px-3 py-2 bg-transparent outline-none"
                                />
                            </div>

                            <button
                                type="submit"
                                className="bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700 transition-colors"
                            >
                                <Search className="h-6 w-6" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Results */}
            <div className="container mx-auto px-4 mt-8">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-surface-900">
                        {properties.length} Properties Found
                    </h2>
                    <button className="text-surface-600 flex items-center gap-2 hover:text-primary-600 transition-colors font-medium">
                        <Filter className="h-4 w-4" />
                        More Filters
                    </button>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="bg-white rounded-2xl h-[400px] border border-surface-200 animate-pulse"></div>
                        ))}
                    </div>
                ) : properties.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="mx-auto w-16 h-16 bg-surface-100 rounded-full flex items-center justify-center text-surface-400 mb-4">
                            <Search className="h-8 w-8" />
                        </div>
                        <h3 className="text-lg font-semibold text-surface-900">No properties found</h3>
                        <p className="text-surface-500">Try adjusting your filters or location search.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {properties.map((property, index) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                key={property.id}
                                className="bg-white rounded-2xl overflow-hidden border border-surface-200 hover:shadow-xl transition-all group cursor-pointer"
                            >
                                <Link to={`/properties/${property.id}`} className="block relative h-56 bg-surface-200 overflow-hidden">
                                    {/* Property image */}
                                    <img
                                        src={property.images && property.images.length > 0 ? `http://localhost:8000${property.images[0].file_path}` : "https://images.unsplash.com/photo-1560518883-ce09059ee212?w=800&q=80&auto=format&fit=crop"}
                                        alt={property.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-white/90 backdrop-blur-sm text-surface-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                                            {property.property_type}
                                        </span>
                                    </div>
                                </Link>

                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-bold text-surface-900 truncate pr-4">{property.title}</h3>
                                        <p className="text-xl font-extrabold text-primary-600">${property.price.toLocaleString()}</p>
                                    </div>

                                    <div className="flex items-center text-surface-500 text-sm mb-4">
                                        <MapPin className="h-4 w-4 mr-1 shrink-0" />
                                        <span className="truncate">{property.location}</span>
                                    </div>

                                    <div className="flex items-center gap-4 text-surface-600 text-sm border-t border-surface-100 pt-4 mt-2">
                                        <div className="flex items-center gap-1.5">
                                            <BedDouble className="h-4 w-4" />
                                            <span>{property.bedrooms} Beds</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Bath className="h-4 w-4" />
                                            <span>{property.bathrooms} Baths</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
