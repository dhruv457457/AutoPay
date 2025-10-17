import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSmartAccount } from '../../hooks/useSmartAccount';
import { encodeFunctionData } from 'viem';
import { subscriptionManagerAddress, subscriptionManagerAbi } from '../../lib/contracts/contracts'; 
import { fetchSubscriptionsForUser } from '../../utils/fetchSubscriptions';
import type { Subscription } from '../../hooks/useAutoPay';
// 👇 Import the modal
import StatusModal from '../shared/StatusModal';
import SubscriptionItem from './SubscriptionItem';
import { RefreshCw, ChevronLeft, ChevronRight, List } from 'lucide-react';

const SubscriptionsList: React.FC = () => {
    const { smartAccount, pimlicoClient, smartClient } = useSmartAccount();
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error', message: string }>({ type: 'idle', message: '' });
    // 👇 State to control the modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cancellingId, setCancellingId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

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
    
    const sortedSubscriptions = useMemo(() => {
        return [...subscriptions].sort((a, b) => {
            if (a.isActive && !b.isActive) return -1;
            if (!a.isActive && b.isActive) return 1;
            if (a.isActive && b.isActive) {
                return (Number(a.lastPaymentTimestamp) + Number(a.frequency)) - (Number(b.lastPaymentTimestamp) + Number(b.frequency));
            }
            return 0;
        });
    }, [subscriptions]);

    const totalPages = Math.ceil(sortedSubscriptions.length / itemsPerPage);
    const currentSubscriptions = sortedSubscriptions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    useEffect(() => { setCurrentPage(1); }, [subscriptions.length]);

    const handleCancel = async (subscriptionId: string) => {
        if (!smartAccount || !pimlicoClient || !smartClient) return;
        setCancellingId(subscriptionId);
        
        // Open the modal and set initial loading status
        setIsModalOpen(true);
        setStatus({ type: 'loading', message: `Cancelling subscription #${subscriptionId.slice(0,5)}...` });

        try {
            const call = {
                to: subscriptionManagerAddress,
                data: encodeFunctionData({ abi: subscriptionManagerAbi, functionName: 'cancelSubscription', args: [BigInt(subscriptionId)] }),
                value: 0n,
            };
            const fee = await pimlicoClient.getUserOperationGasPrice();
            const opHash = await smartClient.sendUserOperation({
                calls: [call],
                maxFeePerGas: fee.fast.maxFeePerGas,
                maxPriorityFeePerGas: fee.fast.maxPriorityFeePerGas,
            });

            setStatus({ type: 'loading', message: 'Transaction sent. Waiting...' });

            const { receipt } = await pimlicoClient.waitForUserOperationReceipt({ hash: opHash });

            setStatus({ type: 'success', message: `Subscription cancelled successfully! TX: ${receipt.transactionHash}` });
            await loadSubscriptions();
        } catch (e: any) {
            console.error("Failed to cancel subscription", e);
            setStatus({ type: 'error', message: e.shortMessage || 'Cancellation failed.' });
        } finally {
            setCancellingId(null);
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setTimeout(() => setStatus({ type: 'idle', message: '' }), 300);
    };

    return (
        <>
            {/* Render the modal */}
            <StatusModal 
                isOpen={isModalOpen}
                status={status}
                onClose={handleModalClose}
            />

            <div className="bg-white border border-gray-200 rounded-xl p-6 h-full flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Your Subscriptions</h3>
                        <p className="text-sm text-gray-500">{sortedSubscriptions.length} total • {sortedSubscriptions.filter(s => s.isActive).length} active</p>
                    </div>
                    <button onClick={loadSubscriptions} className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md">
                        <RefreshCw className="w-3 h-3" /> Refresh
                    </button>
                </div>
                
                {/* Remove the old inline status display */}
                {/* <StatusDisplay status={status} /> */}

                <div className="flex-grow">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full"><RefreshCw className="w-5 h-5 animate-spin text-gray-400" /></div>
                    ) : sortedSubscriptions.length === 0 ? (
                        <div className="text-center h-full flex flex-col justify-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <List className="w-8 h-8 text-gray-400" />
                            </div>
                            <h4 className="text-lg font-medium text-gray-900">No subscriptions found</h4>
                            <p className="text-sm text-gray-500">Create one to get started.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {currentSubscriptions.map(sub => (
                               <SubscriptionItem key={sub.id} sub={sub} onCancel={handleCancel} isCancelling={cancellingId === sub.id} />
                            ))}
                        </div>
                    )}
                </div>
                {totalPages > 1 && (
                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200">
                        <div className="text-sm text-gray-500">Page {currentPage} of {totalPages}</div>
                        <div className="flex items-center gap-1">
                            <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"><ChevronLeft className="w-4 h-4" /></button>
                            <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"><ChevronRight className="w-4 h-4" /></button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default SubscriptionsList;