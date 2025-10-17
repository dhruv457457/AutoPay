import { isAddress } from 'viem';
import type { Subscription } from '../hooks/useAutoPay'; // Assuming Subscription type is exported from useAutoPay

const INDEXER_URL = import.meta.env.VITE_INDEXER_URL as string;

export const fetchSubscriptionsForUser = async (address: string): Promise<Subscription[]> => {
    if (!isAddress(address)) return [];
    const query = {
        query: `
            query GetUserSubscriptions($subscriber: String!) {
                Subscription(where: { subscriber: { _eq: $subscriber } }, order_by: { id: desc }) {
                    id
                    owner
                    recipient
                    token
                    amount
                    frequency
                    lastPaymentTimestamp
                    isActive
                }
            }
        `,
        variables: { subscriber: address.toLowerCase() },
    };
    try {
        const response = await fetch(INDEXER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json',
          
            },
            body: JSON.stringify(query),
        });
        const result = await response.json();
        return result?.data?.Subscription ?? [];
    } catch (error) {
        console.error("Failed to fetch subscriptions:", error);
        return [];
    }
};