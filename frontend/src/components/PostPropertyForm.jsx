import { useState } from 'react';
import { Home, Banknote, MapPin, Grid, BedDouble, Bath, Image as ImageIcon } from 'lucide-react';
import api from '../lib/api';

export default function PostPropertyForm({ onSuccess }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        location: '',
        property_type: 'Apartment',
        bedrooms: '',
        bathrooms: ''
    });
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        if (e.target.files) {
            setImages(Array.from(e.target.files));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await api.post('/properties', {
                ...formData,
                price: parseFloat(formData.price),
                bedrooms: parseInt(formData.bedrooms, 10),
                bathrooms: parseInt(formData.bathrooms, 10),
            });

            if (images.length > 0) {
                const imgData = new FormData();
                images.forEach(img => {
                    imgData.append('files', img);
                });
                await api.post(`/properties/${res.data.id}/images`, imgData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            // Reset form
            setFormData({
                title: '',
                description: '',
                price: '',
                location: '',
                property_type: 'Apartment',
                bedrooms: '',
                bathrooms: ''
            });
            setImages([]);

            if (onSuccess) onSuccess();
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to post property.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-surface-200 p-6">
            <h2 className="text-xl font-bold text-surface-900 mb-6">Post New Property</h2>

            {error && (
                <div className="mb-6 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">Title</label>
                    <div className="relative">
                        <Home className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 h-5 w-5" />
                        <input
                            required
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-surface-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Modern Downtown Apartment"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">Location</label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 h-5 w-5" />
                        <input
                            required
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-surface-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="123 Main St, City, ST"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-surface-700 mb-1">Price</label>
                        <div className="relative">
                            <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 h-5 w-5" />
                            <input
                                required
                                type="number"
                                min="0"
                                step="0.01"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-surface-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                placeholder="2500"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-surface-700 mb-1">Type</label>
                        <div className="relative">
                            <Grid className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 h-5 w-5" />
                            <select
                                name="property_type"
                                value={formData.property_type}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-surface-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none bg-white"
                            >
                                <option value="Apartment">Apartment</option>
                                <option value="House">House</option>
                                <option value="Condo">Condo</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-surface-700 mb-1">Bedrooms</label>
                        <div className="relative">
                            <BedDouble className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 h-5 w-5" />
                            <input
                                required
                                type="number"
                                min="0"
                                name="bedrooms"
                                value={formData.bedrooms}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-surface-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                placeholder="2"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-surface-700 mb-1">Bathrooms</label>
                        <div className="relative">
                            <Bath className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 h-5 w-5" />
                            <input
                                required
                                type="number"
                                min="0"
                                name="bathrooms"
                                value={formData.bathrooms}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-surface-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                placeholder="2"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">Description</label>
                    <textarea
                        required
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-2 rounded-lg border border-surface-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                        placeholder="Describe the property details, amenities, etc."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">Property Images</label>
                    <div className="relative">
                        <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 h-5 w-5" />
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-surface-300 focus:ring-2 focus:ring-primary-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-70"
                >
                    {loading ? 'Posting...' : 'Post Property'}
                </button>
            </form>
        </div>
    );
}
