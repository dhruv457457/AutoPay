import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSmartAccount } from '../../hooks/useSmartAccount';
import { encodeFunctionData } from 'viem';
import { subscriptionManagerAddress, subscriptionManagerAbi } from '../../lib/contracts/contracts';
import { fetchSubscriptionsForUser } from '../../utils/fetchSubscriptions';
import type { Subscription } from '../../hooks/useAutoPay';
import StatusDisplay from '../shared/StatusDisplay';
import SubscriptionItem from './SubscriptionItem'; // NEW: Import the item component

const SubscriptionsList: React.FC = () => {
    const { smartAccount, pimlicoClient, smartClient } = useSmartAccount();
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error', message: string }>({ type: 'idle', message: '' });
    const [cancellingId, setCancellingId] = useState<string | null>(null);

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
    
    // NEW: Sorting logic
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
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">My Subscriptions</h3>
                <button onClick={loadSubscriptions} className="text-sm text-gray-400 hover:text-white">Refresh</button>
            </div>
            <StatusDisplay status={status} />
            {isLoading ? (<p>Loading subscriptions...</p>)
                : sortedSubscriptions.length === 0 ? (<p className="text-gray-400">No subscriptions found.</p>)
                : (
                    <div className="space-y-4">
                        {sortedSubscriptions.map(sub => (
                           <SubscriptionItem 
                                key={sub.id} 
                                sub={sub} 
                                onCancel={handleCancel} 
                                isCancelling={cancellingId === sub.id}
                            />
                        ))}
                    </div>
                )}
        </div>
    );
}

export default SubscriptionsList;