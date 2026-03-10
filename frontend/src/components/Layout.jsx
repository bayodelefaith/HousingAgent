import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import logo from '../assets/luxehousing-logo.svg';

export default function Layout() {
    return (
        <div className="min-h-screen flex flex-col bg-surface-50">
            <Navbar />
            <main className="flex-1 w-full flex flex-col">
                <Outlet />
            </main>
            <footer className="border-t border-surface-200 bg-white py-8">
                <div className="container mx-auto px-4 flex flex-col items-center gap-4 text-center text-sm text-surface-500">
                    <img src={logo} alt="LuxeHousing Logo" className="h-8 w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all" />
                    <p>&copy; {new Date().getFullYear()} LuxeHousing. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
