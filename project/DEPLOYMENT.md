# 🚀 Deployment Guide for Spoon AI Insights Generator

## Quick Deploy to Netlify

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**:
   ```bash
   # Install Netlify CLI if you haven't
   npm install -g netlify-cli
   
   # Deploy
   netlify deploy --prod --dir=dist
   ```

3. **Set Environment Variables** in Netlify dashboard:
   - `VITE_OPENAI_API_KEY` = your OpenAI API key

## Quick Deploy to Vercel

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy to Vercel**:
   ```bash
   # Install Vercel CLI if you haven't
   npm install -g vercel
   
   # Deploy
   vercel --prod
   ```

3. **Set Environment Variables** in Vercel dashboard:
   - `VITE_OPENAI_API_KEY` = your OpenAI API key

## Manual Deployment

1. **Build for production**:
   ```bash
   npm run build
   ```

2. **Upload the `dist` folder** to any static hosting service:
   - GitHub Pages
   - Firebase Hosting
   - AWS S3 + CloudFront
   - Any web server

## Environment Variables

Create a `.env` file in the project root:
```
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

## Testing Before Deployment

1. **Test the build locally**:
   ```bash
   npm run build
   npm run preview
   ```

2. **Test both features**:
   - GitHub repository analysis
   - PDF document upload and analysis

## Demo Video Script

1. **Introduction** (30 seconds):
   - "This is Spoon, an AI-powered project insights generator"
   - Show the homepage with both GitHub and Document tabs

2. **GitHub Analysis** (60 seconds):
   - Enter a popular GitHub repo URL (e.g., facebook/react)
   - Show the loading process
   - Highlight the generated insights, charts, and analytics

3. **Document Analysis** (60 seconds):
   - Switch to Document tab
   - Upload a PDF file
   - Show the analysis results and insights

4. **Key Features** (30 seconds):
   - Highlight the AI insights, visualizations, and responsive design
   - Mention the tech stack and capabilities

## Submission Checklist

- [ ] Live demo URL working
- [ ] GitHub repository with clean code
- [ ] README with setup instructions
- [ ] Demo video or screenshots
- [ ] Environment variables documented
- [ ] Both GitHub and PDF analysis working
- [ ] Responsive design tested
- [ ] Error handling working properly

## Performance Notes

- The app is optimized for fast loading
- PDF processing is limited to 50 pages for performance
- GitHub API calls are cached
- Lazy loading implemented for heavy components

## Support

If you encounter any deployment issues:
1. Check the browser console for errors
2. Verify environment variables are set correctly
3. Ensure the build process completes without errors
4. Test locally with `npm run preview` first