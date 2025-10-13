import React from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Bot,
  Repeat,
  CheckCircle,
  Zap,
  Droplet,
} from "lucide-react";
import { cn } from "../lib/utils";

// --- VISUALS ---

const GaslessVisual = () => (
  <div className="w-full h-full flex flex-col items-center justify-center text-center relative overflow-hidden">
    <Zap className="w-20 h-20 text-yellow-400" />
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0, 0.8] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      <Droplet className="w-10 h-10 text-gray-400" />
    </motion.div>
    <p className="mt-4 font-bold text-gray-800">Gasless Transactions</p>
  </div>
);

const MetaMaskVisual = () => (
  <div className="w-full h-full flex flex-col items-center justify-center text-center">
    <motion.img
      src="https://support.metamask.io/img/favicons/favicon-96x96.png"
      alt="MetaMask logo"
      className="h-20 w-auto object-contain"
      whileHover={{ scale: 1.1 }}
      transition={{ type: "spring", stiffness: 300 }}
    />
    <p className="mt-4 font-bold text-gray-800">Smart Accounts</p>
  </div>
);

const MonadVisual = () => (
  <div className="w-full h-full flex flex-col items-center justify-center">
    <svg
      className="w-60 h-60"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="#836EF9"
        d="M12 3c-2.599 0-9 6.4-9 9s6.401 9 9 9s9-6.401 9-9s-6.401-9-9-9m-1.402 14.146c-1.097-.298-4.043-5.453-3.744-6.549s5.453-4.042 6.549-3.743c1.095.298 4.042 5.453 3.743 6.549c-.298 1.095-5.453 4.042-6.549 3.743"
      />
    </svg>
    <p className="mt-3 font-mono text-gray-500 text-sm">10,000 TPS</p>
  </div>
);

const EnvioVisual = () => (
  <div className="w-full h-full flex flex-col items-center justify-center">
    <motion.img
      src="https://docs.envio.dev/img/envio-logo.png"
      alt="Envio Logo"
      className="h-24 w-auto object-contain"
      whileHover={{ scale: 1.1 }}
      transition={{ type: "spring", stiffness: 300 }}
    />
    <p className="mt-3 font-bold text-gray-800">Real-Time Indexing</p>
  </div>
);

const SchedulingVisual = () => (
  <div className="relative w-full h-full flex items-center justify-center">
    <motion.div
      className="absolute w-40 h-40"
      animate={{ rotate: 360 }}
      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
    >
      <svg viewBox="0 0 200 200" className="absolute inset-0">
        <circle
          cx="100"
          cy="100"
          r="70"
          fill="none"
          stroke="#D1D5DB"
          strokeWidth="2"
          strokeDasharray="4 8"
        />
      </svg>
      <motion.div
        className="absolute top-[44px] left-1/2 -ml-2 w-3 h-3 bg-blue-500 rounded-full"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-[44px] right-1/2 -mr-2 w-3 h-3 bg-teal-500 rounded-full"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
      />
    </motion.div>
    <CalendarDays className="w-10 h-10 text-gray-700" />
  </div>
);

const AutomationVisual = () => (
  <div className="relative w-full h-full flex items-center justify-center overflow-hidden p-4">
    <motion.div
      className="z-10 w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center shadow-lg"
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      <Bot className="w-12 h-12 text-white" />
    </motion.div>
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute"
        animate={{ rotate: 360 }}
        transition={{ duration: 20 + i * 8, repeat: Infinity, ease: "linear" }}
      >
        <motion.div
          style={{ transform: `translateY(-${80 + i * 15}px)` }}
          className="w-8 h-8 bg-white shadow-md rounded-full flex items-center justify-center"
        >
          {i % 2 === 0 ? (
            <Repeat className="w-4 h-4 text-gray-500" />
          ) : (
            <CheckCircle className="w-4 h-4 text-green-500" />
          )}
        </motion.div>
      </motion.div>
    ))}
  </div>
);

// --- UPDATED features array for the new 3x2 layout ---
const features = [
  {
    title: "Built on Monad",
    description: "High-performance L1 with 10,000 TPS.",
    visual: <MonadVisual />,
    colSpan: "lg:col-span-2",
  },
  {
    title: "Automated Payments Agent",
    description:
      "Our decentralized agent executes your payments securely and on time.",
    visual: <AutomationVisual />,
    colSpan: "lg:col-span-1",
  },
  {
    title: "Dynamic Payment Schedules",
    description: "From streaming to annual subscriptions.",
    visual: <SchedulingVisual />,
    colSpan: "lg:col-span-1",
  },
  {
    title: "MetaMask Smart Accounts",
    description: "Leveraging modular accounts for advanced permissions.",
    visual: <MetaMaskVisual />,
    colSpan: "lg:col-span-1",
  },
  {
    title: "Gasless Transactions",
    description:
      "Users can pay for subscriptions without needing native tokens for gas.",
    visual: <GaslessVisual />,
    colSpan: "lg:col-span-1",
  },

  {
    title: "Indexed by Envio",
    description: "Real-time APIs for all approval data.",
    visual: <EnvioVisual />,
    colSpan: "lg:col-span-2",
  },
];

// --- BENTO GRID ITEM COMPONENT ---
const BentoGridItem: React.FC<{ feature: (typeof features)[0] }> = ({
  feature,
}) => {
  return (
    <motion.div
      className={cn(
        "relative bg-gray-50 border border-gray-100 rounded-3xl flex flex-col group transition-all duration-300 p-6 cursor-pointer",
        feature.colSpan
      )}
    >
      <div className="flex-grow h-32 mb-4 flex items-center justify-center">
        {feature.visual}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {feature.title}
        </h3>
        <p className="text-sm text-gray-600 leading-tight">
          {feature.description}
        </p>
      </div>
    </motion.div>
  );
};

// --- MAIN COMPONENT ---
const InteractiveFeatures: React.FC = () => {
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="max-w-7xl mx-auto ">
        <div className="text-center mb-16">
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Built with cutting-edge components to deliver a powerful, seamless,
            and secure user experience.
          </p>
        </div>
        {/* Updated grid to be 2 columns on lg screens */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 auto-rows-[21rem]">
          {features.map((feature, i) => (
            <BentoGridItem key={i} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default InteractiveFeatures;
