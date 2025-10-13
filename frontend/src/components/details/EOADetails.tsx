// components/details/EOADetails.tsx
import React, { useState} from 'react';
import { useAccount, useBalance } from 'wagmi';
import { formatEther } from 'viem';
import { Eye, EyeOff, Copy, Check, Wallet } from 'lucide-react';

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

const EOADetails: React.FC = () => {
    const { address, isConnected } = useAccount();
    const { data: balanceData } = useBalance({ address });
    const { copied, copy } = useCopyToClipboard();
    const [showBalance, setShowBalance] = useState(false);

    if (!isConnected || !address) {
        return (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 h-full flex items-center justify-center">
                <div className="text-center">
                    <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">Please connect your wallet</p>
                </div>
            </div>
        );
    }
    
    const balance = balanceData ? formatEther(balanceData.value) : '0';

    return (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl shadow-sm p-8 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center">
                    <Wallet className="w-7 h-7 text-blue-600" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Connected Wallet (EOA)</h3>
                    <p className="text-sm text-gray-500">Your primary wallet address</p>
                </div>
            </div>

            {/* Address */}
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
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <p className="text-3xl font-bold text-blue-900">
                        {showBalance ? `${parseFloat(balance).toFixed(4)} MONAD` : '••••••••'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default EOADetails;