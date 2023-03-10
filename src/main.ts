import 'dotenv/config';

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config as awsConfig } from 'aws-sdk';
import figlet from 'figlet';
import gradient from 'gradient-string';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { PrismaService } from './modules/prisma/prisma.service';

// Get package information
// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageInfo = require('../package.json');

const logger = new Logger('Bootstrap');
async function bootstrap() {
  // Create application with CORS enabled and set logger levels
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: ['debug', 'error', 'log', 'verbose', 'warn'],
  });

  // Apply validation pipe globally with
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  // Apply Helmet security
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'same-site' } }));

  // Configure AWS SDK if storage type is S3
  if (process.env.STORAGE_TYPE === 's3') {
    awsConfig.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
  }

  // Enable Swagger documentation in development mode
  if (process.env.NODE_ENV === 'development') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle(process.env.APP_NAME)
      .setDescription(
        [
          `Este é o Playground da API do ${process.env.APP_NAME}.`,
          `Para mais informações, visite o repositório do projeto: <a href="${packageInfo.repository.url}" target="_blank">${packageInfo.repository.url}</a>`,
        ].join('<br />')
      )
      .setVersion(packageInfo.version)
      .addBearerAuth()
      .build();
    const swaggerDocs = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('playground', app, swaggerDocs, {
      customSiteTitle: `${process.env.APP_NAME} - API Playground`,
      swaggerOptions: {
        showRequestDuration: true,
        defaultModelsExpandDepth: -1,
      },
    });
  }

  // Enable prisma shutdown hooks
  const prismaService = app.get(PrismaService);
  prismaService.enableShutdownHooks(app);

  // Start application
  await app.listen(process.env.PORT || 3333);
  logger.log(`Application listening on: ${await app.getUrl()}`);
}

// Print application information
figlet(process.env.APP_NAME, (_, screen) => {
  console.log(gradient.vice(screen));
  console.log(`-> ${gradient.cristal('Version:')} ${packageInfo.version || 'N/A'}`);
  console.log(`-> ${gradient.cristal('Environment:')} ${process.env.NODE_ENV}`);
  console.log(`-> ${gradient.cristal('Author:')} ${packageInfo.author || 'Unknown'}`);
  console.log();
  bootstrap().catch(error => {
    logger.error(error);
    process.exit(1);
  });
});
