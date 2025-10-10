import 'dotenv/config';
import { createPublicClient, http, encodeFunctionData, Address, defineChain } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { createPimlicoClient } from 'permissionless/clients/pimlico';
import { toMetaMaskSmartAccount, Implementation, createExecution, ExecutionMode, Delegation, getDeleGatorEnvironment } from '@metamask/delegation-toolkit';
import { DelegationManager } from '@metamask/delegation-toolkit/contracts';
import { subscriptionManagerAddress, subscriptionManagerAbi } from './contracts.js';

// --- Monad Testnet Chain Definition ---
export const monadTestnet = defineChain({
    id: 10143,
    name: 'Monad Testnet',
    nativeCurrency: { name: 'Monad', symbol: 'MONAD', decimals: 18 },
    rpcUrls: { default: { http: ['https://testnet-rpc.monad.xyz'] } },
    blockExplorers: { default: { name: 'Monad Explorer', url: 'https://explorer.testnet.monad.xyz' } },
});

// --- Environment Variable Loading & Validation ---
const AGENT_PRIVATE_KEY = process.env.AGENT_PRIVATE_KEY as `0x${string}` | undefined;
const BUNDLER_RPC_URL = process.env.BUNDLER_RPC_URL;
const NODE_RPC_URL = process.env.NODE_RPC_URL;
const INDEXER_URL = process.env.INDEXER_URL;

if (!AGENT_PRIVATE_KEY || !/^0x[a-fA-F0-9]{64}$/.test(AGENT_PRIVATE_KEY)) {
    throw new Error("Invalid or missing AGENT_PRIVATE_KEY in .env file.");
}
if (!BUNDLER_RPC_URL || !NODE_RPC_URL || !INDEXER_URL) {
    throw new Error("Missing RPC or Indexer URL environment variables.");
}

// --- Client & Account Setup ---
const publicClient = createPublicClient({ chain: monadTestnet, transport: http(NODE_RPC_URL) });
const bundlerClient = createPimlicoClient({ transport: http(BUNDLER_RPC_URL) });
const agentAccount = privateKeyToAccount(AGENT_PRIVATE_KEY);
let agentSmartAccount: any;
let chainEnvironment: any;

console.log(`🤖 Agent EOA started. Public address: ${agentAccount.address}`);
console.log(`👁️ Watching contract: ${subscriptionManagerAddress}`);

type SignedDelegation = Delegation & { signature: `0x${string}` };

interface Subscription {
    id: string;
    owner: Address;
    subscriber: Address;
    frequency: string;
    lastPaymentTimestamp: string;
}

interface GqlResponse { data?: { Subscription?: Subscription[] } }

// --- Agent Logic ---

async function fetchDueSubscriptions(): Promise<Subscription[]> {
    const graphqlQuery = { query: `query GetActiveSubscriptions { Subscription(where: { isActive: { _eq: true } }) { id owner subscriber frequency lastPaymentTimestamp } }` };
    try {
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        const response = await fetch(INDEXER_URL!, { method: 'POST', headers, body: JSON.stringify(graphqlQuery) });
        const data: GqlResponse = await response.json();
        const allSubs = data?.data?.Subscription ?? [];
        if (allSubs.length === 0) return [];
        const now = BigInt(Math.floor(Date.now() / 1000));
        return allSubs.filter(sub => now >= BigInt(sub.lastPaymentTimestamp) + BigInt(sub.frequency));
    } catch (error) {
        console.error("❌ Error fetching from indexer:", error);
        return [];
    }
}

const delegationDatabase = new Map<string, SignedDelegation>();

function getSignedDelegationForUser(userSmartAccountAddress: Address): SignedDelegation | null {
    console.log(`🔍 (DEMO) Looking for delegation for ${userSmartAccountAddress} in mock database...`);
    
    // 👇 --- PASTED DELEGATION OBJECT ---
    const pastedObject = {
        "delegate": "0x786EAD89AF3DA620Fca3820288cF22adFf039C72",
        "delegator": "0x12D3392596FC8B235A3dc670F12d67250cF3D7A3",
        "authority": "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
        "caveats": [
            {
                "enforcer": "0x7F20f61b1f09b08D970938F6fa563634d65c4EeB",
                "terms": "0x49A341568e5447719c66d135B24bECaCae3feCc5",
                "args": "0x"
            },
            {
                "enforcer": "0x2c21fD0Cb9DC8445CB3fb0DC5E7Bb0Aca01842B5",
                "terms": "0x162a0cf8",
                "args": "0x"
            }
        ],
        "salt": "0x",
        "signature": "0x6de77d1539aeabb5ece7c3dd2ea1c369a5c7ba74720273350e91707c08d8905235e404f4b75a7adab4137d110ea4f89cee2fa002a52a74d6390226044f4248581b"
    };

    const properlyTypedDelegation: SignedDelegation = {
        delegate: pastedObject.delegate as Address,
        delegator: pastedObject.delegator as Address,
        authority: pastedObject.authority as `0x${string}`,
        caveats: pastedObject.caveats.map(c => ({ 
            ...c, 
            enforcer: c.enforcer as Address, 
            terms: c.terms as `0x${string}`, 
            args: c.args as `0x${string}` 
        })),
        salt: pastedObject.salt as `0x${string}`,
        signature: pastedObject.signature as `0x${string}`,
    };

    delegationDatabase.set(pastedObject.delegator.toLowerCase(), properlyTypedDelegation);
    
    return delegationDatabase.get(userSmartAccountAddress.toLowerCase()) || null;
}


async function processSubscriptions(dueSubscriptions: Subscription[]) {
    const subsByOwner = dueSubscriptions.reduce((acc, sub) => {
        if (!acc[sub.owner]) acc[sub.owner] = [];
        acc[sub.owner].push(sub);
        return acc;
    }, {} as Record<Address, Subscription[]>);

    for (const ownerEoa of Object.keys(subsByOwner) as Address[]) {
        const userSubs = subsByOwner[ownerEoa];
        const userSmartAccountAddress = userSubs[0].subscriber;

        console.log(`\n👤 Processing ${userSubs.length} payment(s) for user SA ${userSmartAccountAddress}...`);

        try {
            const signedDelegation = getSignedDelegationForUser(userSmartAccountAddress);
            if (!signedDelegation) {
                console.warn(`⚠️ No valid delegation found for ${userSmartAccountAddress}. Make sure it's pasted in the 'delegationDatabase'. Skipping.`);
                continue;
            }

            if (signedDelegation.delegate.toLowerCase() !== agentSmartAccount.address.toLowerCase()) {
                console.error(`❌ CRITICAL ERROR: Delegation is for the wrong agent!`);
                console.error(`   Delegation is for: ${signedDelegation.delegate}`);
                console.error(`   This agent is:     ${agentSmartAccount.address}`);
                console.error(`   Please update AGENT_SMART_ACCOUNT_ADDRESS in useAutoPay.ts and re-authorize.`);
                continue;
            }
            console.log(`✅ Found valid delegation for the correct agent.`);

            const executions = userSubs.map(sub => createExecution({
                target: subscriptionManagerAddress,
                callData: encodeFunctionData({
                    abi: subscriptionManagerAbi,
                    functionName: 'executePayment',
                    args: [BigInt(sub.id)],
                }),
            }));

            const redeemDelegationCalldata = DelegationManager.encode.redeemDelegations({
                delegations: [[signedDelegation]],
                modes: [ExecutionMode.SingleDefault],
                executions: [executions],
            });
            
            console.log(`📦 Bundling 'redeemDelegations' call into a UserOperation.`);
            
            const gasPrices = await bundlerClient.getUserOperationGasPrice();
            const delegationManagerAddress = chainEnvironment.DelegationManager;

            const userOpHash = await bundlerClient.sendUserOperation({
                account: agentSmartAccount,
                calls: [{
                    to: delegationManagerAddress,
                    data: redeemDelegationCalldata,
                }],
                maxFeePerGas: gasPrices.fast.maxFeePerGas,
                maxPriorityFeePerGas: gasPrices.fast.maxPriorityFeePerGas,
            });

            console.log(`✅ UserOperation to redeem delegation sent! Hash: ${userOpHash}`);
            console.log(`⏳ Waiting for receipt...`);
            
            const receipt = await bundlerClient.waitForUserOperationReceipt({ hash: userOpHash });
            console.log(`🎉 Payment successful for user ${userSmartAccountAddress}! Tx: ${receipt.receipt.transactionHash}`);

        } catch (error) {
            console.error(`❌ Failed to process payment for owner ${ownerEoa}:`, error);
        }
    }
}

async function initialize() {
    if (!agentSmartAccount) {
        try {
            chainEnvironment = getDeleGatorEnvironment(monadTestnet.id);
        } catch (error) {
            console.error(`❌ Failed to get environment for chain ${monadTestnet.id}:`, error);
            throw error;
        }
        
        console.log(`🌍 Chain environment loaded.`);
        
        if (!chainEnvironment || !chainEnvironment.DelegationManager) {
            throw new Error(`Delegation contracts not properly configured for Monad Testnet (chain ${monadTestnet.id})`);
        }
        
        console.log(`✅ DelegationManager: ${chainEnvironment.DelegationManager}`);
        
        agentSmartAccount = await toMetaMaskSmartAccount({
            client: publicClient,
            implementation: Implementation.Hybrid,
            deployParams: [agentAccount.address, [], [], []],
            deploySalt: "0x",
            signer: { account: agentAccount },
            environment: chainEnvironment,
        });
        console.log(`\n\n🔑 Agent's own Smart Account address: ${agentSmartAccount.address}`);
        console.log("   👆 COPY THIS and paste it into AGENT_SMART_ACCOUNT_ADDRESS in useAutoPay.ts\n\n");
    }
}

async function main() {
    await initialize();
    console.log("\n----------------------------------------");
    console.log(`[${new Date().toLocaleTimeString()}] Checking for due payments...`);
    const dueSubscriptions = await fetchDueSubscriptions();
    if (dueSubscriptions.length > 0) {
        console.log(`🔥 Found ${dueSubscriptions.length} due subscription(s).`);
        await processSubscriptions(dueSubscriptions);
    } else {
        console.log("💧 No payments due at this time.");
    }
}

initialize().then(() => {
    setInterval(main, 15000);
    main();
}).catch(error => {
    console.error("Agent failed to initialize:", error);
});

