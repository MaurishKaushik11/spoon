import { AIInsights } from '../types';

export type AIProvider = 'openai' | 'anthropic' | 'gemini' | 'groq' | 'huggingface';

export interface AIConfig {
  provider: AIProvider;
  apiKey: string;
  model?: string;
}

export class AIService {
  private config: AIConfig;

  constructor(apiKey: string, provider: AIProvider = 'openai', model?: string) {
    this.config = {
      provider,
      apiKey,
      model: model || this.getDefaultModel(provider)
    };
  }

  private getDefaultModel(provider: AIProvider): string {
    switch (provider) {
      case 'openai': return 'gpt-4o-mini';
      case 'anthropic': return 'claude-3-haiku-20240307';
      case 'gemini': return 'gemini-1.5-flash';
      case 'groq': return 'llama-3.1-8b-instant';
      case 'huggingface': return 'microsoft/DialoGPT-medium';
      default: return 'gpt-4o-mini';
    }
  }

  async analyzeContent(content: string, type: 'github' | 'document', repoData?: any): Promise<AIInsights> {
    // If no API key, return enhanced content analysis
    if (!this.config.apiKey || this.config.apiKey === 'your-openai-api-key-here' || this.config.apiKey.includes('your-') || this.config.apiKey.includes('abcd')) {
      console.log('No valid API key provided, using enhanced content analysis');
      return this.createFallbackInsights(content, type, repoData);
    }

    console.log(`Starting AI analysis with ${this.config.provider.toUpperCase()} API...`);
    console.log('Provider:', this.config.provider);
    console.log('Model:', this.config.model);
    console.log('Content type:', type);
    console.log('Content length:', content.length);

    const prompt = this.buildPrompt(content, type, repoData);
    
    try {
      console.log(`Making API request to ${this.config.provider}...`);
      
      let response;
      switch (this.config.provider) {
        case 'openai':
          response = await this.callOpenAI(prompt);
          break;
        case 'anthropic':
          response = await this.callAnthropic(prompt);
          break;
        case 'gemini':
          response = await this.callGemini(prompt);
          break;
        case 'groq':
          response = await this.callGroq(prompt);
          break;
        case 'huggingface':
          response = await this.callHuggingFace(prompt);
          break;
        default:
          throw new Error(`Unsupported AI provider: ${this.config.provider}`);
      }

      console.log('AI analysis successful with', this.config.provider);
      return response;
      
    } catch (error) {
      console.error(`${this.config.provider.toUpperCase()} AI Analysis Error:`, error);
      console.log('Error details:', error.message);
      console.log('Falling back to enhanced content-based insights');
      return this.createFallbackInsights(content, type, repoData);
    }
  }

  private async callOpenAI(prompt: string): Promise<AIInsights> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: [
          {
            role: 'system',
            content: 'You are a high-efficiency document analyzer. Provide precise, specific insights based on actual content. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.3,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content;
    
    if (!aiResponse) {
      throw new Error('No response from OpenAI');
    }

    return this.parseAIResponse(aiResponse);
  }

  private async callAnthropic(prompt: string): Promise<AIInsights> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.config.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: this.config.model,
        max_tokens: 1500,
        temperature: 0.3,
        messages: [
          {
            role: 'user',
            content: `You are a high-efficiency document analyzer. Provide precise, specific insights based on actual content. Always respond with valid JSON only.\n\n${prompt}`
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Anthropic API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const aiResponse = data.content[0]?.text;
    
    if (!aiResponse) {
      throw new Error('No response from Anthropic');
    }

    return this.parseAIResponse(aiResponse);
  }

  private async callGemini(prompt: string): Promise<AIInsights> {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${this.config.model}:generateContent?key=${this.config.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are a high-efficiency document analyzer. Provide precise, specific insights based on actual content. Always respond with valid JSON only.\n\n${prompt}`
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1500,
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Gemini API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!aiResponse) {
      throw new Error('No response from Gemini');
    }

    return this.parseAIResponse(aiResponse);
  }

  private async callGroq(prompt: string): Promise<AIInsights> {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: [
          {
            role: 'system',
            content: 'You are a high-efficiency document analyzer. Provide precise, specific insights based on actual content. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Groq API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content;
    
    if (!aiResponse) {
      throw new Error('No response from Groq');
    }

    return this.parseAIResponse(aiResponse);
  }

  private async callHuggingFace(prompt: string): Promise<AIInsights> {
    const response = await fetch(`https://api-inference.huggingface.co/models/${this.config.model}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: `You are a high-efficiency document analyzer. Provide precise, specific insights based on actual content. Always respond with valid JSON only.\n\n${prompt}`,
        parameters: {
          max_new_tokens: 1500,
          temperature: 0.3,
          return_full_text: false
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`HuggingFace API error: ${response.status} - ${errorData.error || 'Unknown error'}`);
    }

    const data = await response.json();
    const aiResponse = Array.isArray(data) ? data[0]?.generated_text : data.generated_text;
    
    if (!aiResponse) {
      throw new Error('No response from HuggingFace');
    }

    return this.parseAIResponse(aiResponse);
  }

  private parseAIResponse(aiResponse: string): AIInsights {
    console.log('Parsing AI response...');
    console.log('Response preview:', aiResponse.substring(0, 200));
    
    try {
      const parsedResponse = JSON.parse(aiResponse);
      console.log('AI response parsed successfully');
      return parsedResponse;
    } catch (parseError) {
      console.warn('JSON parsing failed, trying regex extraction...');
      console.log('Parse error:', parseError.message);
      
      // Try to extract JSON from the response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]);
        } catch (e) {
          console.warn('Regex extraction also failed');
        }
      }
      
      // Try to extract content between ```json blocks
      const codeBlockMatch = aiResponse.match(/```json\s*([\s\S]*?)\s*```/);
      if (codeBlockMatch) {
        try {
          return JSON.parse(codeBlockMatch[1]);
        } catch (e) {
          console.warn('Code block extraction failed');
        }
      }
      
      throw new Error('Failed to parse AI response as JSON');
    }
  }

  private buildPrompt(content: string, type: 'github' | 'document', repoData?: any): string {
    if (type === 'document' && (content.includes('ACTUAL EXTRACTED CONTENT:') || content.includes('INTELLIGENT CONTENT ANALYSIS:'))) {
      // High-efficiency prompt for real PDF content analysis
      return `
You are a high-efficiency AI document analyzer. Analyze the following PDF content and provide precise, actionable insights.

TASK: Extract specific, concrete information from the actual document content provided below.

OUTPUT FORMAT (JSON only, no additional text):
{
  "summary": "Specific 2-3 sentence summary based on actual content (mention specific names, topics, or details found)",
  "keyFeatures": ["specific feature 1 from content", "actual element 2 found", "real characteristic 3 identified", "concrete detail 4", "specific aspect 5"],
  "technologies": ["actual technology 1", "real tool/method 2", "specific system 3", "mentioned framework 4", "identified platform 5"],
  "useCases": ["specific use case 1 from content", "real application 2 mentioned", "actual purpose 3 identified", "concrete scenario 4"],
  "mainSections": ["actual section 1", "real heading 2", "specific part 3", "identified topic 4", "mentioned area 5"],
  "complexity": "Low|Medium|High",
  "recommendation": "Specific, actionable recommendation based on actual document content and identified purpose"
}

ANALYSIS RULES:
1. Extract ONLY information explicitly mentioned in the content
2. Include specific names, companies, technologies, dates, numbers when found
3. Identify actual document structure and sections
4. Base complexity on content depth and technical detail level
5. Provide actionable recommendations relevant to the document type

CONTENT TO ANALYZE:
${content.substring(0, 8000)}

Analyze this content and return ONLY the JSON response with specific, extracted information.`;
    }

    const basePrompt = type === 'github' ? `
You are analyzing a GitHub repository. Extract specific information from the README content and repository metadata to provide precise insights.

REPOSITORY: ${repoData?.name || 'Unknown'}
LANGUAGE: ${repoData?.language || 'Unknown'}
STARS: ${repoData?.stargazers_count || 0}
DESCRIPTION: ${repoData?.description || 'No description'}

README CONTENT:
${content.substring(0, 4000)}

OUTPUT FORMAT (JSON only):
{
  "summary": "Specific summary mentioning the actual project name, purpose, and key details from README",
  "keyFeatures": ["actual feature 1 from README", "real functionality 2", "specific capability 3", "concrete feature 4", "actual feature 5"],
  "technologies": ["${repoData?.language || 'primary-language'}", "framework/library mentioned", "tool mentioned", "technology from content", "platform mentioned"],
  "useCases": ["specific use case from README", "real application mentioned", "actual scenario described", "concrete implementation"],
  "mainSections": ["actual section from README", "real heading found", "specific part mentioned"],
  "complexity": "Low|Medium|High",
  "recommendation": "Specific recommendation based on the actual project details, stars (${repoData?.stargazers_count || 0}), and README content"
}

ANALYSIS RULES:
1. Extract information ONLY from the actual README content provided
2. Use the real project name: ${repoData?.name || 'this project'}
3. Mention specific technologies, frameworks, or tools found in the content
4. Base complexity on actual content depth, repository size, and star count
5. Include real section headers from the README in mainSections
6. Make recommendations specific to this particular project

Analyze the actual content and return ONLY the JSON response.` : `
Analyze the following document content and provide insights in this exact JSON format:

{
  "summary": "A concise 2-3 sentence summary of what this document is about",
  "keyFeatures": ["feature1", "feature2", "feature3"],
  "technologies": ["tech1", "tech2", "tech3"],
  "useCases": ["use case 1", "use case 2", "use case 3"],
  "mainSections": ["section1", "section2", "section3"],
  "complexity": "Low|Medium|High",
  "recommendation": "A brief recommendation about this document"
}

Content to analyze:
${content.substring(0, 3000)}

Please analyze thoroughly and provide actionable insights.`;

    return basePrompt;
  }

  private createMockInsights(content: string, type: 'github' | 'document', repoData?: any): AIInsights {
    if (type === 'github' && repoData) {
      // Analyze actual README content instead of using generic templates
      return this.createGitHubContentAnalysis(content, repoData);
    }

    // Handle real PDF content extraction
    if (type === 'document' && (content.includes('ACTUAL EXTRACTED CONTENT:') || content.includes('INTELLIGENT CONTENT ANALYSIS:'))) {
      return this.createRealContentInsights(content);
    }

    // Enhanced document analysis based on content
    const contentLower = content.toLowerCase();
    
    // Detect document type from content - much more comprehensive analysis
    if (contentLower.includes('resume') || contentLower.includes('cv') || 
        contentLower.includes('professional summary') || contentLower.includes('work experience')) {
      
      // Extract insights from the content
      const fileSize = contentLower.match(/(\d+)kb/)?.[1] || '0';
      const isComprehensive = parseInt(fileSize) > 200;
      
      return {
        summary: `This is a professional resume/CV document (${fileSize}KB) showcasing career experience, educational background, and technical competencies. ${isComprehensive ? 'The substantial size suggests comprehensive career documentation with detailed project descriptions.' : 'The concise format indicates a focused presentation of key qualifications.'}`,
        keyFeatures: [
          'Professional work experience and career progression',
          'Educational qualifications and certifications',
          'Technical skills and programming competencies',
          'Project portfolio and key achievements',
          'Contact information and professional links',
          'Industry-specific expertise demonstration'
        ],
        technologies: [
          'Professional documentation standards',
          'Career development frameworks',
          'Skills assessment methodologies',
          'Portfolio presentation techniques',
          'ATS-compatible formatting',
          'Professional branding strategies'
        ],
        useCases: [
          'Job applications and recruitment processes',
          'Professional networking and LinkedIn optimization',
          'Career advancement and promotion discussions',
          'Freelance and consulting opportunity presentations',
          'Skills gap analysis and development planning',
          'Professional portfolio development'
        ],
        mainSections: ['Contact & Summary', 'Professional Experience', 'Education & Certifications', 'Technical Skills', 'Projects & Achievements', 'Additional Qualifications'],
        complexity: isComprehensive ? 'Medium' : 'Low',
        recommendation: `This professional document demonstrates ${isComprehensive ? 'extensive' : 'focused'} career experience. For optimal impact: ensure ATS compatibility, quantify achievements with metrics, tailor content to target roles, and maintain consistent formatting. Consider adding specific project outcomes and measurable results to strengthen the presentation.`
      };
    }
    
    if (contentLower.includes('report') || contentLower.includes('analysis') || 
        contentLower.includes('findings') || contentLower.includes('methodology') ||
        contentLower.includes('executive summary') || contentLower.includes('research')) {
      
      const fileSize = contentLower.match(/(\d+)kb/)?.[1] || '0';
      const isDetailed = parseInt(fileSize) > 300;
      
      return {
        summary: `This is a comprehensive research report/analysis document (${fileSize}KB) containing structured findings, methodology, and recommendations. ${isDetailed ? 'The extensive size indicates in-depth analysis with detailed data presentation and comprehensive conclusions.' : 'The focused format suggests targeted analysis with key insights and actionable recommendations.'}`,
        keyFeatures: [
          'Executive summary with key findings',
          'Structured research methodology',
          'Data analysis and statistical results',
          'Visual charts and data representations',
          'Evidence-based conclusions',
          'Actionable recommendations and next steps'
        ],
        technologies: [
          'Research methodologies and frameworks',
          'Data analysis and statistical tools',
          'Visualization and reporting platforms',
          'Survey and data collection systems',
          'Statistical analysis software',
          'Report generation and formatting tools'
        ],
        useCases: [
          'Strategic business decision making',
          'Academic research and publication',
          'Policy development and implementation',
          'Market analysis and competitive intelligence',
          'Performance evaluation and improvement',
          'Grant applications and funding proposals'
        ],
        mainSections: ['Executive Summary', 'Introduction & Background', 'Methodology', 'Findings & Results', 'Discussion & Analysis', 'Conclusions & Recommendations'],
        complexity: 'High',
        recommendation: `This analytical document provides ${isDetailed ? 'comprehensive' : 'focused'} insights for decision-making. Key considerations: validate methodology rigor, assess sample size adequacy, review statistical significance, evaluate recommendation feasibility, and consider implementation timelines. The findings should be cross-referenced with current market conditions and organizational capabilities.`
      };
    }

    if (contentLower.includes('proposal') || contentLower.includes('plan') || 
        contentLower.includes('project overview') || contentLower.includes('timeline')) {
      
      const fileSize = contentLower.match(/(\d+)kb/)?.[1] || '0';
      const isComplex = parseInt(fileSize) > 250;
      
      return {
        summary: `This is a project proposal/plan document (${fileSize}KB) outlining objectives, methodology, timeline, and resource requirements. ${isComplex ? 'The comprehensive size suggests a complex project with detailed planning and extensive resource allocation.' : 'The focused format indicates a well-defined project with clear scope and deliverables.'}`,
        keyFeatures: [
          'Clear project objectives and scope definition',
          'Detailed methodology and technical approach',
          'Comprehensive timeline with key milestones',
          'Resource allocation and budget planning',
          'Risk assessment and mitigation strategies',
          'Success criteria and evaluation metrics'
        ],
        technologies: [
          'Project management methodologies',
          'Planning and scheduling tools',
          'Resource management systems',
          'Risk assessment frameworks',
          'Budget planning and tracking',
          'Stakeholder communication platforms'
        ],
        useCases: [
          'Project funding and approval processes',
          'Stakeholder alignment and buy-in',
          'Resource allocation and team planning',
          'Timeline management and milestone tracking',
          'Risk management and contingency planning',
          'Performance monitoring and evaluation'
        ],
        mainSections: ['Project Overview', 'Background & Justification', 'Technical Approach', 'Timeline & Milestones', 'Resources & Budget', 'Risk Management'],
        complexity: isComplex ? 'High' : 'Medium',
        recommendation: `This project proposal demonstrates ${isComplex ? 'sophisticated' : 'well-structured'} planning. Critical success factors: ensure stakeholder alignment, validate resource availability, assess timeline feasibility, review budget accuracy, and establish clear success metrics. Consider conducting a pilot phase for complex implementations.`
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

  private createRealContentInsights(content: string): AIInsights {
    // Extract actual content from the PDF analysis
    const actualContentMatch = content.match(/(?:ACTUAL EXTRACTED CONTENT|INTELLIGENT CONTENT ANALYSIS):\s*([\s\S]*?)(?=\n\n(?:DOCUMENT STRUCTURE ANALYSIS|DOCUMENT INSIGHTS|CONTENT CHARACTERISTICS):|$)/);
    const actualContent = actualContentMatch ? actualContentMatch[1].trim() : '';
    
    // Extract metadata
    const fileSizeMatch = content.match(/File Size: (\d+)KB/);
    const pageCountMatch = content.match(/Pages: (\d+)/);
    const wordCountMatch = content.match(/Word Count: ~(\d+)/);
    
    const fileSize = fileSizeMatch ? parseInt(fileSizeMatch[1]) : 0;
    const pageCount = pageCountMatch ? parseInt(pageCountMatch[1]) : 1;
    const wordCount = wordCountMatch ? parseInt(wordCountMatch[1]) : 0;
    
    // Analyze actual content for specific insights
    const contentLower = actualContent.toLowerCase();
    const lines = actualContent.split('\n').filter(line => line.trim());
    
    // Extract specific technologies, names, and details mentioned
    const technologies = this.extractTechnologies(actualContent);
    const keyFeatures = this.extractKeyFeatures(actualContent, contentLower);
    const mainSections = this.extractMainSections(actualContent);
    const useCases = this.extractUseCases(actualContent, contentLower);
    
    // Determine document type and complexity
    const documentType = this.determineDocumentType(contentLower);
    const complexity = this.assessComplexity(actualContent, fileSize, pageCount, wordCount);
    
    // Create personalized summary
    const summary = this.createPersonalizedSummary(actualContent, documentType, fileSize, pageCount, wordCount);
    
    // Create specific recommendation
    const recommendation = this.createSpecificRecommendation(actualContent, documentType, complexity);
    
    return {
      summary,
      keyFeatures,
      technologies,
      useCases,
      mainSections,
      complexity,
      recommendation
    };
  }

  private extractTechnologies(content: string): string[] {
    const technologies = new Set<string>();
    const contentLower = content.toLowerCase();
    
    // Common technology patterns
    const techPatterns = [
      /\b(javascript|python|java|c\+\+|c#|php|ruby|go|rust|swift|kotlin|typescript)\b/gi,
      /\b(react|angular|vue|node\.?js|express|django|flask|spring|laravel)\b/gi,
      /\b(mysql|postgresql|mongodb|redis|elasticsearch|sqlite)\b/gi,
      /\b(aws|azure|gcp|docker|kubernetes|jenkins|git|github|gitlab)\b/gi,
      /\b(html|css|sass|less|bootstrap|tailwind)\b/gi,
      /\b(api|rest|graphql|json|xml|yaml)\b/gi
    ];
    
    techPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(match => technologies.add(match.toLowerCase()));
      }
    });
    
    // If no specific technologies found, infer from document type
    if (technologies.size === 0) {
      if (contentLower.includes('resume') || contentLower.includes('cv')) {
        technologies.add('Professional documentation');
        technologies.add('Career development');
      } else if (contentLower.includes('report') || contentLower.includes('analysis')) {
        technologies.add('Data analysis');
        technologies.add('Research methodology');
      } else {
        technologies.add('Document processing');
        technologies.add('Content management');
      }
    }
    
    return Array.from(technologies).slice(0, 6);
  }

  private extractKeyFeatures(content: string, contentLower: string): string[] {
    const features = [];
    
    // Look for specific features in the content
    if (contentLower.includes('experience') || contentLower.includes('work')) {
      features.push('Professional experience documentation');
    }
    if (contentLower.includes('education') || contentLower.includes('degree')) {
      features.push('Educational background details');
    }
    if (contentLower.includes('skill') || contentLower.includes('technical')) {
      features.push('Technical skills and competencies');
    }
    if (contentLower.includes('project') || contentLower.includes('portfolio')) {
      features.push('Project portfolio and achievements');
    }
    if (contentLower.includes('contact') || contentLower.includes('email') || contentLower.includes('phone')) {
      features.push('Contact information and networking details');
    }
    if (contentLower.includes('summary') || contentLower.includes('objective')) {
      features.push('Professional summary and career objectives');
    }
    
    // Extract specific company names, technologies, or unique elements
    const specificElements = this.extractSpecificElements(content);
    features.push(...specificElements);
    
    return features.slice(0, 6);
  }

  private extractSpecificElements(content: string): string[] {
    const elements = [];
    
    // Look for company names (capitalized words that might be companies)
    const companyPattern = /\b[A-Z][a-z]+ (?:Inc|LLC|Corp|Corporation|Company|Ltd|Limited|Technologies|Systems|Solutions)\b/g;
    const companies = content.match(companyPattern);
    if (companies && companies.length > 0) {
      elements.push(`Experience with ${companies[0]} and similar organizations`);
    }
    
    // Look for specific years or time periods
    const yearPattern = /\b(19|20)\d{2}\b/g;
    const years = content.match(yearPattern);
    if (years && years.length > 1) {
      const minYear = Math.min(...years.map(y => parseInt(y)));
      const maxYear = Math.max(...years.map(y => parseInt(y)));
      elements.push(`Career span from ${minYear} to ${maxYear}`);
    }
    
    // Look for specific numbers or metrics
    const numberPattern = /\b\d+(?:\.\d+)?(?:%|percent|years?|months?|projects?|clients?|users?|million|thousand|k)\b/gi;
    const metrics = content.match(numberPattern);
    if (metrics && metrics.length > 0) {
      elements.push(`Quantified achievements and metrics`);
    }
    
    return elements;
  }

  private extractMainSections(content: string): string[] {
    const sections = [];
    const lines = content.split('\n');
    
    // Look for section headers (lines that are short and might be headers)
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.length > 3 && trimmed.length < 50 && 
          (trimmed.includes(':') || trimmed.match(/^[A-Z][A-Z\s]+$/) || 
           trimmed.match(/^[A-Z][a-z\s]+$/))) {
        sections.push(trimmed.replace(':', ''));
      }
    });
    
    // If no clear sections found, use common document sections
    if (sections.length === 0) {
      const contentLower = content.toLowerCase();
      if (contentLower.includes('summary')) sections.push('Professional Summary');
      if (contentLower.includes('experience')) sections.push('Work Experience');
      if (contentLower.includes('education')) sections.push('Education');
      if (contentLower.includes('skills')) sections.push('Technical Skills');
      if (contentLower.includes('project')) sections.push('Projects');
      if (contentLower.includes('contact')) sections.push('Contact Information');
    }
    
    return sections.slice(0, 6);
  }

  private extractUseCases(content: string, contentLower: string): string[] {
    const useCases = [];
    
    // Determine use cases based on document type and content
    if (contentLower.includes('resume') || contentLower.includes('cv')) {
      useCases.push('Job application and recruitment processes');
      useCases.push('Professional networking and career development');
      useCases.push('Skills assessment and career planning');
    } else if (contentLower.includes('report') || contentLower.includes('analysis')) {
      useCases.push('Strategic decision making and planning');
      useCases.push('Research validation and peer review');
      useCases.push('Policy development and implementation');
    } else if (contentLower.includes('proposal') || contentLower.includes('plan')) {
      useCases.push('Project approval and funding acquisition');
      useCases.push('Stakeholder alignment and communication');
      useCases.push('Resource planning and allocation');
    } else {
      useCases.push('Information reference and documentation');
      useCases.push('Knowledge sharing and collaboration');
      useCases.push('Process documentation and training');
    }
    
    return useCases.slice(0, 4);
  }

  private determineDocumentType(contentLower: string): string {
    if (contentLower.includes('resume') || contentLower.includes('cv')) return 'Resume/CV';
    if (contentLower.includes('report') || contentLower.includes('analysis')) return 'Research Report';
    if (contentLower.includes('proposal') || contentLower.includes('plan')) return 'Project Proposal';
    if (contentLower.includes('manual') || contentLower.includes('guide')) return 'Technical Manual';
    return 'Professional Document';
  }

  private assessComplexity(content: string, fileSize: number, pageCount: number, wordCount: number): 'Low' | 'Medium' | 'High' {
    let complexityScore = 0;
    
    // File size factor
    if (fileSize > 500) complexityScore += 2;
    else if (fileSize > 200) complexityScore += 1;
    
    // Page count factor
    if (pageCount > 10) complexityScore += 2;
    else if (pageCount > 5) complexityScore += 1;
    
    // Word count factor
    if (wordCount > 2000) complexityScore += 2;
    else if (wordCount > 1000) complexityScore += 1;
    
    // Content complexity factors
    const technicalTerms = (content.match(/\b(algorithm|methodology|framework|architecture|implementation|analysis|optimization|integration)\b/gi) || []).length;
    if (technicalTerms > 10) complexityScore += 2;
    else if (technicalTerms > 5) complexityScore += 1;
    
    if (complexityScore >= 5) return 'High';
    if (complexityScore >= 3) return 'Medium';
    return 'Low';
  }

  private createPersonalizedSummary(content: string, documentType: string, fileSize: number, pageCount: number, wordCount: number): string {
    const contentPreview = content.substring(0, 200).trim();
    
    return `This ${documentType.toLowerCase()} document (${fileSize}KB, ${pageCount} pages, ~${wordCount} words) contains specific content including: "${contentPreview}${content.length > 200 ? '...' : ''}". The document provides detailed information with authentic content extracted directly from the PDF.`;
  }

  private createSpecificRecommendation(content: string, documentType: string, complexity: string): string {
    const contentLower = content.toLowerCase();
    
    if (documentType === 'Resume/CV') {
      return `This ${complexity.toLowerCase()}-complexity resume contains specific details that should be tailored for target positions. Consider highlighting quantifiable achievements and ensuring ATS compatibility for optimal results.`;
    } else if (documentType === 'Research Report') {
      return `This ${complexity.toLowerCase()}-complexity research document provides detailed analysis. Validate the methodology and consider the findings' applicability to current contexts and decision-making processes.`;
    } else if (documentType === 'Project Proposal') {
      return `This ${complexity.toLowerCase()}-complexity proposal outlines specific project details. Review the timeline, budget, and resource requirements for feasibility and alignment with organizational capabilities.`;
    } else {
      return `This ${complexity.toLowerCase()}-complexity ${documentType.toLowerCase()} contains specific information that can be leveraged for its intended purpose. Review the content for accuracy and relevance to current needs.`;
    }
  }

  private createGitHubContentAnalysis(content: string, repoData: any): AIInsights {
    console.log('Analyzing GitHub repository content...');
    console.log('README content length:', content.length);
    console.log('Repository:', repoData.name, 'Language:', repoData.language);
    
    const readmeContent = content.toLowerCase();
    const originalContent = content;
    
    // Extract technologies from README content
    const technologies = this.extractGitHubTechnologies(originalContent, repoData);
    
    // Extract features from README
    const keyFeatures = this.extractGitHubFeatures(originalContent, readmeContent);
    
    // Extract use cases
    const useCases = this.extractGitHubUseCases(originalContent, readmeContent);
    
    // Extract main sections
    const mainSections = this.extractGitHubSections(originalContent);
    
    // Determine complexity
    const complexity = this.assessGitHubComplexity(originalContent, repoData);
    
    // Create summary
    const summary = this.createGitHubSummary(originalContent, repoData);
    
    // Create recommendation
    const recommendation = this.createGitHubRecommendation(originalContent, repoData, complexity);
    
    return {
      summary,
      keyFeatures,
      technologies,
      useCases,
      mainSections,
      complexity,
      recommendation
    };
  }

  private extractGitHubTechnologies(content: string, repoData: any): string[] {
    const technologies = new Set<string>();
    const contentLower = content.toLowerCase();
    
    // Add primary language
    if (repoData.language) {
      technologies.add(repoData.language);
    }
    
    // Common technology patterns in README files
    const techPatterns = [
      // Programming languages
      /\b(javascript|typescript|python|java|c\+\+|c#|php|ruby|go|rust|swift|kotlin|scala|dart|r|matlab)\b/gi,
      // Frontend frameworks
      /\b(react|angular|vue|svelte|next\.?js|nuxt|gatsby|ember)\b/gi,
      // Backend frameworks
      /\b(node\.?js|express|django|flask|spring|laravel|rails|fastapi|gin|fiber)\b/gi,
      // Databases
      /\b(mysql|postgresql|mongodb|redis|elasticsearch|sqlite|cassandra|dynamodb)\b/gi,
      // Cloud & DevOps
      /\b(aws|azure|gcp|docker|kubernetes|jenkins|terraform|ansible)\b/gi,
      // Tools & Libraries
      /\b(webpack|vite|babel|eslint|prettier|jest|cypress|playwright)\b/gi,
      // Mobile
      /\b(react native|flutter|ionic|xamarin|cordova)\b/gi
    ];
    
    techPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(match => technologies.add(match));
      }
    });
    
    // Look for package.json mentions
    if (contentLower.includes('package.json') || contentLower.includes('npm install')) {
      technologies.add('npm');
    }
    if (contentLower.includes('yarn')) {
      technologies.add('Yarn');
    }
    if (contentLower.includes('requirements.txt') || contentLower.includes('pip install')) {
      technologies.add('pip');
    }
    
    return Array.from(technologies).slice(0, 8);
  }

  private extractGitHubFeatures(content: string, contentLower: string): string[] {
    const features = [];
    
    // Look for feature sections
    const featurePatterns = [
      /(?:features?|capabilities|functionality):\s*\n((?:\s*[-*]\s*.+\n?)+)/gi,
      /(?:what (?:it )?does|overview):\s*\n((?:\s*[-*]\s*.+\n?)+)/gi,
      /(?:highlights|key points):\s*\n((?:\s*[-*]\s*.+\n?)+)/gi
    ];
    
    featurePatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const items = match.split('\n').filter(line => line.trim().match(/^[-*]\s/));
          items.forEach(item => {
            const cleanItem = item.replace(/^[-*]\s/, '').trim();
            if (cleanItem && cleanItem.length > 10 && cleanItem.length < 100) {
              features.push(cleanItem);
            }
          });
        });
      }
    });
    
    // If no explicit features found, infer from content
    if (features.length === 0) {
      if (contentLower.includes('api') || contentLower.includes('rest')) {
        features.push('RESTful API implementation');
      }
      if (contentLower.includes('dashboard') || contentLower.includes('ui')) {
        features.push('User interface and dashboard');
      }
      if (contentLower.includes('database') || contentLower.includes('data')) {
        features.push('Data management and storage');
      }
      if (contentLower.includes('auth') || contentLower.includes('login')) {
        features.push('Authentication and authorization');
      }
      if (contentLower.includes('test') || contentLower.includes('testing')) {
        features.push('Comprehensive testing suite');
      }
      if (contentLower.includes('deploy') || contentLower.includes('docker')) {
        features.push('Deployment and containerization');
      }
    }
    
    return features.slice(0, 6);
  }

  private extractGitHubUseCases(content: string, contentLower: string): string[] {
    const useCases = [];
    
    // Look for use case sections
    const useCasePatterns = [
      /(?:use cases?|applications?|examples?):\s*\n((?:\s*[-*]\s*.+\n?)+)/gi,
      /(?:perfect for|ideal for|great for):\s*\n((?:\s*[-*]\s*.+\n?)+)/gi
    ];
    
    useCasePatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const items = match.split('\n').filter(line => line.trim().match(/^[-*]\s/));
          items.forEach(item => {
            const cleanItem = item.replace(/^[-*]\s/, '').trim();
            if (cleanItem && cleanItem.length > 10) {
              useCases.push(cleanItem);
            }
          });
        });
      }
    });
    
    // Infer use cases from project type
    if (useCases.length === 0) {
      if (contentLower.includes('library') || contentLower.includes('package')) {
        useCases.push('Integration into other projects as a library');
        useCases.push('Building applications with enhanced functionality');
      }
      if (contentLower.includes('framework') || contentLower.includes('boilerplate')) {
        useCases.push('Starting point for new projects');
        useCases.push('Rapid application development');
      }
      if (contentLower.includes('tool') || contentLower.includes('cli')) {
        useCases.push('Development workflow automation');
        useCases.push('Command-line operations and scripting');
      }
      if (contentLower.includes('web') || contentLower.includes('app')) {
        useCases.push('Web application development');
        useCases.push('Production-ready web services');
      }
    }
    
    return useCases.slice(0, 5);
  }

  private extractGitHubSections(content: string): string[] {
    const sections = [];
    
    // Extract markdown headers
    const headerPattern = /^#+\s+(.+)$/gm;
    const matches = content.match(headerPattern);
    
    if (matches) {
      matches.forEach(match => {
        const section = match.replace(/^#+\s+/, '').trim();
        if (section && !section.toLowerCase().includes('table of contents')) {
          sections.push(section);
        }
      });
    }
    
    // Default sections if none found
    if (sections.length === 0) {
      sections.push('Installation', 'Usage', 'Documentation', 'Contributing');
    }
    
    return sections.slice(0, 6);
  }

  private assessGitHubComplexity(content: string, repoData: any): 'Low' | 'Medium' | 'High' {
    let complexityScore = 0;
    const contentLower = content.toLowerCase();
    
    // Repository metrics
    if (repoData.stargazers_count > 1000) complexityScore += 2;
    else if (repoData.stargazers_count > 100) complexityScore += 1;
    
    if (repoData.size > 10000) complexityScore += 2;
    else if (repoData.size > 1000) complexityScore += 1;
    
    // Content complexity indicators
    const complexTerms = (content.match(/\b(architecture|framework|microservices?|distributed|scalable|enterprise|production|deployment|ci\/cd|testing|docker|kubernetes)\b/gi) || []).length;
    if (complexTerms > 10) complexityScore += 2;
    else if (complexTerms > 5) complexityScore += 1;
    
    // Documentation length
    if (content.length > 5000) complexityScore += 1;
    if (content.length > 10000) complexityScore += 1;
    
    if (complexityScore >= 5) return 'High';
    if (complexityScore >= 3) return 'Medium';
    return 'Low';
  }

  private createGitHubSummary(content: string, repoData: any): string {
    const description = repoData.description || '';
    const language = repoData.language || 'multi-language';
    const stars = repoData.stargazers_count || 0;
    
    // Extract first meaningful paragraph from README
    const paragraphs = content.split('\n\n').filter(p => p.trim().length > 50);
    const firstParagraph = paragraphs[0] || '';
    
    let summary = `${repoData.name} is a ${language} project with ${stars} stars. `;
    
    if (description) {
      summary += `${description} `;
    }
    
    if (firstParagraph && !firstParagraph.toLowerCase().includes(repoData.name.toLowerCase())) {
      const cleanParagraph = firstParagraph.replace(/[#*`]/g, '').trim();
      summary += `${cleanParagraph.substring(0, 200)}${cleanParagraph.length > 200 ? '...' : ''}`;
    }
    
    return summary;
  }

  private createGitHubRecommendation(content: string, repoData: any, complexity: string): string {
    const contentLower = content.toLowerCase();
    const stars = repoData.stargazers_count || 0;
    const language = repoData.language || 'software';
    
    let recommendation = `This ${complexity.toLowerCase()}-complexity ${language} project `;
    
    if (stars > 1000) {
      recommendation += 'has strong community adoption and appears well-maintained. ';
    } else if (stars > 100) {
      recommendation += 'shows good community interest and active development. ';
    } else {
      recommendation += 'is in early stages but may offer unique functionality. ';
    }
    
    if (contentLower.includes('getting started') || contentLower.includes('installation')) {
      recommendation += 'The documentation includes setup instructions, making it accessible for new users. ';
    }
    
    if (contentLower.includes('contributing') || contentLower.includes('pull request')) {
      recommendation += 'The project welcomes contributions and has clear guidelines. ';
    }
    
    recommendation += `Consider exploring the ${repoData.language || 'codebase'} and documentation to understand integration possibilities.`;
    
    return recommendation;
  }

  private createFallbackInsights(content: string, type: 'github' | 'document', repoData?: any): AIInsights {
    console.log('Creating enhanced fallback insights...');
    
    // For documents with actual extracted content, use the real content insights
    if (type === 'document' && (content.includes('ACTUAL EXTRACTED CONTENT:') || content.includes('INTELLIGENT CONTENT ANALYSIS:'))) {
      console.log('Using real content insights for fallback');
      return this.createRealContentInsights(content);
    }
    
    // Otherwise use enhanced mock insights
    return this.createMockInsights(content, type, repoData);
  }
}