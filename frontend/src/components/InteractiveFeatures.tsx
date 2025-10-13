// src/components/InteractiveFeatures.tsx

import React from 'react';
import { motion } from 'framer-motion';

// --- Visual Components (Updated for AutoPay theme) ---

const SmartAccountVisual = () => (
    // Re-using MetaMaskVisual's animation style as it's great
    <motion.div 
        className="w-full h-full rounded-lg flex items-center justify-center p-4 overflow-hidden"
        initial="initial" whileHover="hover"
    >
        <div className="relative w-24 h-24">
            <motion.div 
                className="absolute inset-0 border-4 border-blue-400 rounded-full shadow-lg"
                variants={{
                    initial: { scale: 1, opacity: 0.5 },
                    hover: { scale: 1.1, opacity: 1, transition: { duration: 0.5, repeat: Infinity, repeatType: "reverse" } }
                }}
            />
            <motion.div 
                className="absolute inset-2 border-4 border-blue-500 rounded-full shadow-lg"
                variants={{
                    initial: { scale: 1, opacity: 0.5 },
                    hover: { scale: 0.9, opacity: 1, transition: { duration: 0.5, repeat: Infinity, repeatType: "reverse" } }
                }}
            />
            <div className="absolute inset-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0 3.517-1.009 6.789-2.75 9.566-1.74 2.777-2.5 5.434-2.5 5.434H12m1-11a5 5 0 00-5 5v3a5 5 0 005 5h1a5 5 0 005-5v-3a5 5 0 00-5-5h-1z" />
                </svg>
            </div>
        </div>
    </motion.div>
);

const PerformanceVisual = () => (
    // Re-using MonadVisual as "10,000 TPS" is a great stat
    <motion.div 
        className="w-full h-full rounded-lg flex flex-col justify-center items-center p-4 overflow-hidden"
        initial="initial" whileHover="hover"
    >
        <div className="relative w-full h-full flex items-center justify-center">
            {[...Array(5)].map((_, i) => (
                <motion.div 
                    key={i} className="absolute w-2 h-2 bg-blue-500 rounded-full shadow-lg"
                    variants={{ initial: { scale: 1, opacity: 0 }, hover: { scale: 1.5, opacity: 1 } }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }}
                />
            ))}
        </div>
        <p className="font-mono text-blue-600 text-sm mt-2 font-semibold">10,000 TPS</p>
    </motion.div>
);

const IndexingVisual = () => (
    // Re-using EnvioVisual for the "real-time API" concept
    <motion.div 
        className="w-full h-full rounded-lg flex flex-col p-4 justify-between"
        initial="initial" whileHover="hover"
    >
        <div className="font-mono text-xs text-gray-600">{"// Fetch payment history"}</div>
        <div className="space-y-3">
            <motion.div variants={{ initial: { width: '75%' }, hover: { width: '90%' } }} className="h-3 bg-blue-200 rounded-full" />
            <motion.div variants={{ initial: { width: '50%' }, hover: { width: '70%' } }} className="h-3 bg-blue-200 rounded-full" />
            <motion.div variants={{ initial: { width: '66%' }, hover: { width: '80%' } }} className="h-3 bg-blue-200 rounded-full" />
        </div>
        <div className="font-mono text-xs text-blue-600 font-semibold self-end">=&gt; Instant Notifications</div>
    </motion.div>
);

const PaymentAgentVisual = () => (
    // Re-using MonitoringVisual for the "automation" concept
    <div className="w-full h-full rounded-lg flex items-center justify-center p-4">
        <div className="w-28 h-28 border-4 border-blue-400 rounded-full flex items-center justify-center relative shadow-lg">
            <motion.div 
                className="absolute h-full w-1 bg-blue-500 rounded-full origin-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                     <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
        </div>
    </div>
);

const SpendingLimitsVisual = () => (
    // A new visual for setting limits
    <motion.div className="w-full h-full flex flex-col justify-center items-center p-4" initial="initial" whileHover="hover">
      <div className="w-full max-w-[150px] space-y-3">
        <div className="flex justify-between text-xs font-mono text-gray-500">
          <span>$0</span>
          <span>$1000</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full">
          <motion.div 
            className="h-2 bg-blue-500 rounded-full" 
            variants={{ initial: { width: '30%' }, hover: { width: '60%' }}}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="text-center text-blue-600 font-semibold text-sm">Monthly Allowance</p>
      </div>
    </motion.div>
);

const FlexibleSchedulingVisual = () => (
    // Re-using BatchRevokeVisual to show scheduling multiple items
    <motion.div className="w-full h-full flex items-center justify-center p-4 space-x-2" initial="initial" whileHover="hover">
        {[...Array(3)].map((_, i) => (
             <motion.div 
                key={i}
                className="w-10 h-10 border-2 border-blue-300 rounded-lg bg-blue-50 flex flex-col items-center justify-center shadow-md p-1"
                variants={{ initial: { y: 0 }, hover: { y: -5 } }}
                transition={{ delay: i * 0.1 }}
             >
                <div className="text-[10px] font-bold text-blue-600">OCT</div>
                <div className="text-sm font-bold text-blue-800">{15 + i*7}</div>
             </motion.div>
        ))}
        <div className="text-2xl font-bold text-blue-400">&rarr;</div>
        <motion.div 
          className="w-12 h-12 border-2 border-dashed border-blue-400 rounded-lg bg-blue-50 flex items-center justify-center shadow-lg"
          variants={{ initial: { scale: 1 }, hover: { scale: 1.2, rotate: 10 } }}
        >
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
               <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
           </svg>
        </motion.div>
    </motion.div>
);

// --- Feature Configuration (Updated for AutoPay) ---
const features = [
  {
    id: 'smart-accounts',
    title: 'Smart Account Powered',
    description: 'Leveraging ERC-4337 to enable gasless transactions, scheduled payments, and advanced security for all subscriptions.',
    visual: <SmartAccountVisual />,
    colSpan: 'lg:col-span-2',
  },
  {
    id: 'payment-agent',
    title: 'Automated Payment Agent',
    description: 'Our decentralized agent ensures your recurring payments are executed reliably and on time, every time.',
    visual: <PaymentAgentVisual />,
    colSpan: 'lg:col-span-1',
  },
   {
    id: 'spending-limits',
    title: 'Custom Spending Allowances',
    description: 'Set precise spending limits and allowances for each subscription, giving you complete control over your funds.',
    visual: <SpendingLimitsVisual />,
    colSpan: 'lg:col-span-1',
  },
  {
    id: 'flexible-scheduling',
    title: 'Flexible Scheduling',
    description: 'Manage multiple payment schedules with ease. Pay daily, weekly, monthly, or set custom intervals.',
    visual: <FlexibleSchedulingVisual />,
    colSpan: 'lg:col-span-1',
  },
  {
    id: 'high-performance',
    title: 'High-Performance L1',
    description: 'Built on a scalable blockchain achieving 10,000 TPS with sub-second finality for a seamless user experience.',
    visual: <PerformanceVisual />,
    colSpan: 'lg:col-span-1',
  },
   {
    id: 'real-time-indexing',
    title: 'Real-Time Indexing',
    description: 'Utilizing a high-performance indexer to provide instant notifications and up-to-the-minute payment history.',
    visual: <IndexingVisual />,
    colSpan: 'lg:col-span-2',
  },
];

// --- Bento Grid Component (Structure is the same, content is new) ---

const BentoGridItem: React.FC<{ feature: typeof features[0]; }> = ({ feature }) => {
  return (
    <motion.div
      key={feature.id}
      className={`relative rounded-3xl border border-gray-100 bg-white p-8 flex flex-col overflow-hidden cursor-pointer ${feature.colSpan} hover:shadow-xl transition-shadow duration-300 hover:border-blue-100`}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex-grow flex items-center justify-center rounded-lg overflow-hidden mb-6 h-48 bg-gradient-to-br from-blue-50 to-white">
        {feature.visual}
      </div>
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
      </div>
    </motion.div>
  );
};

const InteractiveFeatures: React.FC = () => {
  return (
    <section className="bg-gradient-to-b from-white to-blue-50 py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20 text-center">
          <h2 className="text-4xl md:text-5xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
            Next-Generation Payment Automation
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-4">
            Explore the core technologies that make AutoPay the most powerful and user-friendly crypto subscription platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[26rem]">
          {features.map((feature) => (
            <BentoGridItem key={feature.id} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default InteractiveFeatures;