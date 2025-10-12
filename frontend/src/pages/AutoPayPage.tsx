import React from 'react';
import { useSmartAccount } from '../hooks/useSmartAccount';
import { useAutoPay } from '../hooks/useAutoPay';

// Reusable components
import SmartAccountDetails from '../components/details/SmartAccountDetails';
import EOADetails from '../components/details/EOADetails';

// NEW: Import the refactored components
import AuthorizationCard from '../components/autopay/AuthorizationCard';
import LiveActivityLog from '../components/autopay/LiveActivityLog';
import CreateSubscriptionPanel from '../components/autopay/CreateSubscriptionPanel';
import SubscriptionsList from '../components/autopay/SubscriptionsList';

// --- Main Page Component ---
const AutoPayPage: React.FC = () => {
    return (
        <div className="max-w-7xl mx-auto min-h-screen py-12 px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <EOADetails />
                <SmartAccountDetails />
            </div>
            <AutoPayTerminal />
        </div>
    );
};

// --- UI Components ---
const AutoPayTerminal: React.FC = () => {
    const { isReady, smartAccount } = useSmartAccount();
    const { grant, status, authorizeAutoPay, revokeAuthorization } = useAutoPay();

    if (!isReady || !smartAccount) {
        return (
            <div className="bg-yellow-900/50 border border-yellow-700 rounded-lg p-8 text-center">
                <h3 className="font-bold text-yellow-300 text-lg">Smart Account Required</h3>
                <p className="mt-3 text-md text-yellow-400">
                    Connect your wallet to enable the Auto-Pay Terminal.
                </p>
            </div>
        );
    }

    return (
        <div className="border border-[#333336] bg-[#1a1a1d] rounded-3xl shadow-2xl p-8 space-y-8">
            <div className="text-center border-b border-gray-700 pb-6">
                <h2 className="text-2xl font-bold text-white tracking-tight">Auto-Pay Terminal</h2>
                <p className="text-md text-gray-400 mt-2">Automated recurring payments via your Smart Account.</p>
            </div>

            <AuthorizationCard
                grant={grant}
                onAuthorize={authorizeAutoPay}
                onRevoke={revokeAuthorization}
            />

            {grant && (
                <div className="pt-8 border-t border-gray-700 space-y-12">
                    <LiveActivityLog status={status} />
                    <CreateSubscriptionPanel />
                    <SubscriptionsList />
                </div>
            )}
        </div>
    );
};




export default AutoPayPage;