export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'LernNo AI Language Workspace — REST API',
    version: '1.0.0',
    description: 'Interactive Swagger UI Documentation for LernNo Authentication, Teacher, Student, and Admin endpoints.',
    contact: {
      name: 'LernNo Team',
      email: 'admin@lernno.com',
    },
  },
  servers: [
    {
      url: 'https://lern-no.vercel.app/api',
      description: 'Production Vercel Cloud Server',
    },
    {
      url: 'http://localhost:5000/api',
      description: 'Local Development Server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT Token received from /auth/login or /auth/register',
      },
    },
    schemas: {
      RegisterInput: {
        type: 'object',
        required: ['name', 'email', 'password', 'role'],
        properties: {
          name: { type: 'string', example: 'Murad Həsənov' },
          email: { type: 'string', example: 'telebe100@test.com' },
          password: { type: 'string', example: 'password123' },
          role: { type: 'string', enum: ['TEACHER', 'STUDENT', 'ADMIN'], example: 'STUDENT' },
        },
      },
      LoginInput: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', example: 'teacher@demo.com' },
          password: { type: 'string', example: 'password123' },
        },
      },
    },
  },
  paths: {
    '/health': {
      get: {
        summary: 'Server Health Check',
        tags: ['System'],
        responses: {
          '200': {
            description: 'API Server is running',
          },
        },
      },
    },
    '/auth/register': {
      post: {
        summary: 'Qeydiyyat (Register New User)',
        description: 'Register a new Teacher, Student, or Admin user with bcrypt password hashing.',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RegisterInput' },
            },
          },
        },
        responses: {
          '201': { description: 'User registered successfully with JWT token.' },
          '400': { description: 'User with this email already exists or invalid data.' },
        },
      },
    },
    '/auth/login': {
      post: {
        summary: 'Giriş (Login User)',
        description: 'Authenticate user by email and password, returning 7-day JWT token.',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginInput' },
            },
          },
        },
        responses: {
          '200': { description: 'Login successful with JWT token & user profile.' },
          '401': { description: 'Invalid email or password.' },
        },
      },
    },
    '/auth/me': {
      get: {
        summary: 'Cari İstifadəçi Profil (Get Current Authenticated User)',
        tags: ['Authentication'],
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Returns authenticated user profile.' },
          '401': { description: 'Unauthorized — Token missing or invalid.' },
        },
      },
    },
    '/admin/users': {
      get: {
        summary: 'Bütün İstifadəçilərin Siyahısı (Admin Only)',
        tags: ['Admin Portal'],
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Returns list of all registered Teachers, Students, and Admins.' },
          '403': { description: 'Forbidden — Requires ADMIN role.' },
        },
      },
    },
    '/admin/change-role': {
      post: {
        summary: 'İstifadəçi Rolunu Dəyişdir (Admin Only)',
        tags: ['Admin Portal'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  userId: { type: 'string', example: 'user-uuid-here' },
                  role: { type: 'string', enum: ['TEACHER', 'STUDENT', 'ADMIN'], example: 'TEACHER' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'User role updated successfully.' },
          '403': { description: 'Forbidden — Requires ADMIN role.' },
        },
      },
    },
  },
};
