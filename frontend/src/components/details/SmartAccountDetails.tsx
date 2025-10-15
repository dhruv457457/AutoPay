import React, { useState, useEffect } from 'react';
import { useSmartAccount } from '../../hooks/useSmartAccount';
import { formatEther } from 'viem';
import { Eye, EyeOff, Copy, Check, Smartphone, Loader2 } from 'lucide-react';

const useCopyToClipboard = () => {
    const [copied, setCopied] = useState(false);
    const copy = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };
    return { copied, copy };
};

const SmartAccountDetails: React.FC = () => {
    const { smartAccount, publicClient, isReady, isSettingUp } = useSmartAccount();
    const [balance, setBalance] = useState<string>('0');
    const { copied, copy } = useCopyToClipboard();
    const [showBalance, setShowBalance] = useState(true);

    useEffect(() => {
        const fetchBalance = async () => {
            if (isReady && publicClient && smartAccount?.address) {
                try {
                    const bal = await publicClient.getBalance({ address: smartAccount.address });
                    setBalance(formatEther(bal));
                } catch (error) {
                    console.error("Failed to fetch smart account balance:", error);
                }
            }
        };
        if (!isSettingUp) fetchBalance();
    }, [isReady, publicClient, smartAccount?.address, isSettingUp]);

    const address = smartAccount?.address;

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 h-full flex flex-col">
            <div className="flex items-start mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-50 border border-gray-200 rounded-lg mr-4">
                    <Smartphone className="w-6 h-6 text-gray-700" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Delegation Wallet</h3>
                    <p className="text-sm text-gray-500">Your automated payment wallet.</p>
                </div>
            </div>

            {isSettingUp ? (
                <div className="flex items-center justify-center h-full">
                    <div className="flex items-center gap-3 text-gray-500">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Initializing Smart Account...</span>
                    </div>
                </div>
            ) : isReady && address ? (
                <>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 mb-6">
                        <p className="text-sm font-mono text-gray-600 truncate flex-1" title={address}>
                            {address}
                        </p>
                        <button onClick={() => copy(address)} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md">
                            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                        </button>
                    </div>
                    <div className="mt-auto">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-semibold text-gray-500 uppercase">Balance</p>
                            <button onClick={() => setShowBalance(!showBalance)} className="p-1 text-gray-400 hover:text-gray-600">
                                {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                            {showBalance ? `${parseFloat(balance).toFixed(4)} MON` : '••••••••'}
                        </p>
                    </div>
                </>
            ) : null}
        </div>
    );
};

export default SmartAccountDetails;