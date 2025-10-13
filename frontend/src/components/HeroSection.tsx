import { Wallet, Search, HeartHandshake, Zap } from "lucide-react";

export default function HeroSection() {
  return (
    <div className="relative w-full flex flex-col items-center justify-center bg-white min-h-screen">
      <div className="max-w-7xl">
        <h1 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-slate-700 md:text-4xl lg:text-7xl dark:text-slate-900">
          Automate your <span className="text-blue-600">crypto</span> payments with ease
        </h1>

        <p className="relative z-10 mx-auto max-w-xl py-4 text-center text-lg font-normal text-neutral-600 dark:text-neutral-700">
          With our AI-driven system, set up recurring subscriptions, manage allowances, and enjoy seamless, automated transactions on the blockchain.
        </p>

        {/* Connection Section */}
        <div className="relative z-10 mt-20 w-full mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center relative z-10 bg-gray-50 border border-gray-100 rounded-3xl p-6">
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
            <div className="flex flex-col items-center text-center relative z-10 bg-gray-50 border border-gray-100 rounded-3xl p-6">
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
            <div className="flex flex-col items-center text-center relative z-10 bg-gray-50 border border-gray-100 rounded-3xl p-6">
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
            <div className="flex flex-col items-center text-center relative z-10 bg-gray-50 border border-gray-100 rounded-3xl p-6">
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
        </div>
      </div>
    </div>
  );
}