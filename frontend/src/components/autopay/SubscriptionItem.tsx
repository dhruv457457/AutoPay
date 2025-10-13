import React, { useState, useEffect } from 'react';
import { getAddress, formatEther } from 'viem';
import type { Subscription } from '../../hooks/useAutoPay';
import { supportedTokens } from '../../lib/tokens';
import { Clock, X, Loader2 } from 'lucide-react';

interface SubscriptionItemProps {
    sub: Subscription;
    onCancel: (id: string) => void;
    isCancelling: boolean;
}

// Helper to format remaining time
const formatTimeLeft = (seconds: number): string => {
    if (seconds <= 0) return "Due now";

    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    return [
        d > 0 ? `${d}d` : '',
        h > 0 ? `${h}h` : '',
        m > 0 ? `${m}m` : '',
        s > 0 ? `${s}s` : ''
    ].filter(Boolean).join(' ');
};


const SubscriptionItem: React.FC<SubscriptionItemProps> = ({ sub, onCancel, isCancelling }) => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        if (!sub.isActive) {
            setTimeLeft('N/A');
            return;
        }

        const calculateTimeLeft = () => {
            const now = Math.floor(Date.now() / 1000);
            const nextPaymentTimestamp = Number(sub.lastPaymentTimestamp) + Number(sub.frequency);
            const remaining = nextPaymentTimestamp - now;
            setTimeLeft(formatTimeLeft(remaining));
        };

        calculateTimeLeft(); // Initial calculation
        const interval = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, [sub.isActive, sub.lastPaymentTimestamp, sub.frequency]);
    
    const tokenInfo = supportedTokens.find(t => t.address.toLowerCase() === sub.token.toLowerCase());

    return (
        <div className={`p-4 rounded-lg border transition-all duration-200 ${
            sub.isActive 
                ? 'border-green-200 bg-green-50 hover:bg-green-100' 
                : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
        }`}>
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    {tokenInfo && (
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-gray-200">
                            <img src={tokenInfo.logo} alt={tokenInfo.symbol} className="w-8 h-8 rounded-full" />
                        </div>
                    )}
                    <div>
                        <p className="font-semibold text-gray-900 mb-1">
                            To: <span className="font-mono text-sm text-gray-600">{getAddress(sub.recipient)}</span>
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                            {formatEther(BigInt(sub.amount))} {tokenInfo?.symbol || 'Tokens'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {sub.isActive && (
                        <div className="text-right">
                            <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                                <Clock className="w-3 h-3" />
                                Next Payment
                            </div>
                            <p className="font-mono font-bold text-green-600">{timeLeft}</p>
                        </div>
                    )}
                    
                    <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            sub.isActive 
                                ? 'bg-green-100 text-green-800 border border-green-200' 
                                : 'bg-gray-100 text-gray-800 border border-gray-200'
                        }`}>
                            {sub.isActive ? 'Active' : 'Cancelled'}
                        </span>
                        
                        {sub.isActive && (
                            <button
                                onClick={() => onCancel(sub.id)}
                                disabled={isCancelling}
                                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 hover:border-red-300 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isCancelling ? (
                                    <>
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                        Cancelling...
                                    </>
                                ) : (
                                    <>
                                        <X className="w-3 h-3" />
                                        Cancel
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionItem;