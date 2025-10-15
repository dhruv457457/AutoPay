
import React, { useState } from 'react';
import { BookOpen, Rocket, User, Users, CheckCircle, QuoteIcon } from 'lucide-react';

const sections = [
	{ id: 'introduction', label: 'Introduction', icon: <BookOpen className="w-5 h-5 mr-2" /> },
	{ id: 'getting-started', label: 'Getting Started', icon: <Rocket className="w-5 h-5 mr-2" /> },
	{ id: 'smart-account', label: 'Smart Account Setup', icon: <User className="w-5 h-5 mr-2" /> },
	{ id: 'create-subscription', label: 'Creating Subscriptions', icon: <CheckCircle className="w-5 h-5 mr-2" /> },
	{ id: 'approvals', label: 'Managing Approvals', icon: <Users className="w-5 h-5 mr-2" /> },
	{ id: 'activity-log', label: 'Activity Log', icon: <BookOpen className="w-5 h-5 mr-2" /> },
	{ id: 'faq', label: 'FAQ', icon: <QuoteIcon className="w-5 h-5 mr-2" /> },
];

const sectionContent: Record<string, React.ReactNode> = {
	'introduction': (
		<div className="rounded-2xl border border-gray-200 bg-white shadow p-8 mb-8">
			<h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to AutoPay Docs</h1>
			<p className="text-gray-600 text-lg mb-4">AutoPay lets you automate on-chain recurring payments using smart accounts. This documentation will guide you through setup, usage, and best practices.</p>
			<ul className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
				<li className="bg-green-50 border border-green-100 rounded-xl p-6">
					<h3 className="font-semibold text-green-700 text-lg mb-2">Why AutoPay?</h3>
					<p className="text-gray-700">Automate payroll, SaaS, DAO grants, and more with secure, gasless, and flexible on-chain subscriptions.</p>
				</li>
				<li className="bg-blue-50 border border-blue-100 rounded-xl p-6">
					<h3 className="font-semibold text-blue-700 text-lg mb-2">Non-custodial</h3>
					<p className="text-gray-700">You always control your funds. AutoPay only moves what you authorize, when you authorize it.</p>
				</li>
				<li className="bg-yellow-50 border border-yellow-100 rounded-xl p-6">
					<h3 className="font-semibold text-yellow-700 text-lg mb-2">Multi-token Support</h3>
					<p className="text-gray-700">Supports any ERC-20 token for maximum flexibility in your payment flows.</p>
				</li>
				<li className="bg-gray-50 border border-gray-100 rounded-xl p-6">
					<h3 className="font-semibold text-gray-700 text-lg mb-2">Real-time Activity</h3>
					<p className="text-gray-700">Track all payment events, authorizations, and subscription changes instantly.</p>
				</li>
			</ul>
		</div>
	),
	'getting-started': (
		<div className="rounded-2xl border border-gray-200 bg-white shadow p-8 mb-8">
			<h2 className="text-2xl font-semibold text-gray-900 mb-2">Getting Started</h2>
			<ol className="list-decimal list-inside text-gray-700 space-y-2 mb-6">
				<li>Connect your wallet using the top-right button.</li>
				<li>Set up your smart account (see next section).</li>
				<li>Authorize the AutoPay agent for recurring payments.</li>
				<li>Create your first subscription.</li>
			</ol>
			<div className="bg-gray-50 border border-gray-100 rounded-xl p-6 mt-4">
				<h3 className="font-semibold text-gray-800 mb-2">Tip: Test on Testnet</h3>
				<p className="text-gray-700">Try AutoPay on a supported testnet before going live. You can use test tokens to explore all features risk-free.</p>
			</div>
		</div>
	),
	'smart-account': (
		<div className="rounded-2xl border border-gray-200 bg-white shadow p-8 mb-8">
			<h2 className="text-2xl font-semibold text-gray-900 mb-2">Smart Account Setup</h2>
			<p className="text-gray-700 mb-2">AutoPay uses smart accounts for secure, gasless transactions. Go to the dashboard and follow the prompts to deploy or connect your smart account.</p>
			<ul className="list-disc list-inside text-gray-700 ml-4 mb-4">
				<li>Your EOA (main wallet) remains in control.</li>
				<li>Smart account handles only authorized payments.</li>
				<li>Deploy once, use forever—no need to repeat setup for each subscription.</li>
			</ul>
			<div className="bg-green-50 border border-green-100 rounded-xl p-6">
				<h3 className="font-semibold text-green-700 mb-2">Security</h3>
				<p className="text-gray-700">Your smart account is non-custodial and can be revoked or upgraded at any time. All actions are transparent and on-chain.</p>
			</div>
		</div>
	),
	'create-subscription': (
		<div className="rounded-2xl border border-gray-200 bg-white shadow p-8 mb-8">
			<h2 className="text-2xl font-semibold text-gray-900 mb-2">Creating Subscriptions</h2>
			<p className="text-gray-700 mb-2">Easily set up recurring payments:</p>
			<ol className="list-decimal list-inside text-gray-700 space-y-2 mb-6">
				<li>Go to the <span className="font-semibold text-green-700">AutoPay Dashboard</span>.</li>
				<li>Click "Create Subscription" and fill in the details (recipient, token, amount, interval).</li>
				<li>Confirm the transaction in your wallet.</li>
				<li>Monitor your subscription status and upcoming payments in the dashboard.</li>
			</ol>
			<div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mt-4">
				<h3 className="font-semibold text-blue-700 mb-2">Flexible Scheduling</h3>
				<p className="text-gray-700">Choose from daily, weekly, monthly, or custom intervals. Pause or edit subscriptions anytime.</p>
			</div>
		</div>
	),
	'approvals': (
		<div className="rounded-2xl border border-gray-200 bg-white shadow p-8 mb-8">
			<h2 className="text-2xl font-semibold text-gray-900 mb-2">Managing Approvals</h2>
			<p className="text-gray-700 mb-2">You can view, approve, or revoke payment permissions at any time from the dashboard.</p>
			<ul className="list-disc list-inside text-gray-700 ml-4 mb-4">
				<li>See all active authorizations.</li>
				<li>Revoke access instantly if needed.</li>
				<li>Get notified of new approval requests and changes.</li>
			</ul>
			<div className="bg-yellow-50 border border-yellow-100 rounded-xl p-6">
				<h3 className="font-semibold text-yellow-700 mb-2">Transparency</h3>
				<p className="text-gray-700">All approvals are logged and auditable. You can always see who has access and when changes were made.</p>
			</div>
		</div>
	),
	'activity-log': (
		<div className="rounded-2xl border border-gray-200 bg-white shadow p-8 mb-8">
			<h2 className="text-2xl font-semibold text-gray-900 mb-2">Activity Log</h2>
			<p className="text-gray-700 mb-2">Track all subscription events and payment activity in real time.</p>
			<ul className="list-disc list-inside text-gray-700 ml-4 mb-4">
				<li>See successful payments, failures, and upcoming charges.</li>
				<li>Export logs for your records.</li>
				<li>Filter by date, status, or subscription.</li>
			</ul>
			<div className="bg-gray-50 border border-gray-100 rounded-xl p-6">
				<h3 className="font-semibold text-gray-700 mb-2">Pro Tip</h3>
				<p className="text-gray-700">Use the activity log to troubleshoot issues, verify payments, and maintain compliance records.</p>
			</div>
		</div>
	),
	'faq': (
		<div className="rounded-2xl border border-gray-200 bg-white shadow p-8 mb-2">
			<h2 className="text-2xl font-semibold text-gray-900 mb-2">FAQ</h2>
			<ul className="list-disc list-inside text-gray-700 ml-4 mb-4">
				<li><span className="font-semibold">Is AutoPay non-custodial?</span> Yes, you always control your funds.</li>
				<li><span className="font-semibold">Can I cancel subscriptions?</span> Yes, at any time from the dashboard.</li>
				<li><span className="font-semibold">Which tokens are supported?</span> Any ERC-20 token.</li>
				<li><span className="font-semibold">Can I pause a subscription?</span> Yes, you can pause and resume at any time.</li>
				<li><span className="font-semibold">How do I get support?</span> Reach out via our support page or community channels for help.</li>
			</ul>
			<div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
				<h3 className="font-semibold text-blue-700 mb-2">Need more help?</h3>
				<p className="text-gray-700">Check our full documentation or contact support for personalized assistance.</p>
			</div>
		</div>
	),
};

const Docs: React.FC = () => {
	const [activeSection, setActiveSection] = useState(sections[0].id);

		return (
			<div className="min-h-0 bg-white">
				<div className="max-w-[1600px] mx-auto pt-12 pb-2 px-2 sm:px-8 flex flex-col md:flex-row gap-10 ">
				{/* Sidebar */}
				<aside className="w-full md:w-80 xl:w-96 mb-8 md:mb-0">
					<div className="sticky top-20">
						<h2 className="text-2xl font-bold text-gray-900 mb-8 pl-2">Documentation</h2>
						<nav className="flex flex-col gap-2">
							{sections.map((section) => (
								<button
									key={section.id}
									onClick={() => setActiveSection(section.id)}
									className={`flex items-center px-5 py-3 rounded-xl font-medium transition-colors text-base
										${activeSection === section.id
											? 'bg-green-50 text-green-700 border-l-4 border-green-600 shadow'
											: 'text-gray-700 hover:bg-gray-50'}
									`}
								>
									{section.icon}
									{section.label}
								</button>
							))}
						</nav>
					</div>
				</aside>

				{/* Main Content */}
				<main className="flex-1 flex flex-col gap-8">
					{sectionContent[activeSection]}
				</main>
			</div>
		</div>
	);
};

export default Docs;
