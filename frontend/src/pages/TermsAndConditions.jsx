import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function TermsAndConditions() {
    const navigate = useNavigate();
    const [agreed, setAgreed] = useState(false);

    const handleAgree = () => {
        if (agreed) {
            // Store agreement in session/localStorage
            sessionStorage.setItem('agentTermsAgreed', 'true');
            navigate('/dashboard');
        }
    };

    const handleDisagree = () => {
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-surface-50 py-8 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg border border-surface-200 p-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-surface-900 mb-2">Agent Terms and Conditions</h1>
                        <p className="text-surface-600">Please read and agree to these terms before registering as an agent on LuxeHousing</p>
                    </div>

                    {/* Terms Content */}
                    <div className="bg-surface-50 p-8 rounded-lg border border-surface-200 mb-8 max-h-96 overflow-y-auto">
                        <div className="space-y-6 text-surface-700">
                            <div>
                                <h2 className="text-xl font-bold text-surface-900 mb-2">1. Agent Responsibilities</h2>
                                <p>
                                    As a registered agent on the LuxeHousing platform, you agree to maintain professional conduct, provide accurate property information, and respond promptly to client inquiries. You are responsible for the quality and accuracy of all communications with clients on this platform.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-xl font-bold text-surface-900 mb-2">2. Identity Verification</h2>
                                <p>
                                    You confirm that all information provided, including your NIN (National Identification Number), name, and contact details, is accurate and truthful. You authorize verification of your identity documents. Providing false or misleading information will result in immediate account suspension.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-xl font-bold text-surface-900 mb-2">3. Property Listings</h2>
                                <p>
                                    You agree to list only legitimate properties and provide genuine descriptions, accurate pricing, and authentic images. Fraudulent listings, misleading descriptions, or fake images will result in immediate suspension and potential legal action.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-xl font-bold text-surface-900 mb-2">4. Code of Conduct</h2>
                                <p>
                                    You commit to treating all clients respectfully, avoiding deceptive practices, and complying with all applicable real estate laws and regulations. Any reported misconduct will be investigated, and appropriate action will be taken.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-xl font-bold text-surface-900 mb-2">5. Liability and Disputes</h2>
                                <p>
                                    LuxeHousing is not liable for disputes between agents and clients. You are responsible for your professional conduct and any legal obligations arising from your transactions. All disputes should be resolved directly between parties.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-xl font-bold text-surface-900 mb-2">6. Account Suspension and Termination</h2>
                                <p>
                                    Violation of these terms may result in account suspension or termination without refund of any fees or commissions. We reserve the right to remove any agent who violates platform policies or applicable laws.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-xl font-bold text-surface-900 mb-2">7. Privacy and Data Protection</h2>
                                <p>
                                    Your personal information will be handled according to our Privacy Policy. By agreeing to these terms, you consent to the collection and use of your data as outlined in our Privacy Policy.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-xl font-bold text-surface-900 mb-2">8. Commission and Fees</h2>
                                <p>
                                    Any commissions or fees charged by LuxeHousing will be clearly communicated. You agree to pay all applicable fees as per the platform's pricing structure.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-xl font-bold text-surface-900 mb-2">9. Intellectual Property</h2>
                                <p>
                                    All content, listings, and materials you create on the platform remain your property. However, you grant LuxeHousing a license to use, display, and distribute your content for platform operations.
                                </p>
                            </div>

                            <div>
                                <h2 className="text-xl font-bold text-surface-900 mb-2">10. Agreement and Acknowledgment</h2>
                                <p>
                                    By clicking "I Agree", you acknowledge that you have read, understood, and agree to be bound by these terms and conditions. You confirm that all information provided is accurate and truthful. These terms constitute a legal agreement between you and LuxeHousing.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Checkbox Agreement */}
                    <div className="mb-8">
                        <label className="flex items-start gap-3 p-4 bg-primary-50 border border-primary-200 rounded-lg cursor-pointer hover:bg-primary-100 transition">
                            <input
                                type="checkbox"
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                                className="mt-1 w-5 h-5 text-primary-600 rounded border-primary-300 focus:ring-primary-500 cursor-pointer"
                            />
                            <span className="text-surface-900 font-medium">
                                I have read and agree to the LuxeHousing Agent Terms and Conditions. I confirm that all information I provide will be accurate and truthful.
                            </span>
                        </label>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={handleDisagree}
                            className="flex-1 bg-white border-2 border-surface-300 text-surface-700 px-6 py-3 rounded-lg font-semibold hover:bg-surface-50 transition"
                        >
                            I Disagree
                        </button>
                        <button
                            onClick={handleAgree}
                            disabled={!agreed}
                            className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <CheckCircle2 className="h-5 w-5" />
                            I Agree & Continue
                        </button>
                    </div>

                    {/* Info Message */}
                    {!agreed && (
                        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-amber-800">
                                You must agree to the terms and conditions to proceed with agent registration.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
