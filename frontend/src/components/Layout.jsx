import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
    return (
        <div className="min-h-screen flex flex-col bg-surface-50">
            <Navbar />
            <main className="flex-1 w-full flex flex-col">
                <Outlet />
            </main>
            <footer className="border-t border-surface-200 bg-white py-8">
                <div className="container mx-auto px-4 text-center text-sm text-surface-500">
                    <p>&copy; {new Date().getFullYear()} LuxeHousing. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
