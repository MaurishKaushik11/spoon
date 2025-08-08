import axios from 'axios';
import { GitHubRepo, GitHubContributor, GitHubCommit } from '../types';

const GITHUB_API_BASE = 'https://api.github.com';

export class GitHubService {
  private async makeRequest(url: string) {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('GitHub API Error:', error);
      throw new Error('Failed to fetch data from GitHub');
    }
  }

  async getRepository(owner: string, repo: string): Promise<GitHubRepo> {
    return await this.makeRequest(`${GITHUB_API_BASE}/repos/${owner}/${repo}`);
  }

  async getContributors(owner: string, repo: string): Promise<GitHubContributor[]> {
    const contributors = await this.makeRequest(`${GITHUB_API_BASE}/repos/${owner}/${repo}/contributors?per_page=10`);
    return contributors.slice(0, 5); // Top 5 contributors
  }

  async getCommits(owner: string, repo: string): Promise<GitHubCommit[]> {
    const commits = await this.makeRequest(`${GITHUB_API_BASE}/repos/${owner}/${repo}/commits?per_page=20`);
    return commits;
  }

  async getLanguages(owner: string, repo: string): Promise<Record<string, number>> {
    return await this.makeRequest(`${GITHUB_API_BASE}/repos/${owner}/${repo}/languages`);
  }

  async getReadme(owner: string, repo: string): Promise<string> {
    try {
      const readme = await this.makeRequest(`${GITHUB_API_BASE}/repos/${owner}/${repo}/readme`);
      // Decode base64 content
      return atob(readme.content.replace(/\n/g, ''));
    } catch (error) {
      return '';
    }
  }

  parseGitHubUrl(url: string): { owner: string; repo: string } | null {
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) return null;
    return {
      owner: match[1],
      repo: match[2]
    };
  }
}