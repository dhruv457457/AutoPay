import React from 'react';
import { User, Store, Code2, Users } from 'lucide-react';

// Data for the different subscription tiers/use-cases
const tiers = [
  {
    icon: <User className="w-8 h-8 text-gray-500 " />,
    title: 'For Individuals',
    subtitle: 'Manage your personal web3 subscriptions with ease.',
  },
  {
    icon: <Store className="w-8 h-8 text-gray-500 " />,
    title: 'For Businesses',
    subtitle: 'Accept recurring crypto revenue from your customers.',
  },
  {
    icon: <Code2 className="w-8 h-8 text-gray-500 " />,
    title: 'For Developers',
    subtitle: 'Integrate our SDK to power your dApp with subscriptions.',
  },
  {
    icon: <Users className="w-8 h-8 text-gray-500 " />,
    title: 'For DAOs',
    subtitle: 'Automate payroll, grants, and treasury streams.',
  },
];

const SubscriptionTiers: React.FC = () => {
  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto ">
        <div className="text-center mb-16">
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Solutions for Every Use Case
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          {tiers.map((tier) => (
            <div
              key={tier.title}
              className="group p-8 bg-gray-50 border border-gray-100 rounded-3xl cursor-pointer transition-all duration-300 "
            >
              <div className="flex flex-col items-start">
                {/* Icon */}
                <div className="mb-5">
                  {tier.icon}
                </div>
                
                {/* Text Content */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {tier.title}
                  </h3>
                  <p className="mt-1 text-base text-gray-600">
                    {tier.subtitle}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SubscriptionTiers;