import React from 'react';
import { Link } from 'react-router-dom';

// --- Updated & Expanded Data for Footer Links ---
const productLinks = [
  { name: 'Automated Payments', href: '/auto-pay' },
  { name: 'Gasless Transactions', href: '/features' },
  { name: 'Spending Limits', href: '/features' },
  { name: 'Flexible Scheduling', href: '/features' },
  { name: 'Developer API', href: '/docs' },
  { name: 'For Creators', href: '/use-cases' },
  { name: 'For DAOs', href: '/use-cases' },
  { name: 'For Businesses', href: '/use-cases' },
];


const Footer: React.FC = () => {
  return (
    <footer className="bg-white p-20">
      <div className="max-w-7xl mx-auto p-10 bg-gray-50 border border-gray-100 rounded-3xl">
        {/* Top section with link columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
       
          {/* Product Links - Spanning multiple columns */}
          <div className="md:col-span-3">
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider">Product</h3>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-8">
              {productLinks.map((link) => (
                <div key={link.name}>
                  <Link to={link.href} className="text-base text-gray-600 hover:text-gray-900 transition-colors duration-200">
                    {link.name}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-20 pt-8 border-t border-gray-200/80 flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center gap-x-6">
                <span className="text-lg font-bold text-gray-800">AutoPay</span>
                <Link to="/privacy-policy" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">Privacy</Link>
                <Link to="/terms-of-service" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">Terms</Link>
            </div>
            <div className="mt-4 sm:mt-0">
                <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} AutoPay, Inc.</p>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;