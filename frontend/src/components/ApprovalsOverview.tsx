// src/components/FeaturesSection.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button'; // Assuming you have a button component
import { ShieldCheck, CalendarClock, Bell } from 'lucide-react';

// --- Custom Animated Visual for the Hero Feature ---
const AutomationVisual = () => (
  <div className="w-full h-full p-4 flex items-center justify-center">
    <div className="w-full max-w-sm space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-6 bg-gray-200/70 rounded-lg overflow-hidden relative">
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-blue-600"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{
              duration: 2 + i * 0.5,
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'linear',
            }}
          />
        </div>
      ))}
    </div>
  </div>
);

// --- Data for Feature Cards ---
const features = [
  {
    id: 'hero-feature',
    title: 'Smart Account Powered Automation',
    description:
      'Leverage ERC-4337 to enable gasless transactions, advanced security, and fully automated, programmable payment schedules for a seamless subscription experience.',
    visual: <AutomationVisual />,
    layout: 'hero', // Custom layout property
  },
  {
    id: 'feature-1',
    icon: <ShieldCheck className="w-7 h-7" />,
    title: 'Custom Spending Limits',
    description:
      'Set precise spending allowances for each subscription, giving you complete, granular control over your funds.',
    layout: 'default',
  },
  {
    id: 'feature-2',
    icon: <CalendarClock className="w-7 h-7" />,
    title: 'Flexible Scheduling',
    description:
      'Manage multiple payment schedules with ease. Pay daily, weekly, monthly, or set custom recurring intervals.',
    layout: 'default',
  },
  {
    id: 'feature-3',
    icon: <Bell className="w-7 h-7" />,
    title: 'Real-time Notifications',
    description:
      'Stay informed with instant alerts for every successful payment, failed transaction, or upcoming charge.',
    layout: 'default',
  },
];

const ApprovalsOverview: React.FC = () => {

  return (
    <section className="bg-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Engineered for a New Era of Payments
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            AutoPay combines cutting-edge blockchain technology with user-centric design to deliver an unparalleled automation experience.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {features.map((feature, i) =>
            // --- RENDER HERO CARD ---
            feature.layout === 'hero' ? (
              <motion.div
                key={feature.id}
                className="lg:col-span-3 bg-white border border-gray-200/80 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-sm"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: 'easeInOut' }}
              >
                <div className="w-full md:w-1/2 h-64 md:h-auto rounded-2xl bg-gray-50">
                  {feature.visual}
                </div>
                <div className="w-full md:w-1/2">
                  <h3 className="text-3xl font-bold text-gray-900">{feature.title}</h3>
                  <p className="mt-4 text-base text-gray-600 leading-relaxed">{feature.description}</p>
                  <Button size="lg" className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                    Learn About the Technology
                  </Button>
                </div>
              </motion.div>
            ) : (
              // --- RENDER DEFAULT CARD ---
              <motion.div
                key={feature.id}
                className="bg-white border border-gray-200/80 rounded-3xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: 'easeInOut' }}
              >
                <div className="bg-blue-100 text-blue-600 rounded-full w-14 h-14 flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-sm text-gray-500">{feature.description}</p>
              </motion.div>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default ApprovalsOverview;