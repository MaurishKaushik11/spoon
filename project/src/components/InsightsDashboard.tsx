import React from 'react';
import { motion } from 'framer-motion';
import { AnalysisResult } from '../types';
import { 
  Brain, 
  Code, 
  Lightbulb, 
  Users, 
  GitBranch, 
  Star,
  TrendingUp
} from 'lucide-react';

interface InsightsDashboardProps {
  result: AnalysisResult;
}

const COLORS = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'];

export const InsightsDashboard: React.FC<InsightsDashboardProps> = ({ result }) => {
  const { aiInsights, repoData, contributors, languages } = result;

  const languageData = languages 
    ? Object.entries(languages).map(([name, bytes]) => ({ name, value: bytes }))
    : [];

  const contributorData = contributors?.map(c => ({
    name: c.login,
    contributions: c.contributions
  })) || [];

  const complexityColor = {
    Low: 'text-green-400',
    Medium: 'text-yellow-400',
    High: 'text-red-400'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, staggerChildren: 0.1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl p-6 border border-gray-600">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-100 mb-2">
              {repoData?.name || result.fileName || 'Document Analysis'}
            </h2>
            <p className="text-gray-400">{aiInsights.summary}</p>
          </div>
          {repoData && (
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4" />
                <span>{repoData.stargazers_count}</span>
              </div>
              <div className="flex items-center space-x-1">
                <GitBranch className="w-4 h-4" />
                <span>{repoData.forks_count}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Insights */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Key Features */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-600">
            <div className="flex items-center space-x-3 mb-4">
              <Brain className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-gray-200">Key Features</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {aiInsights.keyFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3"
                >
                  <span className="text-gray-200 text-sm">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Technologies */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-600">
            <div className="flex items-center space-x-3 mb-4">
              <Code className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-gray-200">Technologies</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {aiInsights.technologies.map((tech, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm"
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Use Cases */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-600">
            <div className="flex items-center space-x-3 mb-4">
              <Lightbulb className="w-5 h-5 text-yellow-400" />
              <h3 className="text-lg font-semibold text-gray-200">Potential Use Cases</h3>
            </div>
            <div className="space-y-3">
              {aiInsights.useCases.map((useCase, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-3 p-3 bg-yellow-500/5 border border-yellow-500/10 rounded-lg"
                >
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-200 text-sm">{useCase}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Analytics Panel */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Project Stats */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-600">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Project Overview</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Complexity</span>
                <span className={`font-medium ${complexityColor[aiInsights.complexity]}`}>
                  {aiInsights.complexity}
                </span>
              </div>
              {repoData && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Language</span>
                    <span className="text-gray-200">{repoData.language || 'Mixed'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Created</span>
                    <span className="text-gray-200">
                      {new Date(repoData.created_at).getFullYear()}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Languages */}
          {languageData.length > 0 && (
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-600">
              <h3 className="text-lg font-semibold text-gray-200 mb-4">Languages</h3>
              <div className="space-y-3">
                {languageData.slice(0, 5).map((lang, index) => {
                  const percentage = (lang.value / languageData.reduce((sum, l) => sum + l.value, 0)) * 100;
                  return (
                    <div key={lang.name} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">{lang.name}</span>
                        <span className="text-gray-400">{percentage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ delay: index * 0.1, duration: 0.8 }}
                          className="h-2 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Contributors */}
          {contributorData.length > 0 && (
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-600">
              <div className="flex items-center space-x-3 mb-4">
                <Users className="w-5 h-5 text-green-400" />
                <h3 className="text-lg font-semibold text-gray-200">Top Contributors</h3>
              </div>
              <div className="space-y-3">
                {contributorData.slice(0, 5).map((contributor, index) => (
                  <motion.div
                    key={contributor.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-2 bg-green-500/5 rounded-lg"
                  >
                    <span className="text-gray-300 text-sm">{contributor.name}</span>
                    <span className="text-green-400 text-sm font-medium">
                      {contributor.contributions}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendation */}
          <div className="bg-gradient-to-r from-purple-800/20 to-blue-800/20 rounded-xl p-6 border border-purple-500/20">
            <div className="flex items-center space-x-3 mb-3">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-gray-200">Recommendation</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">{aiInsights.recommendation}</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};