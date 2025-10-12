import React from 'react';

// Define the types for the component's props for better type safety
interface AuthorizationCardProps {
    grant: boolean;
    onAuthorize: () => void;
    onRevoke: () => void;
}

const AuthorizationCard: React.FC<AuthorizationCardProps> = ({ grant, onAuthorize, onRevoke }) => (
    <div className={`p-6 rounded-lg ${grant ? 'bg-green-900/50' : 'bg-red-900/50'}`}>
        <div className="flex items-center justify-between">
            <div>
                <h3 className="font-bold text-lg">{grant ? 'Agent Authorized' : 'Authorization Required'}</h3>
                <p className="text-sm text-gray-300">
                    {grant 
                        ? 'The agent has permission to execute payments.' 
                        : 'Sign a message to delegate payment execution to the agent.'}
                </p>
            </div>
            <button
                onClick={grant ? onRevoke : onAuthorize}
                className={`px-5 py-2 rounded-md font-bold transition-colors ${
                    grant 
                        ? 'bg-red-600 hover:bg-red-700' 
                        : 'bg-green-600 hover:bg-green-700'
                }`}
            >
                {grant ? 'Revoke Agent' : 'Authorize Agent'}
            </button>
        </div>
    </div>
);

export default AuthorizationCard;