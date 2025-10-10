import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { useSmartAccount } from './useSmartAccount';
import { type Address } from 'viem';
import { createDelegation } from '@metamask/delegation-toolkit';
import { subscriptionManagerAddress } from '../lib/contracts/contracts';

// The URL for your backend API server
const API_BASE_URL = 'http://localhost:3001'; 

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

// Define the SignedDelegation type locally since it's not exported
interface SignedDelegation {
    delegate: Address;
    delegator: Address;
    authority: Address;
    caveats: any[];
    salt: Address; // Hex string, not bigint
    signature: any;
}

// A user-specific key to simply remember if they've authorized before for a better UI experience
const AUTH_STATUS_KEY_PREFIX = 'autoPayIsAuthorized_v6_'; 

export const useAutoPay = () => {
    const { address: eoaAddress, chain } = useAccount();
    const { smartAccount } = useSmartAccount();
    
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
    const [status, setStatus] = useState<string>('Inactive');
    
    // This address MUST be the agent's SMART ACCOUNT address.
    // You get this from the log when you run `npm start` in the agent's terminal for the first time.
    // UPDATE THIS: Paste the actual agent's Smart Account address from the server console log here.
    const AGENT_SMART_ACCOUNT_ADDRESS = '0x786EAD89AF3DA620Fca3820288cF22adFf039C72'; // 👈 PASTE AGENT's SMART ACCOUNT ADDRESS HERE

    // Helper to sync authorization state with server
    const syncAuthState = useCallback(async () => {
        if (!smartAccount?.address) return;
        
        try {
            const response = await fetch(`${API_BASE_URL}/api/delegations/${smartAccount.address}`);
            const existsOnServer = response.ok;
            
            const storageKey = `${AUTH_STATUS_KEY_PREFIX}${eoaAddress?.toLowerCase()}`;
            const localValue = localStorage.getItem(storageKey);
            
            // Sync localStorage to server state
            if (existsOnServer && localValue !== 'true') {
                localStorage.setItem(storageKey, 'true');
            } else if (!existsOnServer && localValue === 'true') {
                localStorage.removeItem(storageKey);
            }
            
            setIsAuthorized(existsOnServer);
            setStatus(existsOnServer 
                ? 'Active: Agent is authorized. The backend process will now handle payments.' 
                : 'Inactive: Authorize the agent to begin.'
            );
        } catch (error) {
            console.error('Error syncing auth state:', error);
            // Fallback to localStorage
            if (eoaAddress) {
                const storageKey = `${AUTH_STATUS_KEY_PREFIX}${eoaAddress.toLowerCase()}`;
                const localAuth = localStorage.getItem(storageKey) === 'true';
                setIsAuthorized(localAuth);
                setStatus(localAuth 
                    ? 'Active: Agent is authorized (server sync failed).' 
                    : 'Inactive: Authorize the agent to begin.'
                );
            }
        }
    }, [eoaAddress, smartAccount?.address]);

    // This effect checks server state for authorization (synced with localStorage)
    useEffect(() => {
        if (eoaAddress && smartAccount?.address) {
            syncAuthState();
        }
    }, [eoaAddress, smartAccount?.address, syncAuthState]);

    // This function creates the "permission slip" and sends it to the backend.
    const authorizeAutoPay = async () => {
        if (!eoaAddress || !smartAccount || !chain) {
            setStatus('Authorization failed: Wallet not ready.');
            return;
        }
        try {
            setStatus('Creating specific delegation for the agent...');

            const delegation = createDelegation({
                scope: { type: "functionCall", targets: [subscriptionManagerAddress], selectors: ["executePayment(uint256)"] },
                from: smartAccount.address,
                to: AGENT_SMART_ACCOUNT_ADDRESS as Address,
                environment: smartAccount.environment,
            });

            const signature = await smartAccount.signDelegation({ delegation });
            
            const signedDelegation: SignedDelegation = { ...delegation, signature };
            
            setStatus('Sending delegation to secure server...');
            
            // This is the new logic: send the signed delegation to your API server.
            const response = await fetch(`${API_BASE_URL}/api/delegations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userSmartAccountAddress: smartAccount.address,
                    // Convert BigInts to strings for JSON transport before sending
                    signedDelegation: JSON.parse(JSON.stringify(signedDelegation, (_key, value) => typeof value === 'bigint' ? value.toString() : value))
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save delegation to server.');
            }

            // Sync state after success
            await syncAuthState();
        } catch (e: any) {
            console.error('Authorization failed:', e);
            setStatus(`Authorization failed: ${e.message || 'User rejected.'}`);
        }
    };
  
    // This function revokes the authorization from the server and localStorage
    const revokeAuthorization = async () => {
        if (!smartAccount?.address || !eoaAddress) return;
        
        try {
            setStatus('Revoking authorization...');
            const response = await fetch(`${API_BASE_URL}/api/delegations/${smartAccount.address}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to revoke delegation from server.');
            }

            // Sync state after revocation
            await syncAuthState();
        } catch (e: any) {
            console.error('Revocation failed:', e);
            setStatus(`Revocation failed: ${e.message || 'Server error.'}`);
            // Still remove local flag to avoid desync
            const storageKey = `${AUTH_STATUS_KEY_PREFIX}${eoaAddress.toLowerCase()}`;
            localStorage.removeItem(storageKey);
            setIsAuthorized(false);
        }
    };

    return { grant: isAuthorized, status, authorizeAutoPay, revokeAuthorization };
};