import React from 'react';
import { ShieldCheck, ShieldX } from 'lucide-react';

interface AuthorizationCardProps {
    grant: boolean;
    onAuthorize: () => void;
    onRevoke: () => void;
}

const AuthorizationCard: React.FC<AuthorizationCardProps> = ({ grant, onAuthorize, onRevoke }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center border ${
                    grant ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`}>
                    {grant ? (
                        <ShieldCheck className="w-6 h-6 text-green-600" />
                    ) : (
                        <ShieldX className="w-6 h-6 text-red-600" />
                    )}
                </div>
                <div>
                    <h3 className="font-bold text-lg text-gray-900">
                        {grant ? 'Agent Authorized' : 'Authorization Required'}
                    </h3>
                    <p className="text-sm text-gray-600">
                        {grant 
                            ? 'The agent can now execute payments on your behalf.' 
                            : 'Delegate payment execution to the agent to activate AutoPay.'}
                    </p>
                </div>
            </div>
            <button
                onClick={grant ? onRevoke : onAuthorize}
                className={`px-5 py-2.5 rounded-md font-semibold text-sm transition-colors ${
                    grant 
                        ? 'bg-white text-red-700 border border-red-300 hover:bg-red-50' 
                        : 'bg-green-600 text-white hover:bg-green-700'
                }`}
            >
                {grant ? 'Revoke Agent' : 'Authorize Agent'}
            </button>
        </div>
    </div>
);

export default AuthorizationCard;