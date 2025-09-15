import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Hemidi Inventory Management System')
    .setDescription(
      'Multi-channel inventory management system for e-commerce businesses. ' +
        'Manages inventory across multiple sales channels including Amazon, Wayfair, eBay, Shopee, etc.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Products', 'Product master data management')
    .addTag('Categories', 'Product category management')
    .addTag('Warehouses', 'Warehouse and location management')
    .addTag('Inventory', 'Stock level and inventory management')
    .addTag('Transactions', 'Inventory transaction history')
    .addTag('Reports', 'Analytics and reporting')
    .addTag('Jobs', 'Scheduled tasks and background jobs')
    .addServer('http://localhost:3003', 'Development server')
    .addServer('https://api.hemidi.com', 'Production server')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'Hemidi Inventory API',
    customfavIcon: '/favicon.ico',
  });

  // Health check endpoint
  app.getHttpAdapter().get('/health', (req, res) => {
    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'Hemidi Inventory Management System',
      version: '1.0.0',
    });
  });

  const port = process.env.PORT ?? 3003;
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📖 Swagger documentation: http://localhost:${port}/api`);
  console.log(`❤️ Health check: http://localhost:${port}/health`);
}

bootstrap();
