import React from 'react';
import { Shield, ShieldCheck, ShieldX } from 'lucide-react';

// Define the types for the component's props for better type safety
interface AuthorizationCardProps {
    grant: boolean;
    onAuthorize: () => void;
    onRevoke: () => void;
}

const AuthorizationCard: React.FC<AuthorizationCardProps> = ({ grant, onAuthorize, onRevoke }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    grant ? 'bg-green-100' : 'bg-red-100'
                }`}>
                    {grant ? (
                        <ShieldCheck className="w-6 h-6 text-green-600" />
                    ) : (
                        <ShieldX className="w-6 h-6 text-red-600" />
                    )}
                </div>
                <div>
                    <h3 className={`font-bold text-lg ${
                        grant ? 'text-green-900' : 'text-red-900'
                    }`}>
                        {grant ? 'Agent Authorized' : 'Authorization Required'}
                    </h3>
                    <p className={`text-sm ${
                        grant ? 'text-green-700' : 'text-red-700'
                    }`}>
                        {grant 
                            ? 'The agent has permission to execute payments on your behalf.' 
                            : 'Sign a message to delegate payment execution to the agent.'}
                    </p>
                </div>
            </div>
            <button
                onClick={grant ? onRevoke : onAuthorize}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
                    grant 
                        ? 'bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow-md' 
                        : 'bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-md'
                }`}
            >
                <Shield className="w-4 h-4" />
                {grant ? 'Revoke Agent' : 'Authorize Agent'}
            </button>
        </div>
    </div>
);

export default AuthorizationCard;