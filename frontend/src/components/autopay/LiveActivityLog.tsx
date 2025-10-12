import React from 'react';

interface LiveActivityLogProps {
    status: string;
}

const LiveActivityLog: React.FC<LiveActivityLogProps> = ({ status }) => (
    <div className="bg-black rounded-lg p-5 shadow-inner">
        <div className="flex items-center gap-3 mb-3">
            {/* Pulsing green dot indicates it's live */}
            <span className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></span>
            <p className="font-mono text-md text-gray-400">Live Activity Log</p>
        </div>
        <p className="font-mono text-sm text-cyan-300">
            <span className="text-green-400 mr-2">›</span>
            {status}
        </p>
    </div>
);

export default LiveActivityLog;