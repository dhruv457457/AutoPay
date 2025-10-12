import React, { useState, useEffect, useRef } from 'react';
import { useAccount } from 'wagmi';
import { useSmartAccount } from '../../hooks/useSmartAccount';
import { encodeFunctionData, isAddress, parseEther, getAddress, maxUint256 } from 'viem';
import { subscriptionManagerAddress, subscriptionManagerAbi } from '../../lib/contracts/contracts';
import { erc20Abi } from '../../lib/abis/erc20Abi';
import StatusDisplay from '../shared/StatusDisplay';
import { supportedTokens } from '../../lib/tokens';

// A simple chevron icon for the dropdown button
const ChevronDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-400">
        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
);

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
            <h3 className="text-xl font-bold">Create New Subscription</h3>
            <StatusDisplay status={status} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="text" placeholder="Recipient Address (0x...)" value={recipient} onChange={e => setRecipient(e.target.value)} className="bg-gray-800 p-3 rounded-md focus:ring-2 focus:ring-purple-500 outline-none" />
                
                {/* NEW: Conditional rendering for the token input */}
                <div>
                    {isCustomToken ? (
                        <input
                            type="text"
                            placeholder="Paste Token Address (0x...)"
                            value={tokenAddress}
                            onChange={e => setTokenAddress(e.target.value)}
                            className="w-full bg-gray-800 p-3 rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                    ) : (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                type="button"
                                onClick={() => setIsTokenDropdownOpen(!isTokenDropdownOpen)}
                                className="w-full bg-gray-800 p-3 rounded-md focus:ring-2 focus:ring-purple-500 outline-none flex items-center justify-between text-left"
                            >
                                {selectedToken ? (
                                    <span className="flex items-center gap-3">
                                        <img src={selectedToken.logo} alt={selectedToken.symbol} className="w-6 h-6 rounded-full" />
                                        {selectedToken.name} ({selectedToken.symbol})
                                    </span>
                                ) : (
                                    <span>Select a token</span>
                                )}
                                <ChevronDownIcon />
                            </button>

                            {isTokenDropdownOpen && (
                                <div className="absolute z-10 top-full mt-2 w-full bg-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                    {supportedTokens.map(token => (
                                        <div
                                            key={token.address}
                                            onClick={() => {
                                                setTokenAddress(token.address);
                                                setIsTokenDropdownOpen(false);
                                            }}
                                            className="p-3 hover:bg-gray-600 cursor-pointer flex items-center gap-3"
                                        >
                                            <img src={token.logo} alt={token.symbol} className="w-6 h-6 rounded-full" />
                                            <span>{token.name} ({token.symbol})</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                    {/* NEW: Toggle button */}
                    <button 
                        onClick={() => {
                            setIsCustomToken(!isCustomToken);
                            // Reset to default token if switching back to dropdown
                            if (!isCustomToken === false) {
                                setTokenAddress(supportedTokens[0].address);
                            } else {
                                setTokenAddress(""); // Clear address when switching to custom
                            }
                        }} 
                        className="text-xs text-purple-400 hover:text-purple-300 mt-2 text-left"
                    >
                        {isCustomToken ? "Select from list" : "Token not listed? Use address"}
                    </button>
                </div>

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

export default CreateSubscriptionPanel;