# API Response Playground

A production-grade web application for testing and exploring APIs with a clean, developer-friendly interface.

## Features

- **Request Builder**: Configure HTTP method, URL, headers, and request body
- **Response Viewer**: View formatted responses with syntax highlighting
- **Security**: Serverless proxy prevents CORS issues and blocks private IPs
- **Performance**: Response time measurement and request timeout handling
- **UX**: Loading states, error handling, and dark mode design

## Tech Stack

- **Frontend**: React + Vite + TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Serverless proxy (Vercel/Netlify compatible)
- **Security**: IP filtering, request validation, size limits

## Quick Start

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to use the application.

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy automatically

### Netlify

1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Configure serverless functions for the `api` directory

## API Proxy

The serverless proxy (`/api/proxy`) handles:

- **CORS**: Enables cross-origin requests
- **Security**: Blocks localhost and private IP ranges
- **Validation**: Validates URLs and HTTP methods
- **Limits**: 30-second timeout, 1MB response size limit
- **Performance**: Measures and returns response times

## Example Requests

### GET Request
```
URL: https://jsonplaceholder.typicode.com/posts/1
Method: GET
```

### POST Request
```
URL: https://jsonplaceholder.typicode.com/posts
Method: POST
Headers: Content-Type: application/json
Body: {
  "title": "Test Post",
  "body": "This is a test",
  "userId": 1
}
```

## Architecture

```
src/
├── components/          # React components
│   ├── RequestBuilder.tsx
│   ├── ResponseViewer.tsx
│   └── HeaderEditor.tsx
├── types/              # TypeScript definitions
│   └── api.ts
├── utils/              # Utility functions
│   └── api.ts
├── App.tsx             # Main application
├── main.tsx            # Entry point
└── index.css           # Styles

api/
└── proxy.ts            # Serverless proxy function
```

## Security Features

- Private IP blocking (localhost, 127.x.x.x, 10.x.x.x, 192.168.x.x, etc.)
- Request timeout (30 seconds)
- Response size limit (1MB)
- Input validation and sanitization
- CORS handling

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT License - feel free to use this in your projects!