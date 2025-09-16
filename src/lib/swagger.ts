import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Todo API',
      version: '1.0.0',
      description: 'A simple Next.js Todo API',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
      },
    ],
  },
  apis: ['./src/app/api/**/*.ts'], // API routes path
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
