import React, { useState, useEffect, useRef } from 'react';
import { useAccount } from 'wagmi';
import { useSmartAccount } from '../../hooks/useSmartAccount';
import { encodeFunctionData, isAddress, parseEther, getAddress, maxUint256 } from 'viem';
import { subscriptionManagerAddress, subscriptionManagerAbi } from '../../lib/contracts/contracts';
import { erc20Abi } from '../../lib/abis/erc20Abi';
import { supportedTokens } from '../../lib/tokens';
import { ChevronDown, Plus, Loader2 } from 'lucide-react';

// Import the new modal component
import StatusModal from '../shared/StatusModal'; // 👈 Adjust the import path as needed

const CreateSubscriptionPanel: React.FC = () => {
    const { address: eoaAddress } = useAccount();
    const { smartAccount, pimlicoClient, smartClient, publicClient } = useSmartAccount();
    const [recipient, setRecipient] = useState('');
    const [tokenAddress, setTokenAddress] = useState(supportedTokens[0].address);
    const [amount, setAmount] = useState('');
    const [frequency, setFrequency] = useState('120'); // 2 minutes for testing
    const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error', message: string }>({ type: 'idle', message: '' });
    
    // New state to control modal visibility
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [isTokenDropdownOpen, setIsTokenDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
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

    const resetForm = () => {
        setRecipient('');
        setAmount('');
    };

const handleCreate = async () => {
    if (!smartAccount || !pimlicoClient || !smartClient || !eoaAddress || !publicClient) {
        setStatus({ type: 'error', message: 'Wallet not fully connected.' });
        setIsModalOpen(true);
        return;
    }
    if (!isAddress(recipient) || !isAddress(tokenAddress) || !amount) {
        setStatus({ type: 'error', message: 'Please fill all fields with valid information.' });
        setIsModalOpen(true);
        return;
    }

    setIsModalOpen(true);
    setStatus({ type: 'loading', message: 'Preparing your subscription...' });

    try {
        const parsedAmount = parseEther(amount as `${number}`);
        
        const currentAllowance = await publicClient.readContract({
            address: getAddress(tokenAddress),
            abi: erc20Abi,
            functionName: 'allowance',
            args: [smartAccount.address, subscriptionManagerAddress],
        });

        const calls = [];

        if (currentAllowance < parsedAmount) {
            calls.push({
                to: getAddress(tokenAddress),
                data: encodeFunctionData({ abi: erc20Abi, functionName: 'approve', args: [subscriptionManagerAddress, maxUint256] }),
                value: 0n,
            });
        }

        calls.push({
            to: subscriptionManagerAddress,
            data: encodeFunctionData({ abi: subscriptionManagerAbi, functionName: 'createSubscription', args: [eoaAddress, getAddress(recipient), getAddress(tokenAddress), parsedAmount, BigInt(frequency)] }),
            value: 0n,
        });

        const fee = await pimlicoClient.getUserOperationGasPrice();

        // =========================================================
        // ✅ THIS IS THE FIX
        // =========================================================
        // The old, multi-step process is replaced by a single, direct call.
        // You no longer need to prepare a `request` object.
        const opHash = await smartClient.sendUserOperation({
            calls, // Pass the 'calls' array directly
            maxFeePerGas: fee.fast.maxFeePerGas,
            maxPriorityFeePerGas: fee.fast.maxPriorityFeePerGas,
        });
        // =========================================================

        setStatus({ type: 'loading', message: `Transaction sent. Awaiting confirmation...` });

        const { receipt } = await pimlicoClient.waitForUserOperationReceipt({ hash: opHash });

        setStatus({ type: 'success', message: `Subscription created successfully! TX: ${receipt.transactionHash}` });
        resetForm();
    } catch (e: any) {
        console.error("Failed to create subscription:", e);
        setStatus({ type: 'error', message: e.shortMessage || 'An unexpected error occurred.' });
    }
};
    // Handler to close the modal
    const handleModalClose = () => {
        setIsModalOpen(false);
        // Delay resetting status to allow for exit animation
        setTimeout(() => setStatus({ type: 'idle', message: '' }), 300);
    };

    const selectedToken = supportedTokens.find(t => t.address.toLowerCase() === tokenAddress.toLowerCase());

    return (
        <>
            {/* Render the modal here */}
            <StatusModal
                isOpen={isModalOpen}
                status={status}
                onClose={handleModalClose}
            />
            
            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6 h-full">
                <h3 className="text-lg font-bold text-black">Create New Subscription</h3>
                
                {/* The old StatusDisplay component is now removed */}
                {/* <StatusDisplay status={status} /> */}

                <div className="space-y-4 text-black">
                    {/* ... (rest of your form inputs remain unchanged) ... */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Address</label>
                        <input type="text" placeholder="0x..." value={recipient} onChange={e => setRecipient(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-green-500 focus:border-green-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Token</label>
                        {isCustomToken ? (
                            <input type="text" placeholder="Paste Token Address (0x...)" value={tokenAddress} onChange={e => setTokenAddress(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-green-500 focus:border-green-500" />
                        ) : (
                            <div className="relative" ref={dropdownRef}>
                                <button type="button" onClick={() => setIsTokenDropdownOpen(!isTokenDropdownOpen)} className="w-full px-3 py-2 border border-gray-300 rounded-md flex items-center justify-between text-left bg-white">
                                    {selectedToken ? (
                                        <span className="flex items-center gap-2"><img src={selectedToken.logo} alt="" className="w-5 h-5" /> {selectedToken.symbol}</span>
                                    ) : (<span>Select Token</span>)}
                                    <ChevronDown className="w-4 h-4 text-gray-400" />
                                </button>
                                {isTokenDropdownOpen && (
                                    <div className="absolute z-10 top-full mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                                        {supportedTokens.map(token => (
                                            <div key={token.address} onClick={() => { setTokenAddress(token.address); setIsTokenDropdownOpen(false); }} className="p-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2">
                                                <img src={token.logo} alt="" className="w-5 h-5" /> {token.name} ({token.symbol})
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                        <button onClick={() => { setIsCustomToken(!isCustomToken); setTokenAddress(isCustomToken ? supportedTokens[0].address : ""); }} className="text-xs text-green-600 hover:underline mt-1">{isCustomToken ? "Select from list" : "Or use custom address"}</button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                            <input type="text" placeholder="15.0" value={amount} onChange={e => setAmount(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-green-500 focus:border-green-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                            <select value={frequency} onChange={e => setFrequency(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-green-500 focus:border-green-500 bg-white">
                                <option value={120}>2 Mins (Test)</option>
                                <option value={2592000}>Monthly</option>
                                <option value={31536000}>Yearly</option>
                            </select>
                        </div>
                    </div>
                </div>
                <button onClick={handleCreate} disabled={isModalOpen && status.type === 'loading'} className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-md font-semibold transition-colors flex items-center justify-center gap-2">
                    {status.type === 'loading' && isModalOpen ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : <><Plus className="w-4 h-4" /> Create Subscription</>}
                </button>
            </div>
        </>
    );
};

export default CreateSubscriptionPanel;