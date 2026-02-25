import { Link } from 'react-router-dom';
import { Search, MapPin, KeySquare, ShieldCheck } from 'lucide-react';

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-surface-900 py-20 sm:py-32">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2075&q=80')] bg-cover bg-center bg-no-repeat opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-surface-900 via-surface-900/40"></div>

                <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                        Find Your Next <span className="text-primary-500">Perfect Home</span>
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-lg text-surface-300">
                        Browse fully verified, premium properties listed by certified agents.
                        No scams, no hassle. Just beautiful homes.
                    </p>

                    <div className="mt-10 mx-auto max-w-3xl">
                        <div className="flex flex-col sm:flex-row items-center bg-white rounded-xl shadow-xl p-2 gap-2">
                            <div className="flex-1 w-full relative flex items-center">
                                <MapPin className="absolute left-4 h-5 w-5 text-surface-400" />
                                <input
                                    type="text"
                                    placeholder="Location, neighborhood, or city"
                                    className="w-full bg-transparent pl-12 pr-4 py-3 text-surface-900 focus:outline-none"
                                />
                            </div>
                            <div className="hidden sm:block w-px h-8 bg-surface-200"></div>
                            <div className="flex-1 w-full relative flex items-center">
                                <KeySquare className="absolute left-4 h-5 w-5 text-surface-400" />
                                <select className="w-full bg-transparent pl-12 pr-4 py-3 text-surface-900 focus:outline-none appearance-none">
                                    <option value="">Property Type</option>
                                    <option value="apartment">Apartment</option>
                                    <option value="house">House</option>
                                    <option value="condo">Condo</option>
                                </select>
                            </div>
                            <Link
                                to="/properties"
                                className="w-full sm:w-auto flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white rounded-lg px-8 py-3 font-semibold transition-colors"
                            >
                                <Search className="h-5 w-5 mr-2" />
                                Search
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold tracking-tight text-surface-900 sm:text-4xl">
                            Why Choose LuxeHousing?
                        </h2>
                        <p className="mt-4 text-lg text-surface-600">
                            We built our platform from the ground up to protect renters and buyers.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-surface-50 p-8 rounded-2xl border border-surface-200 text-center hover:shadow-lg transition-shadow">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-primary-600 mb-6">
                                <ShieldCheck className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-semibold text-surface-900 mb-3">Verified Agents Only</h3>
                            <p className="text-surface-600">Every agent on our platform undergoes strict identity verification, including National ID checks.</p>
                        </div>

                        <div className="bg-surface-50 p-8 rounded-2xl border border-surface-200 text-center hover:shadow-lg transition-shadow">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-6">
                                <Search className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-semibold text-surface-900 mb-3">Seamless Browsing</h3>
                            <p className="text-surface-600">Filter through thousands of highly curated listings with exactly the specifications you desire.</p>
                        </div>

                        <div className="bg-surface-50 p-8 rounded-2xl border border-surface-200 text-center hover:shadow-lg transition-shadow">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent-100 text-accent-600 mb-6">
                                <KeySquare className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-semibold text-surface-900 mb-3">Direct Contact</h3>
                            <p className="text-surface-600">Message agents directly through the platform and view their historical ratings from real users.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
