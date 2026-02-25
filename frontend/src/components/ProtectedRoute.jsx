import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children, adminOnly = false, agentOnly = false }) {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4 text-surface-500">
                    <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                    <p className="font-medium animate-pulse">Loading identity...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (adminOnly && !user.is_admin) {
        return <Navigate to="/dashboard" replace />;
    }

    if (agentOnly && !user.is_agent) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}
