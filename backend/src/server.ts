import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import adminRoutes from './routes/adminRoutes';
import { swaggerSpec } from './config/swagger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*' }));
app.use(express.json());

// Root path response for Vercel preview
app.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    message: '🚀 LernNo Node.js Express REST API Server is Live on Vercel!',
    swaggerDocs: '/api-docs',
    swaggerJson: '/api-docs-json',
    healthCheck: '/api/health',
  });
});

// Serve raw Swagger JSON
app.get('/api-docs-json', (_req, res) => {
  res.json(swaggerSpec);
});

// Interactive Swagger UI HTML Page (CDN Powered for Vercel Serverless)
app.get('/api-docs', (_req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>LernNo API Documentation</title>
      <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css" />
      <style>
        body { margin: 0; padding: 0; background: #0f172a; }
        .swagger-ui .topbar { display: none; }
      </style>
    </head>
    <body>
      <div id="swagger-ui"></div>
      <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js"></script>
      <script>
        window.onload = () => {
          SwaggerUIBundle({
            url: '/api-docs-json',
            dom_id: '#swagger-ui',
            deepLinking: true,
            presets: [
              SwaggerUIBundle.presets.apis,
              SwaggerUIBundle.SwaggerUIStandalonePreset
            ],
          });
        };
      </script>
    </body>
    </html>
  `);
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'LernNo Node.js Express API Server Running' });
});

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 LernNo Backend Server running on http://localhost:${PORT}`);
    console.log(`📚 Interactive Swagger UI Docs available at http://localhost:${PORT}/api-docs`);
  });
}

export default app;
