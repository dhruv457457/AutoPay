"use client";

import { motion } from "framer-motion";
import { Wallet, Search, HeartHandshake, Zap } from "lucide-react";

export default function HeroSection() {
  return (
    <div className="relative w-full flex flex-col items-center justify-center bg-white min-h-screen">
      <div className="w-full px-4 py-6 md:py-12">
        <h1 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-slate-700 md:text-4xl lg:text-7xl dark:text-slate-900">
          {["Automate", "your", <span key="crypto" className="text-blue-600">crypto</span>, "payments", "with", "ease"]
            .map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1,
                  ease: "easeInOut",
                }}
                className="mr-2 inline-block"
              >
                {word}
              </motion.span>
            ))}
        </h1>

        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
            delay: 0.8,
          }}
          className="relative z-10 mx-auto max-w-xl py-4 text-center text-lg font-normal text-neutral-600 dark:text-neutral-700"
        >
          With our AI-driven system, set up recurring subscriptions, manage allowances, and enjoy seamless, automated transactions on the blockchain.
        </motion.p>

        {/* Search Section */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.4,
            delay: 1.3,
          }}
          className="relative z-10 mt-16 max-w-4xl mx-auto w-full"
        >
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Recipient Address Input */}
              <div className="flex-1 relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Recipient Address, e.g., 0x..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Amount Input */}
              <div className="flex-1 relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Amount, e.g., 100"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Create Subscription Button */}
              <button className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300 whitespace-nowrap">
                Create Subscription
              </button>
            </div>
          </div>
        </motion.div>

        {/* Connection Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 1.5 }}
          className="relative z-10 mt-20 w-full max-w-6xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Wallet className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Connect Your Wallet
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Easily connect your wallet to get started with the AutoPay system.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Set Up a Subscription
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Define the recipient, amount, and frequency for your recurring payment.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <HeartHandshake className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Authorize the Agent
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Grant secure, one-time permission for our agent to process payments.
              </p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Enjoy Automation
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Your payments are now automated. Sit back and relax!
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}