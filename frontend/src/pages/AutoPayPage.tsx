import React, { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { useSmartAccount } from '../hooks/useSmartAccount';
import { useAutoPay, type Subscription } from '../hooks/useAutoPay';
import { encodeFunctionData, isAddress, parseEther, getAddress, maxUint256 } from 'viem';

// Reusable components
import SmartAccountDetails from '../components/details/SmartAccountDetails';
import EOADetails from '../components/details/EOADetails';
import StatusDisplay from '../components/shared/StatusDisplay';

// ABIs and Addresses
import { subscriptionManagerAddress, subscriptionManagerAbi } from '../lib/contracts/contracts';
import { erc20Abi } from '../lib/abis/erc20Abi';

const INDEXER_URL = 'https://indexer.dev.hyperindex.xyz/223f75b/v1/graphql';

// Helper function to fetch subscriptions for a user's smart account
const fetchSubscriptionsForUser = async (address: string): Promise<Subscription[]> => {
    if (!isAddress(address)) return [];
    const query = {
        query: `
            query GetUserSubscriptions($subscriber: String!) {
                Subscription(where: { subscriber: { _eq: $subscriber } }, order_by: { id: desc }) {
                    id
                    owner # Fetch the owner field
                    recipient
                    token
                    amount
                    frequency
                    lastPaymentTimestamp
                    isActive
                }
            }
        `,
        variables: { subscriber: address.toLowerCase() },
    };
    try {
        const response = await fetch(INDEXER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(query),
        });
        const result = await response.json();
        return result?.data?.Subscription ?? [];
    } catch (error) {
        console.error("Failed to fetch subscriptions:", error);
        return [];
    }
};


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

const AuthorizationCard: React.FC<{ grant: any; onAuthorize: () => void; onRevoke: () => void; }> = ({ grant, onAuthorize, onRevoke }) => (
    <div className={`p-6 rounded-lg ${grant ? 'bg-green-900/50' : 'bg-red-900/50'}`}>
        <div className="flex items-center justify-between">
            <div>
                <h3 className="font-bold text-lg">{grant ? 'Agent Authorized' : 'Authorization Required'}</h3>
                <p className="text-sm text-gray-300">{grant ? 'The agent has permission to execute payments.' : 'Sign a message to delegate payment execution to the agent.'}</p>
            </div>
            <button
                onClick={grant ? onRevoke : onAuthorize}
                className={`px-5 py-2 rounded-md font-bold transition-colors ${grant ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
            >
                {grant ? 'Revoke Agent' : 'Authorize Agent'}
            </button>
        </div>
    </div>
);

const LiveActivityLog: React.FC<{ status: string }> = ({ status }) => (
    <div className="bg-black rounded-lg p-5 shadow-inner">
        <div className="flex items-center gap-3 mb-3">
            <span className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></span>
            <p className="font-mono text-md text-gray-400">Live Activity Log</p>
        </div>
        <p className="font-mono text-sm text-cyan-300"><span className="text-green-400 mr-2">›</span>{status}</p>
    </div>
);

const CreateSubscriptionPanel: React.FC = () => {
    // 👇 --- THE CHANGE: Get the user's EOA address ---
    const { address: eoaAddress } = useAccount(); 
    const { smartAccount, pimlicoClient, smartClient } = useSmartAccount();
    const [recipient, setRecipient] = useState('');
    const [token, setToken] = useState('');
    const [amount, setAmount] = useState('');
    const [frequency, setFrequency] = useState('120');
    const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error', message: string }>({ type: 'idle', message: '' });

    const handleCreate = async () => {
        // 👇 --- THE CHANGE: Add a check for the EOA address ---
        if (!smartAccount || !pimlicoClient || !smartClient || !eoaAddress) {
            setStatus({ type: 'error', message: 'Wallet not fully connected.'});
            return;
        };
        if (!isAddress(recipient) || !isAddress(token) || !amount) {
            setStatus({ type: 'error', message: 'Please fill all fields with valid addresses and an amount.' });
            return;
        }

        setStatus({ type: 'loading', message: 'Preparing subscription transaction...' });
        try {
            const parsedAmount = parseEther(amount as `${number}`);

            const calls = [
                {
                    to: getAddress(token),
                    data: encodeFunctionData({
                        abi: erc20Abi,
                        functionName: 'approve',
                        args: [subscriptionManagerAddress, maxUint256] 
                    }),
                    value: 0n,
                },
                {
                    to: subscriptionManagerAddress,
                    data: encodeFunctionData({
                        abi: subscriptionManagerAbi,
                        functionName: 'createSubscription',
                        // 👇 --- THE CHANGE: Pass the EOA address as the first argument ---
                        args: [eoaAddress, getAddress(recipient), getAddress(token), parsedAmount, BigInt(frequency)]
                    }),
                    value: 0n,
                }
            ];
            
            const fee = await pimlicoClient.getUserOperationGasPrice();
            const opHash = await smartClient.sendUserOperation({
                calls,
                maxFeePerGas: fee.fast.maxFeePerGas,
                maxPriorityFeePerGas: fee.fast.maxPriorityFeePerGas,
            });

            setStatus({ type: 'loading', message: `Subscription sent! Waiting for confirmation...` });
            const { receipt } = await pimlicoClient.waitForUserOperationReceipt({ hash: opHash });
            setStatus({ type: 'success', message: `Subscription created! TX: ${receipt.transactionHash.slice(0, 12)}...` });
            
            setRecipient(''); setToken(''); setAmount('');
        } catch (e: any) {
            console.error("Failed to create subscription:", e);
            setStatus({ type: 'error', message: e.shortMessage || 'An error occurred.' });
        }
    };

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold">Create New Subscription</h3>
            <StatusDisplay status={status} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="text" placeholder="Recipient Address (0x...)" value={recipient} onChange={e => setRecipient(e.target.value)} className="bg-gray-800 p-3 rounded-md focus:ring-2 focus:ring-purple-500 outline-none" />
                <input type="text" placeholder="Token Address (0x...)" value={token} onChange={e => setToken(e.target.value)} className="bg-gray-800 p-3 rounded-md focus:ring-2 focus:ring-purple-500 outline-none" />
                <input type="text" placeholder="Amount (e.g., 15.0)" value={amount} onChange={e => setAmount(e.target.value)} className="bg-gray-800 p-3 rounded-md focus:ring-2 focus:ring-purple-500 outline-none" />
                <select value={frequency} onChange={e => setFrequency(e.target.value)} className="bg-gray-800 p-3 rounded-md focus:ring-2 focus:ring-purple-500 outline-none">
                    <option value={120}>2 Minutes (for testing)</option>
                    <option value={2592000}>Monthly</option>
                    <option value={31536000}>Yearly</option>
                </select>
            </div>
            <button onClick={handleCreate} disabled={status.type === 'loading'} className="w-full bg-purple-600 hover:bg-purple-700 p-3 rounded-md font-bold disabled:bg-gray-600 disabled:cursor-not-allowed">
                {status.type === 'loading' ? 'Creating...' : 'Create Subscription'}
            </button>
        </div>
    );
};

const SubscriptionsList: React.FC = () => {
    const { address: eoaAddress } = useAccount();
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

    const handleCancel = async (subscriptionId: string) => {
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
            {isLoading ? ( <p>Loading subscriptions...</p> ) : 
             subscriptions.length === 0 ? ( <p className="text-gray-400">No subscriptions found.</p> ) : 
             (
                <div className="space-y-4">
                    {subscriptions.map(sub => (
                        <div key={sub.id} className={`p-4 rounded-lg border ${sub.isActive ? 'border-green-600/50 bg-green-900/20' : 'border-gray-600/50 bg-gray-900/20'}`}>
                           <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-bold">To: <span className="font-mono text-sm">{getAddress(sub.recipient)}</span></p>
                                    <p className="text-gray-300">{parseFloat(parseEther(sub.amount as `${number}`).toString()) / 1e18} <span className="font-mono text-xs">{getAddress(sub.token)}</span> / {parseInt(sub.frequency) > 2600000 ? 'Month' : `${parseInt(sub.frequency)/60} min`}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${sub.isActive ? 'bg-green-500 text-green-950' : 'bg-gray-500 text-gray-950'}`}>
                                        {sub.isActive ? 'Active' : 'Cancelled'}
                                    </span>
                                    {sub.isActive && (
                                        <button 
                                            onClick={() => handleCancel(sub.id)}
                                            disabled={cancellingId === sub.id}
                                            className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-1 px-3 rounded-md disabled:bg-gray-500"
                                        >
                                            {cancellingId === sub.id ? '...' : 'Cancel'}
                                        </button>
                                    )}
                                </div>
                           </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AutoPayPage;

