import React, { useState, useEffect } from 'react';
import { getAddress, formatEther } from 'viem';
import type { Subscription } from '../../hooks/useAutoPay';
import { supportedTokens } from '../../lib/tokens';
import { Clock, X, Loader2 } from 'lucide-react';

const formatTimeLeft = (seconds: number): string => {
    if (seconds <= 0) return "Due now";
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (d > 0) return `${d}d ${h}h`;
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
};

const SubscriptionItem: React.FC<{ sub: Subscription; onCancel: (id: string) => void; isCancelling: boolean; }> = ({ sub, onCancel, isCancelling }) => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        if (!sub.isActive) {
            setTimeLeft('N/A');
            return;
        }
        const calculateTimeLeft = () => {
            const now = Math.floor(Date.now() / 1000);
            const nextPaymentTimestamp = Number(sub.lastPaymentTimestamp) + Number(sub.frequency);
            setTimeLeft(formatTimeLeft(nextPaymentTimestamp - now));
        };
        calculateTimeLeft();
        const interval = setInterval(calculateTimeLeft, 1000 * 60); // Update every minute
        return () => clearInterval(interval);
    }, [sub.isActive, sub.lastPaymentTimestamp, sub.frequency]);
    
    const tokenInfo = supportedTokens.find(t => getAddress(t.address) === getAddress(sub.token));

    return (
        <div className={`p-3 bg-white rounded-lg border border-l-4 ${
            sub.isActive ? 'border-l-green-500 border-gray-200' : 'border-l-gray-300 border-gray-200'
        }`}>
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    {tokenInfo && <img src={tokenInfo.logo} alt={tokenInfo.symbol} className="w-8 h-8 rounded-full" />}
                    <div>
                        <p className="font-semibold text-gray-800">
                            {formatEther(BigInt(sub.amount))} {tokenInfo?.symbol || 'Tokens'}
                        </p>
                        <p className="text-xs text-gray-500">
                            To: <span className="font-mono">{getAddress(sub.recipient).slice(0, 6)}...{getAddress(sub.recipient).slice(-4)}</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {sub.isActive && (
                        <div className="flex items-center gap-1.5 text-xs text-green-700">
                            <Clock className="w-3 h-3" />
                            <span>{timeLeft}</span>
                        </div>
                    )}
                     <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        sub.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
                    }`}>
                        {sub.isActive ? 'Active' : 'Cancelled'}
                    </span>
                    {sub.isActive && (
                        <button
                            onClick={() => onCancel(sub.id)}
                            disabled={isCancelling}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md disabled:opacity-50"
                            title="Cancel Subscription"
                        >
                            {isCancelling ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SubscriptionItem;