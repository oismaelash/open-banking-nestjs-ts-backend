import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for open banking APIs
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  
  // Global prefix for API routes
  app.setGlobalPrefix('api/v1');
  
  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Open Banking API')
    .setDescription('A comprehensive Open Banking API built with NestJS')
    .setVersion('1.0')
    .addTag('health', 'Health check endpoints')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'Open Banking API Documentation',
  });
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`🚀 Open Banking API is running on: http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/docs`);
  console.log(`🔗 Hello World: http://localhost:${port}/api/v1/`);
}
bootstrap(); 