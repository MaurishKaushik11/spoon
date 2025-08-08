export interface GitHubRepo {
  name: string;
  full_name: string;
  description: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  created_at: string;
  updated_at: string;
  html_url: string;
  topics: string[];
  license?: {
    name: string;
  };
}

export interface GitHubContributor {
  login: string;
  contributions: number;
  avatar_url: string;
  html_url: string;
}

export interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
}

export interface AIInsights {
  summary: string;
  keyFeatures: string[];
  technologies: string[];
  useCases: string[];
  mainSections?: string[];
  complexity: 'Low' | 'Medium' | 'High';
  recommendation: string;
}

export interface AnalysisResult {
  type: 'github' | 'document';
  repoData?: GitHubRepo;
  contributors?: GitHubContributor[];
  commits?: GitHubCommit[];
  documentContent?: string;
  fileName?: string;
  aiInsights: AIInsights;
  languages?: Record<string, number>;
}