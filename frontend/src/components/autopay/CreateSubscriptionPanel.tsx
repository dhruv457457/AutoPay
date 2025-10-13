import React, { useState, useEffect, useRef } from 'react';
import { useAccount } from 'wagmi';
import { useSmartAccount } from '../../hooks/useSmartAccount';
import { encodeFunctionData, isAddress, parseEther, getAddress, maxUint256 } from 'viem';
import { subscriptionManagerAddress, subscriptionManagerAbi } from '../../lib/contracts/contracts';
import { erc20Abi } from '../../lib/abis/erc20Abi';
import StatusDisplay from '../shared/StatusDisplay';
import { supportedTokens } from '../../lib/tokens';
import { ChevronDown, Plus, Loader2 } from 'lucide-react';

const CreateSubscriptionPanel: React.FC = () => {
    const { address: eoaAddress } = useAccount();
    const { smartAccount, pimlicoClient, smartClient } = useSmartAccount();
    const [recipient, setRecipient] = useState('');
    const [tokenAddress, setTokenAddress] = useState(supportedTokens[0].address);
    const [amount, setAmount] = useState('');
    const [frequency, setFrequency] = useState('120');
    const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error', message: string }>({ type: 'idle', message: '' });

    const [isTokenDropdownOpen, setIsTokenDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    
    // NEW: State to toggle between dropdown and custom input
    const [isCustomToken, setIsCustomToken] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsTokenDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleCreate = async () => {
        if (!smartAccount || !pimlicoClient || !smartClient || !eoaAddress) {
            setStatus({ type: 'error', message: 'Wallet not fully connected.' });
            return;
        };
        // The validation now works for both dropdown and custom input via tokenAddress state
        if (!isAddress(recipient) || !isAddress(tokenAddress) || !amount) {
            setStatus({ type: 'error', message: 'Please fill all fields with valid addresses and an amount.' });
            return;
        }
        setStatus({ type: 'loading', message: 'Preparing subscription transaction...' });
        try {
            const parsedAmount = parseEther(amount as `${number}`);
            const calls = [
                {
                    to: getAddress(tokenAddress),
                    data: encodeFunctionData({ abi: erc20Abi, functionName: 'approve', args: [subscriptionManagerAddress, maxUint256] }),
                    value: 0n,
                },
                {
                    to: subscriptionManagerAddress,
                    data: encodeFunctionData({ abi: subscriptionManagerAbi, functionName: 'createSubscription', args: [eoaAddress, getAddress(recipient), getAddress(tokenAddress), parsedAmount, BigInt(frequency)] }),
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
            setRecipient(''); setAmount('');
        } catch (e: any) {
            console.error("Failed to create subscription:", e);
            setStatus({ type: 'error', message: e.shortMessage || 'An error occurred.' });
        }
    };

    const selectedToken = supportedTokens.find(t => t.address.toLowerCase() === tokenAddress.toLowerCase());

    return (
        <div className="space-y-6">
            <StatusDisplay status={status} />
            
            <div className="space-y-4">
                {/* Recipient Address */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Recipient Address
                    </label>
                    <input 
                        type="text" 
                        placeholder="0x..." 
                        value={recipient} 
                        onChange={e => setRecipient(e.target.value)} 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors placeholder:text-gray-400 text-gray-900"
                    />
                </div>

                {/* Token Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Token
                    </label>
                    {isCustomToken ? (
                        <input
                            type="text"
                            placeholder="Paste Token Address (0x...)"
                            value={tokenAddress}
                            onChange={e => setTokenAddress(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors placeholder:text-gray-400 text-gray-900"
                        />
                    ) : (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                type="button"
                                onClick={() => setIsTokenDropdownOpen(!isTokenDropdownOpen)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none flex items-center justify-between text-left bg-white hover:bg-gray-50 transition-colors"
                            >
                                {selectedToken ? (
                                    <span className="flex items-center gap-3">
                                        <img src={selectedToken.logo} alt={selectedToken.symbol} className="w-6 h-6 rounded-full" />
                                        <span className="text-gray-900">{selectedToken.name} ({selectedToken.symbol})</span>
                                    </span>
                                ) : (
                                    <span className="text-gray-500">Select a token</span>
                                )}
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                            </button>

                            {isTokenDropdownOpen && (
                                <div className="absolute z-10 top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                    {supportedTokens.map(token => (
                                        <div
                                            key={token.address}
                                            onClick={() => {
                                                setTokenAddress(token.address);
                                                setIsTokenDropdownOpen(false);
                                            }}
                                            className="p-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 border-b border-gray-100 last:border-b-0"
                                        >
                                            <img src={token.logo} alt={token.symbol} className="w-6 h-6 rounded-full" />
                                            <span className="text-gray-900">{token.name} ({token.symbol})</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                    <button 
                        onClick={() => {
                            setIsCustomToken(!isCustomToken);
                            if (!isCustomToken === false) {
                                setTokenAddress(supportedTokens[0].address);
                            } else {
                                setTokenAddress("");
                            }
                        }} 
                        className="text-sm text-blue-600 hover:text-blue-700 mt-2 text-left transition-colors"
                    >
                        {isCustomToken ? "Select from list" : "Token not listed? Use address"}
                    </button>
                </div>

                {/* Amount and Frequency */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Amount
                        </label>
                        <input 
                            type="text" 
                            placeholder="15.0" 
                            value={amount} 
                            onChange={e => setAmount(e.target.value)} 
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors placeholder:text-gray-400 text-gray-900"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Frequency
                        </label>
                        <select 
                            value={frequency} 
                            onChange={e => setFrequency(e.target.value)} 
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white text-gray-900"
                        >
                            <option value={120} className="text-gray-900">2 Minutes (for testing)</option>
                            <option value={2592000} className="text-gray-900">Monthly</option>
                            <option value={31536000} className="text-gray-900">Yearly</option>
                        </select>
                    </div>
                </div>
            </div>

            <button 
                onClick={handleCreate} 
                disabled={status.type === 'loading'} 
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed"
            >
                {status.type === 'loading' ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Creating...
                    </>
                ) : (
                    <>
                        <Plus className="w-4 h-4" />
                        Create Subscription
                    </>
                )}
            </button>
        </div>
    );
};

export default CreateSubscriptionPanel;