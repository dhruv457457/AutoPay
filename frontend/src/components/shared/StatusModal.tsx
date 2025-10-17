import React from 'react';
// 👇 Import the 'Variants' type
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion'; 
import { Loader2, CheckCircle2, XCircle, ExternalLink } from 'lucide-react';

interface Status {
  type: 'idle' | 'loading' | 'success' | 'error';
  message: string;
}

interface StatusModalProps {
  isOpen: boolean;
  status: Status;
  onClose: () => void;
}

// ✅ FIX: Explicitly apply the 'Variants' type to each animation object.
const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: 'spring', stiffness: 400, damping: 25 } 
  },
  exit: { 
    opacity: 0, 
    y: 50, 
    scale: 0.95,
    transition: { duration: 0.2 }
  },
};

const contentContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const contentItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const StatusModal: React.FC<StatusModalProps> = ({ isOpen, status, onClose }) => {
  const getTxHash = () => {
    if (status.type === 'success' && status.message.includes('TX:')) {
      return status.message.split('TX:')[1]?.trim();
    }
    return null;
  };
  
  const txHash = getTxHash();
  const explorerUrl = txHash ? `https://testnet.monadexplorer.com/tx/${txHash}` : '#';

  const statusConfig = {
    loading: {
      icon: <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />,
      title: 'Processing Transaction',
      color: 'text-blue-500',
    },
    success: {
      icon: <CheckCircle2 className="w-16 h-16 text-green-500" />,
      title: 'Success!',
      color: 'text-green-500',
    },
    error: {
      icon: <XCircle className="w-16 h-16 text-red-500" />,
      title: 'Transaction Failed',
      color: 'text-red-500',
    },
    idle: { icon: null, title: '', color: '' }
  };

  const currentStatus = statusConfig[status.type];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4 backdrop-blur-md"
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="bg-white rounded-2xl p-8 text-center max-w-sm w-full shadow-2xl overflow-hidden"
          >
            <AnimatePresence mode="wait"> 
              <motion.div
                key={status.type}
                variants={contentContainerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="flex flex-col items-center"
              >
                <motion.div variants={contentItemVariants} className="mb-6">
                  {currentStatus.icon}
                </motion.div>
                
                <motion.h3 variants={contentItemVariants} className={`text-2xl font-bold mb-2 ${currentStatus.color}`}>
                  {currentStatus.title}
                </motion.h3>
                
                <motion.p variants={contentItemVariants} className="text-gray-600 mb-6 break-words">
                  {status.message.split('TX:')[0]}
                </motion.p>

                {status.type === 'success' && txHash && (
                  <motion.a 
                    variants={contentItemVariants}
                    href={explorerUrl} target="_blank" rel="noopener noreferrer" 
                    className="inline-flex items-center justify-center gap-2 w-full text-blue-600 hover:underline mb-4"
                  >
                    View on Explorer <ExternalLink className="w-4 h-4" />
                  </motion.a>
                )}

                {(status.type === 'success' || status.type === 'error') && (
                  <motion.button
                    variants={contentItemVariants}
                    onClick={onClose}
                    className="w-full bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-md font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
                  >
                    {status.type === 'success' ? 'Done' : 'Close'}
                  </motion.button>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StatusModal;