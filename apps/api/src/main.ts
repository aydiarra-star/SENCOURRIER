import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    // Le corps brut est requis pour vérifier la signature des webhooks Stripe.
    rawBody: true,
    bufferLogs: true,
  });

  const config = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  app.use(
    helmet({
      contentSecurityPolicy: false, // Assurée par le CDN Cloudflare et Next.js.
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );
  app.use(compression());
  app.use(cookieParser());

  app.enableCors({
    origin: config.get<string>('CORS_ORIGINS', 'http://localhost:3000').split(',').map((value) => value.trim()),
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    maxAge: 86_400,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      // Les champs non déclarés sont retirés : aucune propriété arbitraire ne
      // peut atteindre les couches de persistance.
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: false },
    }),
  );

  app.enableShutdownHooks();

  if (config.get<string>('NODE_ENV') !== 'production') {
    const document = SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle('SENCOURRIER API')
        .setDescription(
          "API REST du média numérique de référence du Sénégal : articles, rubriques, journalistes, recherche, abonnements, médias et analytique.",
        )
        .setVersion('1.0')
        .addBearerAuth()
        .addServer(`http://localhost:${config.get('API_PORT', 3001)}`, 'Local')
        .build(),
    );
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: { persistAuthorization: true },
    });
  }

  const port = config.get<number>('API_PORT', 3001);
  await app.listen(port);

  logger.log(`SENCOURRIER API démarrée sur http://localhost:${port}/api/v1`);
  logger.log(`Documentation interactive : http://localhost:${port}/api/docs`);
}

void bootstrap();
