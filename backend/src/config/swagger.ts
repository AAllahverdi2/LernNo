export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'LernNo AI Language Workspace — REST API',
    version: '1.0.0',
    description: 'Interactive Swagger UI Documentation for LernNo Authentication, Class Groups, Teacher, Student, and Admin endpoints.',
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
      CreateClassInput: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string', example: '1-3-5 Saat 14:00 Qrupu' },
          language: { type: 'string', example: 'Alman Dili' },
          level: { type: 'string', example: 'A2' },
          schedule: { type: 'string', example: '1-3-5 Saat 14:00' },
          description: { type: 'string', example: 'Alman dili A2 səviyyəli intensiv danışıq və lüğət qrupu.' },
        },
      },
      AddStudentInput: {
        type: 'object',
        required: ['email'],
        properties: {
          email: { type: 'string', example: 'student@demo.com' },
        },
      },
      AddVocabularyInput: {
        type: 'object',
        required: ['word', 'translation', 'exampleSentence'],
        properties: {
          word: { type: 'string', example: 'Stadt' },
          translation: { type: 'string', example: 'Şəhər' },
          article: { type: 'string', example: 'die' },
          plural: { type: 'string', example: 'die Städte' },
          exampleSentence: { type: 'string', example: 'Berlin ist eine große Stadt in Deutschland.' },
          topic: { type: 'string', example: 'Ort & Stadt' },
          difficulty: { type: 'string', example: 'Medium' },
        },
      },
      CreateQuizInput: {
        type: 'object',
        required: ['title'],
        properties: {
          title: { type: 'string', example: 'A2 Sınaq İmtahanı #1' },
          totalQuestions: { type: 'number', example: 10 },
          passingScore: { type: 'number', example: 70 },
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
    '/classes': {
      get: {
        summary: 'Müəllimin Qruplarının Siyahısı (Get Teacher Classes)',
        tags: ['Class Groups'],
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Returns list of classes created by teacher.' },
        },
      },
      post: {
        summary: 'Yeni Qrup / Sınaq Qrupu Yaratmaq (Create New Class Group)',
        tags: ['Class Groups'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateClassInput' },
            },
          },
        },
        responses: {
          '201': { description: 'Class created successfully.' },
        },
      },
    },
    '/classes/{classId}': {
      get: {
        summary: 'Qrup Haqqında Ətraflı Məlumat (Get Class Details)',
        tags: ['Class Groups'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'classId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': { description: 'Returns class details with students, vocabulary, and quizzes.' },
        },
      },
    },
    '/classes/{classId}/students': {
      post: {
        summary: 'Qrupa Tələbə Əlavə Etmək (Add Student to Class by Email)',
        tags: ['Class Groups'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'classId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AddStudentInput' },
            },
          },
        },
        responses: {
          '201': { description: 'Student added to class.' },
        },
      },
    },
    '/classes/{classId}/vocabulary': {
      post: {
        summary: 'Qrupa Lüğət / Tapşırıq Yükləmək (Add Vocabulary/Assignment)',
        tags: ['Class Groups'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'classId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AddVocabularyInput' },
            },
          },
        },
        responses: {
          '201': { description: 'Vocabulary word added.' },
        },
      },
    },
    '/classes/{classId}/quizzes': {
      post: {
        summary: 'Qrup Daxilində Sınaq Yaradılması (Create Quiz in Class)',
        tags: ['Class Groups'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'classId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateQuizInput' },
            },
          },
        },
        responses: {
          '201': { description: 'Quiz created in class.' },
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
  },
};
