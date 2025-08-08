import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import { Brain, Github, FileText, Sparkles } from 'lucide-react';

import { GitHubInput } from './components/GitHubInput';
import { FileUpload } from './components/FileUpload';
import { LoadingSpinner } from './components/LoadingSpinner';
import { InsightsDashboard } from './components/InsightsDashboard';

import { GitHubService } from './services/github';
import { DocumentService } from './services/document';
import { AIService } from './services/ai';
import { AnalysisResult } from './types';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || 'your-openai-api-key-here';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<'github' | 'document'>('github');

  const gitHubService = new GitHubService();
  const documentService = new DocumentService();
  const aiService = new AIService(OPENAI_API_KEY);

  const handleGitHubAnalysis = async (url: string) => {
    setIsLoading(true);
    try {
      const parsed = gitHubService.parseGitHubUrl(url);
      if (!parsed) {
        throw new Error('Invalid GitHub URL');
      }

      toast.loading('Fetching repository data...', { id: 'analysis' });

      const [repoData, contributors, commits, languages, readme] = await Promise.all([
        gitHubService.getRepository(parsed.owner, parsed.repo),
        gitHubService.getContributors(parsed.owner, parsed.repo).catch(() => []),
        gitHubService.getCommits(parsed.owner, parsed.repo).catch(() => []),
        gitHubService.getLanguages(parsed.owner, parsed.repo).catch(() => ({})),
        gitHubService.getReadme(parsed.owner, parsed.repo).catch(() => ''),
      ]);

      toast.loading('Analyzing with AI...', { id: 'analysis' });

      const content = `${repoData.description || ''}\n\n${readme}`;
      const aiInsights = await aiService.analyzeContent(content, 'github', repoData);

      const analysisResult: AnalysisResult = {
        type: 'github',
        repoData,
        contributors,
        commits,
        languages,
        aiInsights,
      };

      setResult(analysisResult);
      toast.success('Analysis complete!', { id: 'analysis' });
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Failed to analyze repository', { id: 'analysis' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDocumentAnalysis = async (file: File) => {
    setIsLoading(true);
    try {
      toast.loading('Processing document...', { id: 'analysis' });

      let content = '';
      const fileType = file.type;

      if (fileType === 'application/pdf') {
        content = await documentService.parsePDF(file);
      } else if (file.name.endsWith('.md')) {
        content = await documentService.parseMarkdown(file);
      } else {
        content = await documentService.parseTextFile(file);
      }

      if (!content.trim()) {
        throw new Error('No content found in document');
      }

      toast.loading('Analyzing with AI...', { id: 'analysis' });

      const aiInsights = await aiService.analyzeContent(content, 'document');

      const analysisResult: AnalysisResult = {
        type: 'document',
        documentContent: content,
        fileName: file.name,
        aiInsights,
      };

      setResult(analysisResult);
      toast.success('Analysis complete!', { id: 'analysis' });
    } catch (error) {
      console.error('Document analysis error:', error);
      toast.error('Failed to analyze document', { id: 'analysis' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#1F2937',
            color: '#F3F4F6',
            border: '1px solid #374151'
          }
        }}
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"
            >
              <Brain className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Spoon
            </h1>
          </div>
          <p className="text-xl text-gray-300 mb-2">AI-Powered Project Insights Generator</p>
          <p className="text-gray-400">
            Analyze GitHub repositories and documents to get instant insights, use cases, and technical assessments
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              {isLoading ? (
                <LoadingSpinner message="Analyzing project with AI..." />
              ) : (
                <>
                  {/* Tab Navigation */}
                  <div className="flex justify-center mb-8">
                    <div className="bg-gray-800/50 p-1 rounded-xl border border-gray-600">
                      <button
                        onClick={() => setActiveTab('github')}
                        className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                          activeTab === 'github'
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                            : 'text-gray-400 hover:text-gray-200'
                        }`}
                      >
                        <Github className="w-4 h-4" />
                        <span>GitHub Repository</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('document')}
                        className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                          activeTab === 'document'
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                            : 'text-gray-400 hover:text-gray-200'
                        }`}
                      >
                        <FileText className="w-4 h-4" />
                        <span>Document Upload</span>
                      </button>
                    </div>
                  </div>

                  {/* Input Content */}
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: activeTab === 'github' ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gray-800/30 backdrop-blur-sm border border-gray-600 rounded-2xl p-8"
                  >
                    {activeTab === 'github' ? (
                      <GitHubInput onSubmit={handleGitHubAnalysis} isLoading={isLoading} />
                    ) : (
                      <FileUpload onFileSelect={handleDocumentAnalysis} isLoading={isLoading} />
                    )}
                  </motion.div>

                  {/* Features Grid */}
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center"
                  >
                    <div className="bg-gray-800/20 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                      <Sparkles className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                      <h3 className="font-semibold text-gray-200 mb-2">AI-Powered Analysis</h3>
                      <p className="text-sm text-gray-400">
                        Advanced AI models analyze your code and generate comprehensive insights
                      </p>
                    </div>
                    <div className="bg-gray-800/20 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                      <Github className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                      <h3 className="font-semibold text-gray-200 mb-2">GitHub Integration</h3>
                      <p className="text-sm text-gray-400">
                        Real-time data fetching from GitHub repositories with contributor analytics
                      </p>
                    </div>
                    <div className="bg-gray-800/20 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                      <FileText className="w-8 h-8 text-green-400 mx-auto mb-3" />
                      <h3 className="font-semibold text-gray-200 mb-2">Document Processing</h3>
                      <p className="text-sm text-gray-400">
                        Support for PDF, Markdown, and text files with intelligent content extraction
                      </p>
                    </div>
                  </motion.div>
                </>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-100">Analysis Results</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleReset}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition-all duration-200"
                >
                  Analyze Another
                </motion.button>
              </div>
              <InsightsDashboard result={result} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;