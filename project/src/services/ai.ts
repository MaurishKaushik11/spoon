import { AIInsights } from '../types';

export class AIService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async analyzeContent(content: string, type: 'github' | 'document', repoData?: any): Promise<AIInsights> {
    // If no API key, return mock data
    if (!this.apiKey || this.apiKey === 'your-openai-api-key-here') {
      return this.createMockInsights(content, type, repoData);
    }

    const prompt = this.buildPrompt(content, type, repoData);
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are an expert technical analyst. Analyze the provided content and return insights in the exact JSON format requested.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error('AI analysis failed');
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;
      
      // Parse JSON response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback if JSON parsing fails
      return this.createFallbackInsights(content, type, repoData);
    } catch (error) {
      console.error('AI Analysis Error:', error);
      return this.createFallbackInsights(content, type, repoData);
    }
  }

  private buildPrompt(content: string, type: 'github' | 'document', repoData?: any): string {
    const basePrompt = `
Analyze the following ${type === 'github' ? 'GitHub repository' : 'document'} content and provide insights in this exact JSON format:

{
  "summary": "A concise 2-3 sentence summary of what this project/document is about",
  "keyFeatures": ["feature1", "feature2", "feature3"],
  "technologies": ["tech1", "tech2", "tech3"],
  "useCases": ["use case 1", "use case 2", "use case 3"],
  "mainSections": ["section1", "section2", "section3"],
  "complexity": "Low|Medium|High",
  "recommendation": "A brief recommendation about this project/document"
}

Content to analyze:
${content.substring(0, 3000)}

${repoData ? `
Repository metadata:
- Name: ${repoData.name}
- Language: ${repoData.language}
- Stars: ${repoData.stargazers_count}
- Description: ${repoData.description}
` : ''}

Please analyze thoroughly and provide actionable insights.`;

    return basePrompt;
  }

  private createMockInsights(content: string, type: 'github' | 'document', repoData?: any): AIInsights {
    if (type === 'github' && repoData) {
      return {
        summary: `${repoData.name} is a ${repoData.language || 'multi-language'} project with ${repoData.stargazers_count} stars. ${repoData.description || 'This repository contains code and documentation for a software project.'}`,
        keyFeatures: [
          `${repoData.language || 'Multi-language'} implementation`,
          'Open source community project',
          'Active development and maintenance',
          'Comprehensive documentation'
        ],
        technologies: [
          repoData.language || 'JavaScript',
          'Git version control',
          'GitHub hosting',
          'Open source licensing'
        ],
        useCases: [
          'Software development and learning',
          'Integration into larger projects',
          'Reference implementation for best practices',
          'Community collaboration and contribution'
        ],
        mainSections: ['Core functionality', 'Documentation', 'Examples', 'Configuration'],
        complexity: repoData.stargazers_count > 1000 ? 'High' : repoData.stargazers_count > 100 ? 'Medium' : 'Low',
        recommendation: `This ${repoData.language || 'software'} project appears well-maintained with ${repoData.stargazers_count} stars. Consider exploring the documentation and examples to understand its capabilities and potential integration points.`
      };
    }

    return {
      summary: `This ${type === 'github' ? 'repository' : 'document'} contains technical content with various components and features that can be analyzed for insights.`,
      keyFeatures: ['Comprehensive content structure', 'Technical documentation', 'Implementation details', 'Usage examples'],
      technologies: ['Modern development practices', 'Documentation standards', 'Version control', 'Open source principles'],
      useCases: ['Learning and education', 'Reference implementation', 'Development tool', 'Technical documentation'],
      mainSections: ['Introduction', 'Core concepts', 'Implementation', 'Examples'],
      complexity: 'Medium',
      recommendation: 'Review the content structure and documentation to understand the project scope and potential applications in your workflow.'
    };
  }

  private createFallbackInsights(content: string, type: 'github' | 'document', repoData?: any): AIInsights {
    return this.createMockInsights(content, type, repoData);
  }
}