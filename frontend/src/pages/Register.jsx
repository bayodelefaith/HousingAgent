import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, ArrowRight, KeyRound } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/luxehousing-logo.svg';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            // 1. Register User
            await api.post('/auth/register', { email, password });

            // 2. Automatically log them in after
            const formData = new URLSearchParams();
            formData.append('username', email);
            formData.append('password', password);

            const loginRes = await api.post('/auth/login/access-token', formData, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });

            const token = loginRes.data.access_token;

            // 3. Setup context
            const userRes = await api.get('/auth/me', {
                headers: { Authorization: `Bearer ${token}` }
            });

            login(token, userRes.data);
            navigate('/properties');
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to register account.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
            <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-surface-200">
                <div className="p-8">
                    <div className="mb-8 text-center">
                        <Link to="/" className="mx-auto mb-4 block">
                            <img src={logo} alt="LuxeHousing Logo" className="mx-auto h-16 w-auto object-contain" />
                        </Link>
                        <h1 className="text-2xl font-bold tracking-tight text-surface-900">Create an Account</h1>
                        <p className="mt-2 text-sm text-surface-500">Join LuxeHousing for premium properties</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200">
                                {error}
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-surface-700">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-surface-400">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full rounded-lg border border-surface-300 pl-10 px-4 py-2.5 text-surface-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-surface-700">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-surface-400">
                                    <Lock className="h-5 w-5" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full rounded-lg border border-surface-300 pl-10 px-4 py-2.5 text-surface-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                                    placeholder="Create a strong password"
                                    minLength={8}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-surface-700">Confirm Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-surface-400">
                                    <KeyRound className="h-5 w-5" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="block w-full rounded-lg border border-surface-300 pl-10 px-4 py-2.5 text-surface-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                                    placeholder="Repeat your password"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative flex w-full justify-center rounded-lg bg-primary-600 px-4 py-3 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-70 transition-all mt-6"
                        >
                            {loading ? 'Creating account...' : 'Create Account'}
                            {!loading && <ArrowRight className="ml-2 h-4 w-4 opacity-70 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-surface-600">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-500 transition-colors">
                            Sign in instead
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
