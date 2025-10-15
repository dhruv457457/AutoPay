import React from 'react';
import { 
    Repeat, 
    Zap, 
    CalendarDays, 
    Coins, 
    ShieldCheck, 
    BarChart 
} from 'lucide-react';

// Data for the different features/benefits, inspired by the reference image layout
const features = [
  {
    icon: <Repeat className="w-6 h-6 text-gray-700" />,
    title: 'Automate Crypto Payments',
    description: 'Effortlessly set up recurring invoices, subscriptions, and payroll in various tokens. Eliminate manual errors and save time.',
  },
  {
    icon: <Zap className="w-6 h-6 text-gray-700" />,
    title: 'Gasless Experience',
    description: 'Sponsor gas fees for your users, enabling them to pay for subscriptions without holding native blockchain tokens.',
  },
  {
    icon: <CalendarDays className="w-6 h-6 text-gray-700" />,
    title: 'Flexible Scheduling',
    description: 'Customize payment frequencies to suit your business model—from real-time streaming to daily, monthly, or annual billing cycles.',
  },
  {
    icon: <Coins className="w-6 h-6 text-gray-700" />,
    title: 'Multi-Token Support',
    description: 'Accept payments in a wide range of ERC-20 tokens, providing flexibility for your global customer base.',
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-gray-700" />,
    title: 'Enhanced Security',
    description: 'Leverage modular smart accounts for non-custodial, secure payment processing with customizable spending policies.',
  },
  {
    icon: <BarChart className="w-6 h-6 text-gray-700" />,
    title: 'Real-Time Analytics',
    description: 'Gain valuable insights with a comprehensive dashboard that tracks all incoming and outgoing payments in real-time.',
  },
];

const SubscriptionTiers: React.FC = () => {
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className=" mb-16">
           <p className="text-base font-semibold text-green-700 mb-2">BENEFITS - WHY AUTOPAY?</p>
          <h2 className="text-4xl font-bold text-gray-900 mb-12">
            Achieve Maximum Efficiency <br /> with Minimal Effort
          </h2>
        </div>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="bg-white border border-gray-200 p-6">
              {/* Icon */}
              <div className="flex items-start mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-50 border border-gray-200 rounded-lg">
                  {feature.icon}
                </div>
              </div>
              
              {/* Text Content */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-base text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SubscriptionTiers;