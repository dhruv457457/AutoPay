// components/details/SmartAccountDetails.tsx
import React, { useState, useEffect } from 'react';
import { useSmartAccount } from '../../hooks/useSmartAccount';
import { formatEther } from 'viem';
import { Eye, EyeOff, Copy, Check, Smartphone, Loader2 } from 'lucide-react';

// A simple copy-to-clipboard utility hook
const useCopyToClipboard = () => {
    const [copied, setCopied] = useState(false);
    const copy = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
        });
    };
    return { copied, copy };
};

const SmartAccountDetails: React.FC = () => {
    const { smartAccount, publicClient, isReady, isSettingUp } = useSmartAccount();
    const [balance, setBalance] = useState<string>('0');
    const { copied, copy } = useCopyToClipboard();
    const [showBalance, setShowBalance] = useState(false);

    useEffect(() => {
        const fetchBalance = async () => {
            if (isReady && publicClient && smartAccount?.address) {
                try {
                    const bal = await publicClient.getBalance({ address: smartAccount.address });
                    setBalance(formatEther(bal));
                } catch (error) {
                    console.error("Failed to fetch smart account balance:", error);
                    setBalance('0');
                }
            }
        };

        fetchBalance();
    }, [isReady, publicClient, smartAccount?.address]);

    const address = smartAccount?.address;

    return (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl shadow-sm p-8 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center">
                    <Smartphone className="w-7 h-7 text-purple-600" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Delegation Wallet (Smart Account)</h3>
                    <p className="text-sm text-gray-500">Your automated payment wallet</p>
                </div>
            </div>

            {/* Status */}
            {isSettingUp && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                    <div className="flex items-center gap-3">
                        <Loader2 className="w-5 h-5 text-yellow-600 animate-spin" />
                        <p className="text-sm font-medium text-yellow-700">Initializing smart account...</p>
                    </div>
                </div>
            )}

            {/* Address */}
            {isReady && address && (
                <div className="mb-8">
                    <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200">
                        <p className="text-sm font-mono text-gray-800 truncate flex-1" title={address}>
                            {address.slice(0, 8)}...{address.slice(-6)}
                        </p>
                        <button 
                            onClick={() => copy(address)} 
                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg"
                            title="Copy address"
                        >
                            {copied ? (
                                <Check className="h-4 w-4 text-green-500" />
                            ) : (
                                <Copy className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* Balance */}
            <div className="mt-auto">
                <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Balance</p>
                    <button 
                        onClick={() => setShowBalance(!showBalance)}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg"
                    >
                        {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                    <p className="text-3xl font-bold text-purple-900">
                        {showBalance ? `${parseFloat(balance).toFixed(4)} MONAD` : '••••••••'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SmartAccountDetails;