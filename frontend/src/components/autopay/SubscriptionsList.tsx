import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSmartAccount } from '../../hooks/useSmartAccount';
import { encodeFunctionData } from 'viem';
import { subscriptionManagerAddress, subscriptionManagerAbi } from '../../lib/contracts/contracts';
import { fetchSubscriptionsForUser } from '../../utils/fetchSubscriptions';
import type { Subscription } from '../../hooks/useAutoPay';
import StatusDisplay from '../shared/StatusDisplay';
import SubscriptionItem from './SubscriptionItem';
import { RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

const SubscriptionsList: React.FC = () => {
    const { smartAccount, pimlicoClient, smartClient } = useSmartAccount();
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error', message: string }>({ type: 'idle', message: '' });
    const [cancellingId, setCancellingId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const loadSubscriptions = useCallback(async () => {
        if (!smartAccount?.address) return;
        setIsLoading(true);
        const subs = await fetchSubscriptionsForUser(smartAccount.address);
        setSubscriptions(subs);
        setIsLoading(false);
    }, [smartAccount?.address]);

    useEffect(() => {
        loadSubscriptions();
        const interval = setInterval(loadSubscriptions, 30000);
        return () => clearInterval(interval);
    }, [loadSubscriptions]);
    
    // Sorting logic
    const sortedSubscriptions = useMemo(() => {
        return [...subscriptions].sort((a, b) => {
            // Active subscriptions first
            if (a.isActive && !b.isActive) return -1;
            if (!a.isActive && b.isActive) return 1;

            // If both are active, sort by next payment time (soonest first)
            if (a.isActive && b.isActive) {
                const nextPaymentA = Number(a.lastPaymentTimestamp) + Number(a.frequency);
                const nextPaymentB = Number(b.lastPaymentTimestamp) + Number(b.frequency);
                return nextPaymentA - nextPaymentB;
            }

            // Keep original order for inactive subscriptions
            return 0;
        });
    }, [subscriptions]);

    // Pagination logic
    const totalPages = Math.ceil(sortedSubscriptions.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentSubscriptions = sortedSubscriptions.slice(startIndex, endIndex);

    // Reset to first page when subscriptions change
    useEffect(() => {
        setCurrentPage(1);
    }, [subscriptions.length]);

    const handleCancel = async (subscriptionId: string) => {
        // ... (handleCancel logic remains exactly the same)
        if (!smartAccount || !pimlicoClient || !smartClient) return;
        setCancellingId(subscriptionId);
        setStatus({ type: 'loading', message: `Cancelling subscription #${subscriptionId}...` });
        try {
            const call = {
                to: subscriptionManagerAddress,
                data: encodeFunctionData({
                    abi: subscriptionManagerAbi,
                    functionName: 'cancelSubscription',
                    args: [BigInt(subscriptionId)]
                }),
                value: 0n,
            };

            const fee = await pimlicoClient.getUserOperationGasPrice();
            const opHash = await smartClient.sendUserOperation({
                calls: [call],
                maxFeePerGas: fee.fast.maxFeePerGas,
                maxPriorityFeePerGas: fee.fast.maxPriorityFeePerGas,
            });

            setStatus({ type: 'loading', message: 'Transaction sent. Waiting...' });
            await pimlicoClient.waitForUserOperationReceipt({ hash: opHash });

            setStatus({ type: 'success', message: 'Subscription cancelled successfully!' });
            await loadSubscriptions();
        } catch (e: any) {
            console.error("Failed to cancel subscription", e);
            setStatus({ type: 'error', message: e.shortMessage || 'Cancellation failed.' });
        } finally {
            setCancellingId(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Active Subscriptions</h3>
                    <p className="text-sm text-gray-500">
                        {sortedSubscriptions.length} total • {sortedSubscriptions.filter(s => s.isActive).length} active
                    </p>
                </div>
                <button 
                    onClick={loadSubscriptions} 
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                </button>
            </div>

            <StatusDisplay status={status} />

            {/* Content */}
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="flex items-center gap-3 text-gray-500">
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>Loading subscriptions...</span>
                    </div>
                </div>
            ) : sortedSubscriptions.length === 0 ? (
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No subscriptions found</h4>
                    <p className="text-gray-500">Create your first subscription to get started</p>
                </div>
            ) : (
                <>
                    {/* Subscriptions List */}
                    <div className="space-y-3">
                        {currentSubscriptions.map(sub => (
                           <SubscriptionItem 
                                key={sub.id} 
                                sub={sub} 
                                onCancel={handleCancel} 
                                isCancelling={cancellingId === sub.id}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                            <div className="text-sm text-gray-500">
                                Showing {startIndex + 1}-{Math.min(endIndex, sortedSubscriptions.length)} of {sortedSubscriptions.length} subscriptions
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`px-3 py-1 text-sm rounded-md transition-colors ${
                                                currentPage === page
                                                    ? 'bg-blue-600 text-white'
                                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default SubscriptionsList;