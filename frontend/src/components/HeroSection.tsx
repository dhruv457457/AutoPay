
import { Link } from 'react-router-dom';

// Style object for the dot-grid pattern
const gridStyle = {
    backgroundImage: 'radial-gradient(circle at 1px 1px, #d1d5db 1px, transparent 0)',
    backgroundSize: '20px 20px',
};

export default function HeroSection() {
  return (
    <div className="w-full bg-white px-4 sm:px-8 md:px-20 py-20 relative">
      
      {/* Decorative Grids */}
      <div style={gridStyle} className="absolute top-8 left-1/2 -translate-x-1/2 h-16 w-1/4 z-0" aria-hidden="true"></div>
      <div style={gridStyle} className="absolute bottom-8 left-1/2 -translate-x-1/2 h-24 w-2/3 z-0" aria-hidden="true"></div>
      <div style={gridStyle} className="absolute left-8 top-1/2 -translate-y-1/2 w-24 h-1/3 z-0" aria-hidden="true"></div>
      <div style={gridStyle} className="absolute right-8 top-1/2 -translate-y-1/2 w-24 h-1/3 z-0" aria-hidden="true"></div>

      {/* Main Content Box */}
      <div className="relative z-10 max-w-7xl mx-auto border border-gray-200 bg-white flex flex-col items-center justify-center text-center py-24 px-4 sm:px-6 lg:px-8">
        
        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 max-w-4xl leading-tight">
          Automate Your <span className="text-green-600">On-Chain Recurring</span> Payments
        </h1>

        {/* Subheading */}
        <p className="mt-6 text-lg text-gray-600 max-w-3xl">
          Leverage smart accounts to offer gasless, multi-token subscriptions and payroll. Streamline your revenue, manage DAO grants, and enhance user experience with true on-chain automation.
        </p>

        {/* Call-to-Action Buttons */}
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            to="/auto-pay"
            className="rounded-md bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-green-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 transition-colors"
          >
            Launch Dashboard
          </Link>
          <a 
            href="#" 
            className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors"
          >
            View Documentation
          </a>
        </div>
        
      </div>
    </div>
  );
}