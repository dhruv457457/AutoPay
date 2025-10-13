import React from 'react';
import { Braces, Twitter, Github, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

// --- Data for Footer Links ---
// This approach makes the footer easy to update and maintain.
const productLinks = [
  { name: 'Features', href: '/features' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Subscriptions', href: '/subscriptions' },
  { name: 'Security', href: '/security' },
];

const companyLinks = [
  { name: 'About Us', href: '/about' },
  { name: 'Careers', href: '/careers' },
  { name: 'Contact', href: '/contact' },
  { name: 'Press Kit', href: '/press' },
];

const resourceLinks = [
  { name: 'Blog', href: '/blog' },
  { name: 'Documentation', href: '/docs' },
  { name: 'Help Center', href: '/help' },
  { name: 'API Status', href: '/status' },
];

const Footer: React.FC = () => {
  return (
    // MODIFICATION: Increased vertical padding for a larger feel
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:py-14 lg:px-8">
        {/* Top section with columns (unchanged) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 xl:gap-12">
          
          {/* Brand and Mission Section */}
          <div className="md:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 text-white mb-4">
              <Braces className="h-8 w-8 text-blue-500" />
              <span className="text-2xl font-bold">AutoPay</span>
            </Link>
            <p className="text-sm text-gray-400">
              Simplifying recurring payments and subscription management for businesses of all sizes.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-100 tracking-wider uppercase">Product</h3>
            <ul className="mt-4 space-y-3">
              {productLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-base text-gray-300 hover:text-white transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-100 tracking-wider uppercase">Company</h3>
            <ul className="mt-4 space-y-3">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-base text-gray-300 hover:text-white transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-100 tracking-wider uppercase">Resources</h3>
            <ul className="mt-4 space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-base text-gray-300 hover:text-white transition-colors duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr className="my-10 border-gray-700" />

        {/* --- MODIFICATION START: Bottom section layout updated --- */}

        {/* Legal links, now centered */}
        <div className="flex justify-center space-x-6">
          <Link to="/privacy-policy" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">Privacy Policy</Link>
          <Link to="/terms-of-service" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">Terms & Conditions</Link>
          <Link to="/code-of-conduct" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">Code of Conduct</Link>
        </div>
        
        {/* Social icons, now in their own centered section */}
        <div className="flex justify-center space-x-6 mt-8">
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
            <span className="sr-only">Twitter</span>
            <Twitter className="h-6 w-6" />
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
            <span className="sr-only">GitHub</span>
            <Github className="h-6 w-6" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
            <span className="sr-only">LinkedIn</span>
            <Linkedin className="h-6 w-6" />
          </a>
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} AutoPay, Inc. All rights reserved.
        </div>

        {/* --- MODIFICATION END --- */}

      </div>
    </footer>
  );
};

export default Footer;