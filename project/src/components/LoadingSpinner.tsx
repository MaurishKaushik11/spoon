import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Code, Search } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Analyzing project...' 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-6">
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Brain className="w-6 h-6 text-purple-400" />
        </motion.div>
      </div>
      
      <div className="text-center space-y-2">
        <motion.h3 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-lg font-medium text-gray-200"
        >
          {message}
        </motion.h3>
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
            className="flex items-center space-x-1"
          >
            <Search className="w-4 h-4" />
            <span>Fetching data</span>
          </motion.div>
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
            className="flex items-center space-x-1"
          >
            <Code className="w-4 h-4" />
            <span>Analyzing code</span>
          </motion.div>
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
            className="flex items-center space-x-1"
          >
            <Brain className="w-4 h-4" />
            <span>Generating insights</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
};