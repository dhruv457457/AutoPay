// src/components/CTABanner.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button'; // Assuming you have a reusable Button component
import { Zap } from 'lucide-react';

const CTABanner: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-b from-white to-blue-50 py-24 sm:py-32 px-4 overflow-hidden">
      {/* Background Shapes - Mimicking the second screenshot */}
      <div className="absolute top-16 left-16 -translate-x-1/2 -translate-y-1/2 w-[160px] h-[160px] md:w-[220px] md:h-[220px] bg-purple-600/10 rounded-full flex items-center justify-center p-8 lg:p-10">
        <div className="w-full h-full border-[10px] md:border-[15px] border-purple-600/30 rounded-full" />
      </div>
      <div className="absolute bottom-16 right-16 translate-x-1/2 translate-y-1/2 w-[160px] h-[160px] md:w-[220px] md:h-[220px] bg-blue-600/10 rounded-full flex items-center justify-center p-8 lg:p-10">
        <div className="w-full h-full border-[10px] md:border-[15px] border-blue-600/30 rounded-full" />
      </div>

      {/* Content Card */}
      <motion.div
        className="relative z-10 max-w-4xl mx-auto bg-white border border-gray-100 rounded-3xl p-10 md:p-16 text-center shadow-lg"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
          Build on the fastest <span className="text-blue-600">EVM-compatible</span> payment layer.
        </h2>
        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
          Join the AutoPay ecosystem and bring your vision to life. Build cutting-edge applications, access advanced resources, and receive support to grow your project.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-4">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm">
            <Zap className="mr-2 h-5 w-5" />
            Start building
          </Button>
          <Button size="lg" variant="outline" className="font-semibold border-gray-300 hover:bg-gray-50">
            Get in touch
          </Button>
        </div>
      </motion.div>
    </section>
  );
};

export default CTABanner;