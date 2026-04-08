import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

/** Origin do browser nunca termina com "/"; URLs em env costumam ter barra final. */
function normalizeOrigin(url: string): string {
  const t = url.trim();
  if (t.endsWith('/')) return t.slice(0, -1);
  return t;
}

function parseCorsOrigins(): string[] {
  const raw =
    process.env.CORS_ORIGINS?.trim() ||
    process.env.FRONTEND_URL?.trim() ||
    'http://localhost:3000';
  return raw
    .split(',')
    .map((s) => normalizeOrigin(s))
    .filter(Boolean);
}

function isVercelPreviewOrigin(origin: string): boolean {
  if (process.env.CORS_ALLOW_VERCEL_PREVIEWS !== 'true') return false;
  try {
    const u = new URL(origin);
    return u.protocol === 'https:' && u.hostname.endsWith('.vercel.app');
  } catch {
    return false;
  }
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const allowedOrigins = parseCorsOrigins();
  console.log('[CORS] Allowed origins:', allowedOrigins);

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }
      if (allowedOrigins.includes(normalizeOrigin(origin))) {
        callback(null, origin);
        return;
      }
      if (isVercelPreviewOrigin(origin)) {
        callback(null, origin);
        return;
      }
      callback(null, false);
    },
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix('api');

  // Validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Static files (uploads)
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

  // Swagger docs
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('LIGA7ESPORTS API')
      .setDescription('API da plataforma de campeonatos LIGA7ESPORTS')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 LIGA7ESPORTS API running on http://localhost:${port}/api`);
  console.log(`📚 Swagger docs: http://localhost:${port}/api/docs`);
}

bootstrap();
