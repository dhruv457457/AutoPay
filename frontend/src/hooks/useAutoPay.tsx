import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useSmartAccount } from './useSmartAccount';
import { type Address } from 'viem';
import { createDelegation, type SignedDelegation as SignedDelegationType } from '@metamask/delegation-toolkit';
import { subscriptionManagerAddress } from '../lib/contracts/contracts';

// This is the interface for your subscription data
export interface Subscription {
  id: string;
  owner: string; 
  subscriber: string;
  recipient: string;
  token: string;
  amount: string;
  frequency: string;
  lastPaymentTimestamp: string;
  isActive: boolean;
}

// A user-specific key for storing the authorization status in the browser
const DELEGATION_STORAGE_KEY_PREFIX = 'autoPaySignedDelegation_v5_'; 

export const useAutoPay = () => {
    const { address: eoaAddress, chain } = useAccount();
    const { smartAccount } = useSmartAccount();
    
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
    const [status, setStatus] = useState<string>('Inactive');
    
    // 👇 --- ACTION REQUIRED ---
    // This address MUST be the agent's SMART ACCOUNT address.
    // You get this from the log when you run `npm start` in the agent's terminal for the first time.
    const AGENT_SMART_ACCOUNT_ADDRESS = '0x786EAD89AF3DA620Fca3820288cF22adFf039C72'; // 👈 PASTE AGENT's SMART ACCOUNT ADDRESS HERE

    // This effect checks if the user has already authorized the agent
    useEffect(() => {
        if (eoaAddress) {
            const storageKey = `${DELEGATION_STORAGE_KEY_PREFIX}${eoaAddress.toLowerCase()}`;
            const savedDelegation = localStorage.getItem(storageKey);
            if (savedDelegation) {
                const parsed = JSON.parse(savedDelegation);
                // Check if the saved delegation is for the correct agent and hasn't expired
                if (BigInt(parsed.expiry) > BigInt(Math.floor(Date.now() / 1000)) && parsed.delegate.toLowerCase() === AGENT_SMART_ACCOUNT_ADDRESS.toLowerCase()) {
                    setIsAuthorized(true);
                    setStatus('Active: Agent is authorized. The backend process will now handle payments.');
                } else {
                    localStorage.removeItem(storageKey);
                    setIsAuthorized(false);
                }
            } else {
                setIsAuthorized(false);
            }
        }
    }, [eoaAddress]);

    // This function creates and signs the "permission slip"
    const authorizeAutoPay = async () => {
        if (!eoaAddress || !smartAccount || !chain) {
            setStatus('Authorization failed: Wallet not ready.');
            return;
        }
        try {
            setStatus('Creating specific delegation for the agent...');
            
            const expiry = BigInt(Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30));

            const delegation = createDelegation({
                scope: { type: "functionCall", targets: [subscriptionManagerAddress], selectors: ["executePayment(uint256)"] },
                from: smartAccount.address,
                to: AGENT_SMART_ACCOUNT_ADDRESS as Address, // Delegate to the agent's smart account
                environment: smartAccount.environment,
                expiry,
            });

            const signature = await smartAccount.signDelegation({ delegation });
            
            // Manually construct the full SignedDelegation object
            const signedDelegation: SignedDelegationType = { ...delegation, signature };
            
            console.log('✅ Successfully signed delegation object (COPY THIS for the agent):', signedDelegation);

            const storageKey = `${DELEGATION_STORAGE_KEY_PREFIX}${eoaAddress.toLowerCase()}`;
            // Store the full object, converting BigInts to strings for JSON compatibility
            localStorage.setItem(storageKey, JSON.stringify(signedDelegation, (key, value) =>
                typeof value === 'bigint' ? value.toString() : value
            ));
            
            setIsAuthorized(true);
            setStatus('Agent authorized! Please copy the delegation object from the console and paste it into your agent script.');
        } catch (e: any) {
            console.error('Authorization failed:', e);
            setStatus(`Authorization failed: ${e.message || 'User rejected.'}`);
        }
    };
  
    // This function revokes the authorization from the browser's perspective
    const revokeAuthorization = () => {
        if (!eoaAddress) return;
        const storageKey = `${DELEGATION_STORAGE_KEY_PREFIX}${eoaAddress.toLowerCase()}`;
        localStorage.removeItem(storageKey);
        setIsAuthorized(false);
        setStatus('Inactive: Authorization revoked.');
    };

    return { grant: isAuthorized, status, authorizeAutoPay, revokeAuthorization };
};

