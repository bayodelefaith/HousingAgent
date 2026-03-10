import { Link, useNavigate } from 'react-router-dom';
import { Home, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/luxehousing-logo.svg';

export default function Navbar() {
    const { user, isAdmin, isVerifiedAgent, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-surface-200 bg-white/80 backdrop-blur-md">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <img src={logo} alt="LuxeHousing Logo" className="h-10 w-auto object-contain" />
                    </Link>

                    <div className="flex items-center gap-4">
                        <Link to="/properties" className="text-sm font-medium text-surface-600 hover:text-primary-600 transition-colors">
                            Explore Properties
                        </Link>

                        {user ? (
                            <div className="flex items-center gap-4">
                                {isAdmin && (
                                    <Link to="/admin" className="text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors bg-purple-50 px-3 py-1.5 rounded-md">
                                        Admin Panel
                                    </Link>
                                )}
                                {isVerifiedAgent && !isAdmin && (
                                    <Link to="/agent-panel" className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors bg-emerald-50 px-3 py-1.5 rounded-md">
                                        Agent Panel
                                    </Link>
                                )}
                                <Link to="/dashboard" className="text-sm font-medium text-surface-600 hover:text-primary-600 transition-colors">
                                    Dashboard
                                </Link>
                                <div className="h-6 w-px bg-surface-200 hidden sm:block"></div>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-700">
                                        <User className="h-4 w-4" />
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-1 text-sm font-medium text-surface-600 hover:text-red-600 transition-colors"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        <span className="hidden sm:inline">Logout</span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/login" className="text-sm font-medium text-surface-600 hover:text-primary-600 transition-colors">
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all"
                                >
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
