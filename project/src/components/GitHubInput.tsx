import React, { useState } from 'react';
import { Github, Search } from 'lucide-react';
import { motion } from 'framer-motion';

interface GitHubInputProps {
  onSubmit: (url: string) => void;
  isLoading?: boolean;
}

export const GitHubInput: React.FC<GitHubInputProps> = ({ onSubmit, isLoading }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim() && !isLoading) {
      onSubmit(url.trim());
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3 mb-4">
        <Github className="w-6 h-6 text-gray-300" />
        <h3 className="text-lg font-medium text-gray-200">GitHub Repository</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://github.com/username/repository"
            className="w-full px-4 py-3 pl-12 bg-gray-800/50 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all duration-200"
            disabled={isLoading}
          />
          <Github className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={!url.trim() || isLoading}
          className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <Search className="w-4 h-4" />
          <span>{isLoading ? 'Analyzing...' : 'Analyze Repository'}</span>
        </motion.button>
      </form>
    </div>
  );
};