import { useState, useEffect, useRef } from 'react';
import { Home, Banknote, MapPin, Grid, BedDouble, Bath, X, Image as ImageIcon, Trash2 } from 'lucide-react';
import api from '../lib/api';

export default function EditPropertyModal({ property, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        location: '',
        property_type: 'Apartment',
        bedrooms: '',
        bathrooms: '',
        is_available: true
    });
    const [existingImages, setExistingImages] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (property) {
            setFormData({
                title: property.title,
                description: property.description,
                price: property.price,
                location: property.location,
                property_type: property.property_type,
                bedrooms: property.bedrooms,
                bathrooms: property.bathrooms,
                is_available: property.is_available
            });
            setExistingImages(property.images || []);
        }
    }, [property]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleNewImageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const addedFiles = Array.from(e.target.files);
            setNewImages(prev => [...prev, ...addedFiles]);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const removeNewImage = (indexToRemove) => {
        setNewImages(newImages.filter((_, index) => index !== indexToRemove));
    };

    const deleteExistingImage = async (imageId) => {
        if (!window.confirm("Are you sure you want to delete this image?")) return;

        try {
            await api.delete(`/properties/${property.id}/images/${imageId}`);
            setExistingImages(existingImages.filter(img => img.id !== imageId));
        } catch (err) {
            console.error("Failed to delete image:", err);
            alert("Failed to delete image.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Update Details
            await api.put(`/properties/${property.id}`, {
                ...formData,
                price: parseFloat(formData.price),
                bedrooms: parseInt(formData.bedrooms, 10),
                bathrooms: parseInt(formData.bathrooms, 10),
            });

            // Upload New Images
            if (newImages.length > 0) {
                const imgData = new FormData();
                newImages.forEach(img => {
                    imgData.append('files', img);
                });
                await api.post(`/properties/${property.id}/images`, imgData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            onSuccess();
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to update property.');
            setLoading(false); // only stop loading on error, on success parent unmounts
        }
    };

    // Helper for resolving image urls
    const getImageUrl = (path) => {
        if (path.startsWith('http')) return path;
        return `http://localhost:8000${path}`;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                <div className="bg-white border-b border-surface-200 px-6 py-4 flex items-center justify-between z-10 shrink-0">
                    <h2 className="text-xl font-bold text-surface-900">Edit Property</h2>
                    <button onClick={onClose} className="p-2 hover:bg-surface-100 rounded-full text-surface-500 transition">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto">
                    {error && (
                        <div className="mb-6 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Current Images Section */}
                        {existingImages.length > 0 && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-surface-700 mb-2">Current Images</label>
                                <div className="grid grid-cols-4 gap-3">
                                    {existingImages.map((img) => (
                                        <div key={img.id} className="relative aspect-square rounded-lg border border-surface-200 overflow-hidden group">
                                            <img
                                                src={getImageUrl(img.file_path)}
                                                alt="Property"
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => deleteExistingImage(img.id)}
                                                className="absolute inset-x-0 bottom-0 bg-red-600/90 text-white p-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 text-xs font-medium"
                                                title="Delete this image"
                                            >
                                                <Trash2 className="h-3 w-3" /> Delete
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Property Details */}
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
                                        <option value="Townhouse">Townhouse</option>
                                        <option value="Land">Land</option>
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
                            />
                        </div>

                        {/* Upload New Images Section */}
                        <div className="pt-2 border-t border-surface-100 mt-4">
                            <label className="block text-sm font-medium text-surface-700 mb-1">Add More Images</label>
                            <div className="relative">
                                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 h-5 w-5" />
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    ref={fileInputRef}
                                    onChange={handleNewImageChange}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-surface-300 focus:ring-2 focus:ring-primary-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                                />
                            </div>

                            {newImages.length > 0 && (
                                <div className="mt-3 grid grid-cols-4 gap-2">
                                    {newImages.map((img, index) => (
                                        <div key={index} className="relative aspect-square rounded-lg border border-surface-200 border-dashed bg-surface-50 overflow-hidden group">
                                            <img
                                                src={URL.createObjectURL(img)}
                                                alt={`New Preview ${index}`}
                                                className="w-full h-full object-cover opacity-80"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeNewImage(index)}
                                                className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-600"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center mt-4">
                            <input
                                id="is_available"
                                type="checkbox"
                                name="is_available"
                                checked={formData.is_available}
                                onChange={handleChange}
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-surface-300 rounded"
                            />
                            <label htmlFor="is_available" className="ml-2 block text-sm text-surface-900">
                                Property is Available
                            </label>
                        </div>

                        {/* Modal Footer actions sticky bottom equivalent inside flex col */}
                        <div className="pt-6 mt-4 border-t border-surface-200 flex justify-end gap-3 sticky bottom-0 bg-white shadow-[0_-10px_15px_-10px_rgba(0,0,0,0.1)]">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-surface-300 rounded-lg text-surface-700 hover:bg-surface-50 font-medium transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-70"
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
