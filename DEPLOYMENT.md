# Deployment Guide

## Quick Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect the configuration
   - Deploy with default settings

## Deploy to Netlify

1. **Build the project**
   ```bash
   npm install
   npm run build
   ```

2. **Deploy to Netlify**
   - Drag and drop the `dist` folder to [netlify.com/drop](https://app.netlify.com/drop)
   - Or connect your GitHub repository for continuous deployment

3. **Configure Functions** (for API proxy)
   - Create `netlify/functions/proxy.js` with the serverless function code
   - Update API calls to use `/.netlify/functions/proxy`

## Local Development

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development servers**
   ```bash
   # Terminal 1: Start API proxy
   npm run dev:api

   # Terminal 2: Start frontend
   npm run dev
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - API Proxy: http://localhost:3001

## Environment Variables

No environment variables required for basic functionality.

## Production Checklist

- ✅ CORS handling via serverless proxy
- ✅ Security: Private IP blocking
- ✅ Performance: Request timeouts and size limits
- ✅ Error handling and validation
- ✅ Responsive design
- ✅ TypeScript for type safety
- ✅ Production build optimization

## Monitoring

Monitor your deployment:
- Response times via the built-in timer
- Error rates via browser console
- API usage via Vercel/Netlify analytics

## Custom Domain

Both Vercel and Netlify support custom domains:
- Add your domain in the platform settings
- Configure DNS records as instructed
- SSL certificates are automatically provisioned