import React from 'react';
import { useSmartAccount } from '../hooks/useSmartAccount';
import { useAutoPay } from '../hooks/useAutoPay';
import SmartAccountDetails from '../components/details/SmartAccountDetails';
import EOADetails from '../components/details/EOADetails';
import AuthorizationCard from '../components/autopay/AuthorizationCard';
import CreateSubscriptionPanel from '../components/autopay/CreateSubscriptionPanel';
import SubscriptionsList from '../components/autopay/SubscriptionsList';
import { WifiOff } from 'lucide-react';

const AutoPayPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="text-left mb-16">
                    <p className="text-base font-semibold text-green-700 mb-2">AUTOPAY DASHBOARD</p>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Streamline Your Recurring Payments
                    </h1>
                    <p className="text-lg text-gray-600 max-w-3xl">
                        Manage your smart account, authorize the payment agent, and create new on-chain subscriptions all in one place.
                    </p>
                </div>

                {/* Account Details Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <EOADetails />
                    <SmartAccountDetails />
                </div>

                {/* Main Content Area */}
                <AutoPayTerminal />
            </div>
        </div>
    );
};

const AutoPayTerminal: React.FC = () => {
    const { isReady, smartAccount } = useSmartAccount();
    const { grant, authorizeAutoPay, revokeAuthorization } = useAutoPay();

    if (!isReady || !smartAccount) {
        return (
            <div className="border border-gray-200 rounded-xl p-12 text-center bg-gray-50">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <WifiOff className="w-8 h-8 text-gray-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Smart Account Required</h3>
                <p className="text-gray-600">
                    Please connect your wallet to initialize the AutoPay terminal.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <AuthorizationCard
                grant={grant}
                onAuthorize={authorizeAutoPay}
                onRevoke={revokeAuthorization}
            />

            {grant && (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-2">
                        <CreateSubscriptionPanel />
                    </div>
                    <div className="lg:col-span-3">
                        <SubscriptionsList />
                    </div>
                </div>
            )}
        </div>
    );
};

export default AutoPayPage;