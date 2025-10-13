import React from 'react';
import { useSmartAccount } from '../hooks/useSmartAccount';
import { useAutoPay } from '../hooks/useAutoPay';

// Reusable components
import SmartAccountDetails from '../components/details/SmartAccountDetails';
import EOADetails from '../components/details/EOADetails';

// Import the refactored components
import AuthorizationCard from '../components/autopay/AuthorizationCard';
import CreateSubscriptionPanel from '../components/autopay/CreateSubscriptionPanel';
import SubscriptionsList from '../components/autopay/SubscriptionsList';

// --- Main Page Component ---
const AutoPayPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                {/* Enhanced Header Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">AutoPay Dashboard</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">Streamline your recurring payments with intelligent automation and smart contract technology</p>
                </div>

                {/* Account Details Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    <EOADetails />
                    <SmartAccountDetails />
                </div>

                {/* Main Content Area */}
                <AutoPayTerminal />
            </div>
        </div>
    );
};

// --- UI Components ---
const AutoPayTerminal: React.FC = () => {
    const { isReady, smartAccount } = useSmartAccount();
    const { grant, authorizeAutoPay, revokeAuthorization } = useAutoPay();

    if (!isReady || !smartAccount) {
        return (
            <div className="bg-gray-50 border border-gray-200 rounded-2xl shadow-sm p-12 text-center">
                <div className="w-20 h-20 bg-yellow-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Smart Account Required</h3>
                <p className="text-gray-600 text-lg">
                    Connect your wallet to enable the Auto-Pay Terminal and start managing your subscriptions.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            {/* Enhanced Authorization Section */}
            {/* <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-50 rounded-xl mb-4">
                    <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Auto-Pay Terminal</h2>
                <p className="text-gray-600">Secure automated recurring payments via your Smart Account</p>
            </div> */}

            <AuthorizationCard
                grant={grant}
                onAuthorize={authorizeAutoPay}
                onRevoke={revokeAuthorization}
            />

            {grant && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Enhanced Left Side - Create Subscription Form */}
                    <div className="bg-gray-50 rounded-2xl shadow-sm border border-gray-200 p-8">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">Create New Subscription</h3>
                                <p className="text-gray-600">Set up automated recurring payments</p>
                            </div>
                        </div>
                        <CreateSubscriptionPanel />
                    </div>

                    {/* Enhanced Right Side - Subscriptions List */}
                    <div className="bg-gray-50 rounded-2xl shadow-sm border border-gray-200 p-8">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">Active Subscriptions</h3>
                                <p className="text-gray-600">Manage your recurring payments</p>
                            </div>
                        </div>
                        <SubscriptionsList />
                    </div>
                </div>
            )}
        </div>
    );
};




export default AutoPayPage;