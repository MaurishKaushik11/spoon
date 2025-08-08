# Spoon - AI Project Insights Generator

An intelligent web application that analyzes GitHub repositories and documents to provide comprehensive insights, technical assessments, and real-world use cases.

## 🚀 Features

- **GitHub Repository Analysis**: Fetch real-time data from any public GitHub repository
- **Document Processing**: Upload and analyze PDF, Markdown, and text files
- **AI-Powered Insights**: Generate comprehensive analysis using OpenAI's GPT models
- **Interactive Dashboard**: Beautiful visualizations and analytics
- **Real-time Data**: Live contributor statistics, language breakdowns, and project metrics
- **Dark Theme**: Modern, professional interface optimized for productivity

## 🛠 Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Animations**: Framer Motion
- **Charts**: Recharts
- **APIs**: GitHub API, OpenAI API
- **File Processing**: PDF.js, React Dropzone
- **Build Tool**: Vite

## 🏁 Quick Start

### Prerequisites

- Node.js 16+ 
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd spoon-ai-insights
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your OpenAI API key:
```
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser to `http://localhost:5173`

## 🎯 How It Works

### GitHub Repository Analysis
1. Enter any public GitHub repository URL
2. The app fetches repository data, contributors, commits, and languages
3. AI analyzes the README and repository metadata
4. Generates insights including features, technologies, use cases, and recommendations

### Document Analysis
1. Upload a PDF, Markdown, or text file
2. The app extracts and processes the content
3. AI analyzes the document structure and content
4. Provides summary, key sections, technologies mentioned, and potential applications

### AI Analysis Process
- Content preprocessing and chunking
- Structured prompt engineering for consistent results
- GPT-3.5-turbo analysis with custom instructions
- JSON-formatted response parsing
- Fallback mechanisms for reliability

## 📊 Generated Insights

For each analysis, Spoon provides:

- **Summary**: Concise overview of the project/document purpose
- **Key Features**: Main functionalities and capabilities
- **Technologies**: Programming languages, frameworks, and tools used
- **Use Cases**: Real-world applications and implementation scenarios
- **Complexity Assessment**: Low/Medium/High complexity rating
- **Recommendations**: Actionable advice and next steps

## 🎨 UI/UX Features

- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Dark Theme**: Easy on the eyes with purple/blue accent colors
- **Smooth Animations**: Framer Motion powered transitions
- **Interactive Charts**: Language distribution, contributor stats, commit timeline
- **Loading States**: Engaging progress indicators with status updates
- **Error Handling**: Graceful fallbacks and user-friendly error messages

## 🚀 Deployment

### Build for production:
```bash
npm run build
```

### Deploy to Netlify, Vercel, or your preferred platform:
```bash
# For Netlify
npm run build && netlify deploy --prod --dir=dist

# For Vercel
npm run build && vercel --prod
```

## 🔧 Configuration

### API Keys
- **OpenAI API**: Required for AI analysis functionality
- **GitHub Token**: Optional, increases rate limits for GitHub API calls

### Customization
- Modify `src/services/ai.ts` to adjust AI prompts and analysis parameters
- Update `tailwind.config.js` for theme customization
- Configure chart colors in `src/components/InsightsDashboard.tsx`

## 📈 Performance Optimizations

- Lazy loading of charts and heavy components
- Request caching for GitHub API calls
- Optimized PDF processing with page limits
- Debounced user inputs
- Efficient re-renders with React.memo

## 🔒 Security

- Environment variables for sensitive API keys
- Client-side API key usage (consider server-side proxy for production)
- Input validation and sanitization
- Rate limiting considerations

## 🚧 Future Enhancements

- Server-side API proxy for enhanced security
- User authentication and project saving
- Batch analysis capabilities
- Custom AI model fine-tuning
- Integration with more version control systems
- Export functionality (PDF reports, JSON data)
- Real-time collaboration features

## 📝 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For questions or issues, please open a GitHub issue or contact the development team.

---

Built with ❤️ for the C4E internship application by [Your Name]