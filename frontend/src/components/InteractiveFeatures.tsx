import React from 'react';
import { Wallet, BarChart3, ShieldCheck, Zap, Database } from 'lucide-react';

// --- Visual Components for the New Feature Cards ---

const MetaMaskVisual = () => (
    <div className="bg-white p-6 rounded-lg mt-6 text-center ">
        <img 
            src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" 
            alt="MetaMask Logo" 
            className="h-40 w-40 mx-auto mb-4"
        />
    </div>
);


const SecurityVisual = () => (
    <div className="bg-white p-6 rounded-lg mt-6 text-center ">
        <span className="font-semibold text-gray-800">Your EOA Wallet (Controller)</span>
        <div className="text-2xl my-2 text-gray-400">↓</div>
        <div className="bg-green-50 text-green-800 font-semibold p-3 rounded-md border border-green-200">
            AutoPay Smart Account (Handles Payments)
        </div>
        <p className="text-sm text-gray-500 mt-3">
            Your main wallet is safe. It only delegates specific permissions to the smart account for payments.
        </p>
    </div>
);

const AnalyticsVisual = () => (
     <div className="bg-gray-50 p-10 rounded-lg mt-6 ">
        <img 
            src="https://i.ibb.co/xKQ3kQKL/On-chain.png" 
            alt="Analytics Graph" 
            className="w-full h-auto rounded " 
        />
    </div>
);

const MonadVisual = () => (
    <div className="bg-white p-6 rounded-lg mt-6 text-center ">
        <svg className="w-40 h-40 mx-auto mb-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path fill="#836EF9" d="M12 3c-2.599 0-9 6.4-9 9s6.401 9 9 9s9-6.401 9-9s-6.401-9-9-9m-1.402 14.146c-1.097-.298-4.043-5.453-3.744-6.549s5.453-4.042 6.549-3.743c1.095.298 4.042 5.453 3.743 6.549c-.298 1.095-5.453 4.042-6.549 3.743"/>
        </svg>
        <h4 className="font-semibold text-gray-800">High-Performance L1</h4>
        
    </div>
);

const EnvioVisual = () => (
     <div className="bg-white p-6 rounded-lg mt-6 text-center ">
        <img 
            src="https://docs.envio.dev/img/envio-logo.png" 
            alt="Envio Logo" 
            className="h-32 w-auto mx-auto mb-4"
        />
        <h4 className="font-semibold text-gray-800">Real-Time Data Indexing</h4>
    </div>
);


const newFeatures = [
  {
    icon: <Wallet className="w-5 h-5" />,
    smallTitle: "MetaMask Smart Accounts",
    mainTitle: "Seamless user onboarding.",
    description: "Utilize the power of MetaMask's smart accounts for enhanced security, gas sponsorship, and advanced permissions.",
    visual: <MetaMaskVisual />
  },
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    smallTitle: "Non-Custodial Security",
    mainTitle: "Security is paramount.",
    description: "Payments are executed from a secure, non-custodial smart account that you control. Your main wallet's assets are never at risk.",
    visual: <SecurityVisual />
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    smallTitle: "On-Chain Analytics",
    mainTitle: "Real-time revenue tracking.",
    description: "Monitor and analyze all subscription payments and revenue streams through our indexed, real-time analytics dashboard.",
    visual: <AnalyticsVisual />
  },
  {
    icon: <Zap className="w-5 h-5" />,
    smallTitle: "Built on Monad",
    mainTitle: "High-performance blockchain.",
    description: "Experience the speed and low costs of the Monad network, a high-performance L1 designed for scalability.",
    visual: <MonadVisual />
  },
  {
    icon: <Database className="w-5 h-5" />,
    smallTitle: "Indexed by Envio",
    mainTitle: "Lightning-fast data access.",
    description: "All subscription and payment data is indexed by Envio, providing instant and reliable data for our dashboard.",
    visual: <EnvioVisual />
  }
];

const InteractiveFeatures: React.FC = () => {
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section 1: Onboarding and Engagement (Existing) */}
        <div className="mb-24">
            <p className="text-base font-semibold text-green-700 mb-2">ON-CHAIN AUTOMATION</p>
            <h2 className="text-4xl font-bold text-gray-900 mb-12">
                Streamline your Web3 revenue <br /> and treasury operations
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 ">
                <div className='border border-gray-200 p-8'>
                    <div className=" p-6 bg-gray-50 mb-8">
                        <img src="https://i.ibb.co/Lzfy02SC/Gemini-Generated-Image-qtmw4qqtmw4qqtmw.png" alt="Create On-Chain Subscriptions" className="w-full h-auto" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Create On-Chain Subscriptions</h3>
                    <p className="text-lg text-gray-600 mb-6">Define recurring payment plans directly on-chain. Set any ERC-20 token, amount, and frequency to accept subscriptions for your dApp, service, or DAO.</p>
                    <a href="#" className="text-green-700 font-semibold hover:underline">Explore Subscription Models</a>
                </div>
                    <div className='border border-gray-200 p-8'>
                        <div className="p-6 bg-gray-50 mb-8">
                            <img src="https://i.ibb.co/CsV2JB09/gasless.png" alt="Gasless User Onboarding" className="w-full h-auto rounded-lg shadow-md" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Gasless User Onboarding</h3>
                        <p className="text-lg text-gray-600 mb-6">Remove friction for your users. With smart accounts, you can sponsor gas fees, allowing customers to set up their first subscription without needing native tokens.</p>
                        <a href="#" className="text-green-700 font-semibold hover:underline">Learn about Smart Accounts</a>
                    </div>
            </div>
        </div>

        
        {/* --- NEW SECTION --- */}
        <div className="mt-24">
            <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Card 1 & 2 */}
                {newFeatures.slice(0, 2).map((feature) => (
                    <div key={feature.mainTitle} className=" border border-gray-200 p-8">
                        <div className="flex items-center gap-3 text-green-700 font-semibold text-sm">
                            {feature.icon}
                            <span>{feature.smallTitle}</span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mt-4">{feature.mainTitle}</h3>
                        <p className="text-lg text-gray-600 mt-2">{feature.description}</p>
                        {feature.visual}
                    </div>
                ))}
            </div>
            {/* Card 3 */}
            <div className=" border border-gray-200 p-8">
                <div className="flex items-center gap-3 text-green-700 font-semibold text-sm">
                    {newFeatures[2].icon}
                    <span>{newFeatures[2].smallTitle}</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mt-4">{newFeatures[2].mainTitle}</h3>
                <p className="text-lg text-gray-600 mt-2">{newFeatures[2].description}</p>
                {newFeatures[2].visual}
            </div>

            {/* Card 4 & 5 */}
             <div className="grid grid-cols-1 lg:grid-cols-2">
                {newFeatures.slice(3, 5).map((feature) => (
                    <div key={feature.mainTitle} className=" border border-gray-200 p-8">
                        <div className="flex items-center gap-3 text-green-700 font-semibold text-sm">
                            {feature.icon}
                            <span>{feature.smallTitle}</span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mt-4">{feature.mainTitle}</h3>
                        <p className="text-lg text-gray-600 mt-2">{feature.description}</p>
                        {feature.visual}
                    </div>
                ))}
            </div>
        </div>

      </div>
    </section>
  );
};

export default InteractiveFeatures;