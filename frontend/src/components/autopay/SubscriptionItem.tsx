import React, { useState, useEffect } from 'react';
import { getAddress, formatEther } from 'viem';
import type { Subscription } from '../../hooks/useAutoPay';
import { supportedTokens } from '../../lib/tokens';

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
        <div className={`p-4 rounded-lg border ${sub.isActive ? 'border-green-600/50 bg-green-900/20' : 'border-gray-600/50 bg-gray-900/20'}`}>
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    {tokenInfo && <img src={tokenInfo.logo} alt={tokenInfo.symbol} className="w-8 h-8 rounded-full" />}
                    <div>
                        <p className="font-bold">To: <span className="font-mono text-sm">{getAddress(sub.recipient)}</span></p>
                        <p className="text-gray-300">
                            {formatEther(BigInt(sub.amount))} {tokenInfo?.symbol || 'Tokens'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                     {sub.isActive && (
                        <div>
                            <p className="text-xs text-gray-400">Next Payment</p>
                            <p className="font-mono font-bold text-green-400">{timeLeft}</p>
                        </div>
                    )}
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${sub.isActive ? 'bg-green-500 text-green-950' : 'bg-gray-500 text-gray-950'}`}>
                        {sub.isActive ? 'Active' : 'Cancelled'}
                    </span>
                    {sub.isActive && (
                        <button
                            onClick={() => onCancel(sub.id)}
                            disabled={isCancelling}
                            className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-1 px-3 rounded-md disabled:bg-gray-500"
                        >
                            {isCancelling ? '...' : 'Cancel'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SubscriptionItem;