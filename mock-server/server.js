/**
 * Mock API Server for Development and Testing
 *
 * WARNING: This server is intended for development and testing only.
 * Do not use this configuration in production environments.
 *
 * The CORS configuration is restricted to development origins only.
 */

import express from 'express';
import cors from 'cors';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const app = express();
const PORT = process.env.MOCK_SERVER_PORT || 2020;

// Security: Disable X-Powered-By header to prevent framework fingerprinting
app.disable('x-powered-by');

// CORS configuration for development/testing only
// Only allow requests from the development server and test environments
const getAllowedOrigins = () => {
  const defaultOrigins = [
    'http://localhost:3000',
    'http://localhost:5173', // Vite dev server
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
  ];

  // Allow custom origins from environment variable
  if (process.env.MOCK_SERVER_ALLOWED_ORIGINS) {
    return [
      ...defaultOrigins,
      ...process.env.MOCK_SERVER_ALLOWED_ORIGINS.split(','),
    ];
  }

  return defaultOrigins;
};

const corsOptions = {
  origin: getAllowedOrigins(),
  credentials: true,
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

// Middleware
app.use(cors(corsOptions));

// Additional security headers for development/testing
app.use((req, res, next) => {
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  // Enable XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  // Add CSP for development (relaxed for testing)
  res.setHeader('Content-Security-Policy', "default-src 'self' 'unsafe-inline' 'unsafe-eval'");
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mock data
const mockUsers = [
  {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    isSubscriber: false,
    isPatreon: false,
    features: { kiUI: true },
  },
];

const mockNotionObjects = [
  {
    id: 'page-1',
    object: 'page',
    title: 'Sample Page',
    url: 'https://notion.so/sample-page',
    icon: '📄',
    data: {
      id: 'page-1',
      object: 'page',
      created_time: '2023-01-01T00:00:00.000Z',
      properties: {},
    },
    isFavorite: false,
  },
  {
    id: 'database-1',
    object: 'database',
    title: 'Sample Database',
    url: 'https://notion.so/sample-database',
    icon: '🗃️',
    data: {
      id: 'database-1',
      object: 'database',
      created_time: '2023-01-01T00:00:00.000Z',
      properties: {},
    },
    isFavorite: false,
  },
];

const mockJobs = [
  {
    id: 1,
    object_id: 'page-1',
    type: 'page',
    title: 'Sample Page Job',
    status: 'completed',
    created_at: '2023-01-01T00:00:00.000Z',
  },
];

const mockUploads = [
  {
    id: 1,
    key: 'upload-1',
    filename: 'sample.apkg',
    created_at: '2023-01-01T00:00:00.000Z',
    size: 1024,
  },
];

const mockFavorites = [
  {
    id: 'page-1',
    object: 'page',
    title: 'Favorite Page',
    url: 'https://notion.so/favorite-page',
    icon: '⭐',
    data: {},
    isFavorite: true,
  },
];

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '2anki Mock API',
      version: '1.0.0',
      description: 'Mock API for 2anki application testing',
    },
    servers: [
      {
        url: 'http://localhost:2020',
        description: 'Mock server',
      },
    ],
  },
  apis: ['./server.js'], // Path to the API docs
};

const specs = swaggerJsdoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes

/**
 * @swagger
 * /api/users/debug/locals:
 *   get:
 *     summary: Get user locals
 *     responses:
 *       200:
 *         description: User locals information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 locals:
 *                   type: object
 *                   properties:
 *                     owner:
 *                       type: number
 *                     patreon:
 *                       type: boolean
 *                     subscriber:
 *                       type: boolean
 *                     subscriptionInfo:
 *                       type: object
 *                       properties:
 *                         active:
 *                           type: boolean
 *                         email:
 *                           type: string
 *                         linked_email:
 *                           type: string
 *                 linked_email:
 *                   type: string
 *                 user:
 *                   type: object
 *                 features:
 *                   type: object
 *                   properties:
 *                     kiUI:
 *                       type: boolean
 */
app.get('/api/users/debug/locals', (req, res) => {
  res.json({
    locals: {
      owner: 1,
      patreon: false,
      subscriber: false,
      subscriptionInfo: {
        active: false,
        email: 'test@example.com',
        linked_email: 'test@example.com',
      },
    },
    linked_email: 'test@example.com',
    user: mockUsers[0],
    features: {
      kiUI: true,
    },
  });
});

/**
 * @swagger
 * /api/users/logout:
 *   post:
 *     summary: Logout user
 *     responses:
 *       200:
 *         description: Successfully logged out
 */
app.post('/api/users/logout', (req, res) => {
  res.json({ success: true });
});

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully logged in
 *       401:
 *         description: Invalid credentials
 */
app.post('/api/users/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'test@example.com' && password === 'password') {
    res.json({ success: true, token: 'mock-token' });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

/**
 * @swagger
 * /api/users/link_email:
 *   post:
 *     summary: Link email to user account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email linked successfully
 */
app.post('/api/users/link_email', (req, res) => {
  res.json({ success: true });
});

/**
 * @swagger
 * /api/users/auth/google:
 *   get:
 *     summary: Google OAuth redirect
 *     responses:
 *       302:
 *         description: Redirect to Google OAuth
 */
app.get('/api/users/auth/google', (req, res) => {
  res.redirect('https://accounts.google.com/oauth/authorize?mock=true');
});

/**
 * @swagger
 * /api/notion/get-notion-link:
 *   get:
 *     summary: Get Notion connection info
 *     responses:
 *       200:
 *         description: Notion connection information
 */
app.get('/api/notion/get-notion-link', (req, res) => {
  res.json({
    connected: true,
    workspace: 'Test Workspace',
    user: 'Test User',
  });
});

/**
 * @swagger
 * /api/notion/pages:
 *   post:
 *     summary: Search Notion pages
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               query:
 *                 type: string
 *     responses:
 *       200:
 *         description: Search results
 */
app.post('/api/notion/pages', (req, res) => {
  const { query } = req.body;
  const results = mockNotionObjects.filter((obj) =>
    obj.title.toLowerCase().includes(query.toLowerCase())
  );
  res.json({ results });
});

/**
 * @swagger
 * /api/notion/page/{pageId}:
 *   get:
 *     summary: Get specific Notion page
 *     parameters:
 *       - in: path
 *         name: pageId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Page information
 *       404:
 *         description: Page not found
 */
app.get('/api/notion/page/:pageId', (req, res) => {
  const { pageId } = req.params;
  const page = mockNotionObjects.find(
    (obj) => obj.id === pageId && obj.object === 'page'
  );
  if (page) {
    res.json(page.data);
  } else {
    res.status(404).json({ error: 'Page not found' });
  }
});

/**
 * @swagger
 * /api/notion/database/{databaseId}:
 *   get:
 *     summary: Get specific Notion database
 *     parameters:
 *       - in: path
 *         name: databaseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Database information
 *       404:
 *         description: Database not found
 */
app.get('/api/notion/database/:databaseId', (req, res) => {
  const { databaseId } = req.params;
  const database = mockNotionObjects.find(
    (obj) => obj.id === databaseId && obj.object === 'database'
  );
  if (database) {
    res.json(database.data);
  } else {
    res.status(404).json({ error: 'Database not found' });
  }
});

/**
 * @swagger
 * /api/notion/convert:
 *   post:
 *     summary: Convert Notion content to Anki
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               type:
 *                 type: string
 *               title:
 *                 type: string
 *     responses:
 *       200:
 *         description: Conversion started
 */
app.post('/api/notion/convert', (req, res) => {
  const { id, type, title } = req.body;
  const newJob = {
    id: mockJobs.length + 1,
    object_id: id,
    type: type || 'page',
    title: title || 'Converted Content',
    status: 'processing',
    created_at: new Date().toISOString(),
  };
  mockJobs.push(newJob);
  res.json({ success: true, jobId: newJob.id });
});

/**
 * @swagger
 * /api/upload/file:
 *   post:
 *     summary: Upload file
 *     responses:
 *       200:
 *         description: File uploaded successfully
 */
app.post('/api/upload/file', (req, res) => {
  const newUpload = {
    id: mockUploads.length + 1,
    key: `upload-${mockUploads.length + 1}`,
    filename: 'uploaded-file.txt',
    created_at: new Date().toISOString(),
    size: 1024,
  };
  mockUploads.push(newUpload);
  res.json({ success: true, key: newUpload.key });
});

/**
 * @swagger
 * /api/upload/mine:
 *   get:
 *     summary: Get user's uploads
 *     responses:
 *       200:
 *         description: List of user uploads
 */
app.get('/api/upload/mine', (req, res) => {
  res.json(mockUploads);
});

/**
 * @swagger
 * /api/upload/mine/{key}:
 *   delete:
 *     summary: Delete upload
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Upload deleted successfully
 *       404:
 *         description: Upload not found
 */
app.delete('/api/upload/mine/:key', (req, res) => {
  const { key } = req.params;
  const index = mockUploads.findIndex((upload) => upload.key === key);
  if (index !== -1) {
    mockUploads.splice(index, 1);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Upload not found' });
  }
});

/**
 * @swagger
 * /api/upload/jobs:
 *   get:
 *     summary: Get user's jobs
 *     responses:
 *       200:
 *         description: List of jobs
 */
app.get('/api/upload/jobs', (req, res) => {
  res.json(mockJobs);
});

/**
 * @swagger
 * /api/upload/jobs/{id}:
 *   delete:
 *     summary: Delete job
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Job deleted successfully
 *       404:
 *         description: Job not found
 */
app.delete('/api/upload/jobs/:id', (req, res) => {
  const { id } = req.params;
  const index = mockJobs.findIndex((job) => job.id === parseInt(id));
  if (index !== -1) {
    mockJobs.splice(index, 1);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Job not found' });
  }
});

/**
 * @swagger
 * /api/download/u/{key}:
 *   get:
 *     summary: Download file
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: File downloaded
 *       404:
 *         description: File not found
 */
app.get('/api/download/u/:key', (req, res) => {
  const { key } = req.params;
  const upload = mockUploads.find((u) => u.key === key);
  if (upload) {
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${upload.filename}"`
    );
    res.setHeader('Content-Type', 'application/octet-stream');
    res.send('Mock file content for ' + upload.filename);
  } else {
    res.status(404).json({ error: 'File not found' });
  }
});

/**
 * @swagger
 * /api/settings/create/{objectId}:
 *   post:
 *     summary: Create settings for object
 *     parameters:
 *       - in: path
 *         name: objectId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               settings:
 *                 type: object
 *     responses:
 *       200:
 *         description: Settings created successfully
 */
app.post('/api/settings/create/:objectId', (req, res) => {
  const { objectId } = req.params;
  const { settings } = req.body;
  res.json({ success: true, objectId, settings });
});

/**
 * @swagger
 * /api/settings/find/{id}:
 *   get:
 *     summary: Find settings by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Settings found
 *       404:
 *         description: Settings not found
 */
app.get('/api/settings/find/:id', (req, res) => {
  const { id } = req.params;
  res.json({
    payload: {
      basic: true,
      reversed: false,
      notion_tags: true,
      cloze: false,
      max_one_cloze_per_notion_block: false,
      cloze_as_type: false,
      remove_underline: false,
      remove_mp3: false,
      is_template: false,
      add_notion_link: false,
      page_emoji: false,
      toggle_list: false,
      remove_code_highlight: false,
      skip_empty_flashcards: false,
      download_images: false,
      download_audio: false,
      inline_anki_deck: false,
      use_obsidian_cards: false,
      markdown: false,
      obsidian_compat: false,
      deck_name: 'Default Deck',
      global_tags: '',
      image_width: 500,
      image_height: 300,
    },
  });
});

/**
 * @swagger
 * /api/settings/card-options:
 *   get:
 *     summary: Get card options
 *     responses:
 *       200:
 *         description: Card options
 */
app.get('/api/settings/card-options', (req, res) => {
  res.json({
    basic: { name: 'Basic', description: 'Basic flashcard type' },
    reversed: { name: 'Reversed', description: 'Reversed flashcard type' },
    cloze: { name: 'Cloze', description: 'Cloze deletion type' },
  });
});

/**
 * @swagger
 * /api/settings/delete/{pageId}:
 *   post:
 *     summary: Delete settings for page
 *     parameters:
 *       - in: path
 *         name: pageId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Settings deleted successfully
 */
app.post('/api/settings/delete/:pageId', (req, res) => {
  const { pageId } = req.params;
  res.json({ success: true, pageId });
});

/**
 * @swagger
 * /api/rules/create/{id}:
 *   post:
 *     summary: Create rules for object
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rules created successfully
 */
app.post('/api/rules/create/:id', (req, res) => {
  const { id } = req.params;
  res.json({ success: true, id });
});

/**
 * @swagger
 * /api/rules/find/{id}:
 *   get:
 *     summary: Find rules by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rules found
 *       404:
 *         description: Rules not found
 */
app.get('/api/rules/find/:id', (req, res) => {
  const { id } = req.params;
  res.json({
    payload: {
      flashcard: ['default'],
      deck: ['deck1', 'deck2'],
      subDecks: ['subdeck1'],
      tags: 'tag1,tag2',
      email: true,
    },
  });
});

/**
 * @swagger
 * /api/favorite/create:
 *   post:
 *     summary: Add to favorites
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               type:
 *                 type: string
 *     responses:
 *       200:
 *         description: Added to favorites successfully
 */
app.post('/api/favorite/create', (req, res) => {
  const { id, type } = req.body;
  const existing = mockNotionObjects.find((obj) => obj.id === id);
  if (existing) {
    existing.isFavorite = true;
    mockFavorites.push(existing);
  }
  res.json({ success: true });
});

/**
 * @swagger
 * /api/favorite/delete:
 *   post:
 *     summary: Remove from favorites
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Removed from favorites successfully
 */
app.post('/api/favorite/delete', (req, res) => {
  const { id } = req.body;
  const index = mockFavorites.findIndex((fav) => fav.id === id);
  if (index !== -1) {
    mockFavorites.splice(index, 1);
  }
  const existing = mockNotionObjects.find((obj) => obj.id === id);
  if (existing) {
    existing.isFavorite = false;
  }
  res.json({ success: true });
});

/**
 * @swagger
 * /api/favorite/mine:
 *   get:
 *     summary: Get user's favorites
 *     responses:
 *       200:
 *         description: List of favorites
 */
app.get('/api/favorite/mine', (req, res) => {
  res.json(mockFavorites);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Swagger JSON endpoint
app.get('/docs/swagger.json', (req, res) => {
  res.json(specs);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', path: req.originalUrl });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Mock server running on http://localhost:${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/docs`);
  console.log(
    `Swagger JSON available at http://localhost:${PORT}/docs/swagger.json`
  );
});

export default app;
