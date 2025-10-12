import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { createPublicClient, http, encodeFunctionData, Address, defineChain } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { createPimlicoClient } from 'permissionless/clients/pimlico';
import { toMetaMaskSmartAccount, Implementation, createExecution, ExecutionMode, Delegation, getDeleGatorEnvironment } from '@metamask/delegation-toolkit';
import { DelegationManager } from '@metamask/delegation-toolkit/contracts';
import { subscriptionManagerAddress, subscriptionManagerAbi } from './contracts.js';
import { Server } from 'http';

// ============================================
// CONFIGURATION
// ============================================

export const monadTestnet = defineChain({
    id: 10143,
    name: 'Monad Testnet',
    nativeCurrency: { name: 'Monad', symbol: 'MONAD', decimals: 18 },
    rpcUrls: { default: { http: ['https://testnet-rpc.monad.xyz'] } },
    blockExplorers: { default: { name: 'Monad Explorer', url: 'https://explorer.testnet.monad.xyz' } },
});

const AGENT_PRIVATE_KEY = process.env.AGENT_PRIVATE_KEY as `0x${string}` | undefined;
const BUNDLER_RPC_URL = process.env.BUNDLER_RPC_URL;
const NODE_RPC_URL = process.env.NODE_RPC_URL;
const INDEXER_URL = process.env.INDEXER_URL;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/autopay-agent';
const PORT = process.env.PORT || '3001';
const HOST = process.env.HOST || '0.0.0.0'; // Listen on all network interfaces for deployment

if (!AGENT_PRIVATE_KEY || !/^0x[a-fA-F0-9]{64}$/.test(AGENT_PRIVATE_KEY)) {
    throw new Error("Invalid or missing AGENT_PRIVATE_KEY in .env file.");
}
if (!BUNDLER_RPC_URL || !NODE_RPC_URL || !INDEXER_URL) {
    throw new Error("Missing RPC or Indexer URL environment variables.");
}

// ============================================
// TYPES
// ============================================

type SignedDelegation = Delegation & { signature: `0x${string}` };

interface Subscription {
    id: string;
    owner: Address;
    subscriber: Address;
    frequency: string;
    lastPaymentTimestamp: string;
}

interface GqlResponse { 
    data?: { Subscription?: Subscription[] } 
}

interface SignedDelegationDoc extends Delegation {
    signature: `0x${string}`;
    userSmartAccountAddress: string;
}

// ============================================
// MONGODB SETUP
// ============================================

const signedDelegationSchema = new mongoose.Schema<SignedDelegationDoc>({
    userSmartAccountAddress: { type: String, required: true, unique: true, lowercase: true, index: true },
    delegate: { type: String, required: true },
    delegator: { type: String, required: true },
    authority: { type: String, required: true },
    caveats: [{
        enforcer: { type: String, required: true },
        terms: { type: String, required: true },
        args: { type: String, required: true }
    }],
    salt: { type: String, required: true },
    signature: { type: String, required: true }
}, { 
    timestamps: true 
});

const DelegationModel = mongoose.model<SignedDelegationDoc>('SignedDelegation', signedDelegationSchema);

// ============================================
// BLOCKCHAIN CLIENTS
// ============================================

const publicClient = createPublicClient({ chain: monadTestnet, transport: http(NODE_RPC_URL) });
const bundlerClient = createPimlicoClient({ transport: http(BUNDLER_RPC_URL) });
const agentAccount = privateKeyToAccount(AGENT_PRIVATE_KEY);

let agentSmartAccount: any;
let chainEnvironment: any;
let isAgentReady = false;

console.log(`🤖 Agent EOA started. Public address: ${agentAccount.address}`);
console.log(`👁️ Watching contract: ${subscriptionManagerAddress}`);

// ============================================
// EXPRESS SERVER & API ROUTES
// ============================================

const app = express();
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        agentAddress: agentSmartAccount?.address || 'initializing',
        agentReady: isAgentReady,
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// POST: Store delegation
app.post('/api/delegations', async (req, res) => {
    try {
        const { userSmartAccountAddress, signedDelegation } = req.body;
        
        if (!userSmartAccountAddress || !signedDelegation) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        if (!/^0x[a-fA-F0-9]{40}$/.test(userSmartAccountAddress)) {
            return res.status(400).json({ error: 'Invalid smart account address format' });
        }

        await DelegationModel.findOneAndUpdate(
            { userSmartAccountAddress: userSmartAccountAddress.toLowerCase() },
            {
                userSmartAccountAddress: userSmartAccountAddress.toLowerCase(),
                ...signedDelegation
            },
            { upsert: true, new: true }
        );

        console.log(`✅ Delegation saved for ${userSmartAccountAddress}`);
        res.json({ success: true, message: 'Delegation stored successfully' });
    } catch (error: any) {
        console.error('Error storing delegation:', error);
        res.status(500).json({ error: 'Failed to store delegation', details: error.message });
    }
});

// GET: Retrieve delegation by address
app.get('/api/delegations/:address', async (req, res) => {
    try {
        const { address } = req.params;
        
        if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
            return res.status(400).json({ error: 'Invalid address format' });
        }

        const delegation = await DelegationModel.findOne({ 
            userSmartAccountAddress: address.toLowerCase() 
        });

        if (!delegation) {
            return res.status(404).json({ error: 'Delegation not found' });
        }

        res.json(delegation);
    } catch (error: any) {
        console.error('Error fetching delegation:', error);
        res.status(500).json({ error: 'Failed to fetch delegation', details: error.message });
    }
});

// GET: Retrieve all delegations
app.get('/api/delegations', async (req, res) => {
    try {
        const delegations = await DelegationModel.find().sort({ createdAt: -1 });
        res.json({ 
            count: delegations.length,
            delegations 
        });
    } catch (error: any) {
        console.error('Error fetching delegations:', error);
        res.status(500).json({ error: 'Failed to fetch delegations', details: error.message });
    }
});

// DELETE: Remove delegation
app.delete('/api/delegations/:address', async (req, res) => {
    try {
        const { address } = req.params;
        
        if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
            return res.status(400).json({ error: 'Invalid address format' });
        }

        const result = await DelegationModel.findOneAndDelete({ 
            userSmartAccountAddress: address.toLowerCase() 
        });

        if (!result) {
            return res.status(404).json({ error: 'Delegation not found' });
        }

        console.log(`🗑️ Delegation deleted for ${address}`);
        res.json({ success: true, message: 'Delegation deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting delegation:', error);
        res.status(500).json({ error: 'Failed to delete delegation', details: error.message });
    }
});

// ============================================
// AGENT LOGIC
// ============================================

async function fetchDueSubscriptions(): Promise<Subscription[]> {
    const graphqlQuery = { 
        query: `query GetActiveSubscriptions { 
            Subscription(where: { isActive: { _eq: true } }) { 
                id owner subscriber frequency lastPaymentTimestamp 
            } 
        }` 
    };
    
    try {
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        
        const response = await fetch(INDEXER_URL!, { 
            method: 'POST', 
            headers, 
            body: JSON.stringify(graphqlQuery) 
        });
        
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

async function getSignedDelegationForUser(userSmartAccountAddress: Address): Promise<SignedDelegation | null> {
    console.log(`🔍 Looking for delegation for ${userSmartAccountAddress} in MongoDB...`);
    
    try {
        const doc = await DelegationModel.findOne({ 
            userSmartAccountAddress: userSmartAccountAddress.toLowerCase() 
        });
        
        if (!doc) {
            console.warn(`⚠️ No delegation found for ${userSmartAccountAddress}`);
            return null;
        }

        const delegation: SignedDelegation = {
            delegate: doc.delegate as Address,
            delegator: doc.delegator as Address,
            authority: doc.authority as `0x${string}`,
            caveats: doc.caveats.map((c: any) => ({
                enforcer: c.enforcer as Address,
                terms: c.terms as `0x${string}`,
                args: c.args as `0x${string}`
            })),
            salt: doc.salt as `0x${string}`,
            signature: doc.signature as `0x${string}`
        };

        console.log(`✅ Found delegation from database`);
        return delegation;
    } catch (error) {
        console.error('❌ Error fetching delegation from MongoDB:', error);
        return null;
    }
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
            const signedDelegation = await getSignedDelegationForUser(userSmartAccountAddress);
            
            if (!signedDelegation) {
                console.warn(`⚠️ No valid delegation found for ${userSmartAccountAddress}. User needs to authorize.`);
                continue;
            }

            if (signedDelegation.delegate.toLowerCase() !== agentSmartAccount.address.toLowerCase()) {
                console.error(`❌ CRITICAL ERROR: Delegation is for the wrong agent!`);
                console.error(`   Delegation is for: ${signedDelegation.delegate}`);
                console.error(`   This agent is:     ${agentSmartAccount.address}`);
                continue;
            }
            
            console.log(`✅ Valid delegation found for correct agent.`);

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

            console.log(`✅ UserOperation sent! Hash: ${userOpHash}`);
            console.log(`⏳ Waiting for receipt...`);
            
            const receipt = await bundlerClient.waitForUserOperationReceipt({ hash: userOpHash });
            console.log(`🎉 Payment successful for user ${userSmartAccountAddress}!`);
            console.log(`   Tx: ${receipt.receipt.transactionHash}`);

        } catch (error: any) {
            console.error(`❌ Failed to process payment for owner ${ownerEoa}:`, error.message || error);
        }
    }
}

async function initializeAgent() {
    if (agentSmartAccount) return;

    try {
        chainEnvironment = getDeleGatorEnvironment(monadTestnet.id);
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
        
        console.log(`\n🔑 Agent's Smart Account address: ${agentSmartAccount.address}`);
        console.log("   👆 COPY THIS and paste it into AGENT_SMART_ACCOUNT_ADDRESS in useAutoPay.ts\n");
        
        isAgentReady = true;
    } catch (error) {
        console.error(`❌ Failed to initialize agent:`, error);
        throw error;
    }
}

async function runAgentCycle() {
    if (!isAgentReady) {
        console.log('⏳ Agent not ready yet, skipping cycle...');
        return;
    }

    console.log("\n----------------------------------------");
    console.log(`[${new Date().toLocaleTimeString()}] Checking for due payments...`);
    
    try {
        const dueSubscriptions = await fetchDueSubscriptions();
        
        if (dueSubscriptions.length > 0) {
            console.log(`🔥 Found ${dueSubscriptions.length} due subscription(s).`);
            await processSubscriptions(dueSubscriptions);
        } else {
            console.log("💧 No payments due at this time.");
        }
    } catch (error: any) {
        console.error('❌ Error in agent cycle:', error.message || error);
    }
}

// ============================================
// STARTUP AND SHUTDOWN LOGIC
// ============================================

let server: Server;
let agentInterval: NodeJS.Timeout;

async function start() {
    try {
        // 1. Connect to MongoDB
        console.log('📦 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ MongoDB connection established.');

        // 2. Start Express Server
        server = app.listen(Number(PORT), HOST, async () => {
            console.log(`\n🚀 Server running on http://localhost:${PORT}`);
            console.log('   API Endpoints are available.');

            // 3. Initialize Agent now that the server is running
            try {
                console.log('🤖 Initializing Agent...');
                await initializeAgent();
                
                // 4. Start Agent Loop if initialization was successful
                console.log('⏰ Starting agent payment monitoring (15s interval)...\n');
                agentInterval = setInterval(runAgentCycle, 15000);
                runAgentCycle(); // Run first cycle immediately
            } catch (initError) {
                console.error('❌ Agent initialization failed:', initError);
                console.log('⚠️ Server will continue running, but the agent is INACTIVE.');
            }
        });

    } catch (error) {
        console.error('❌ Failed to start the application:', error);
        process.exit(1);
    }
}

async function shutdown(signal: string) {
    console.log(`\n\n🛑 Received ${signal}. Shutting down gracefully...`);
    
    if (agentInterval) {
        clearInterval(agentInterval);
        console.log('✅ Agent timer stopped.');
    }

    server.close(async () => {
        console.log('✅ HTTP server closed.');
        await mongoose.connection.close();
        console.log('✅ MongoDB connection closed.');
        process.exit(0);
    });

    // Force shutdown after a timeout if something hangs
    setTimeout(() => {
        console.error('Could not close connections in time, forcing shutdown.');
        process.exit(1);
    }, 10000);
}

// Listen for shutdown signals
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

// Start the application
start();