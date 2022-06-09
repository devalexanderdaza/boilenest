/*
 * Copyright (c) 2022, Alexander Daza - Boilenest
 *
 * Hippocratic + Do Not Harm (H-DNH) Version 1.1
 *
 * Most software today is developed with little to no thought of how it will
 * be used, or the consequences for our society and planet.
 * As software developers, we engineer the infrastructure of the 21st century.
 * We recognise that our infrastructure has great power to shape the world and the lives of those we share it with,
 * and we choose to consciously take responsibility for the social and environmental impacts of what we build.
 *
 *     https://github.com/devalexanderdaza/boilenest#license
 */
import * as fs from 'fs';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const pkgData = JSON.parse(fs.readFileSync(`${process.cwd()}/package.json`, 'utf-8'));

async function bootstrap() {
  const logger = new Logger('Boilenest Factory');

  // Create new NestJS application
  const app = await NestFactory.create(AppModule, { cors: true });

  // Get config services
  const configService = app.get<ConfigService>(ConfigService);

  // Configure API global prefix
  // https://docs.nestjs.com/faq/global-prefix
  if (configService.get<boolean>('APPLICATION_PREFIX')) {
    app.setGlobalPrefix(configService.get<string>('PREFIX_ROUTE'));
  }

  // Configure API versioning
  if (configService.get<boolean>('APPLICATION_VERSIONING')) {
    app.enableVersioning({
      type: VersioningType.URI,
      prefix: configService.get<string>('VERSIONING_PREFIX'),
      defaultVersion: configService.get<string>('VERSIONING_DEFAULT_VERSION'),
    });
  }

  // Configure global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  // Configure Swagger
  if (configService.get<boolean>('APPLICATION_SWAGGER')) {
    const config = new DocumentBuilder()
      .setTitle(configService.get<string>('APPLICATION_NAME'))
      .setDescription(configService.get<string>('APPLICATION_DESCRIPTION'))
      .setVersion(pkgData.version)
      .setContact(pkgData.author.name, pkgData.author.url, pkgData.author.email)
      .setLicense(pkgData.license, pkgData.homepage)
      .build();
    SwaggerModule.setup(
      configService.get<string>('SWAGGER_DOCUMENTATION_URL'),
      app,
      SwaggerModule.createDocument(app, config),
    );
  }

  // NestJS init
  const protocol = (configService.get<boolean>('APPLICATION_SSL')) ? 'https://' : 'http://';
  const inverseProxy = (configService.get<boolean>('APPLICATION_INVERSE_PROXY')) ? '' : `:${configService.get<number>('APPLICATION_PORT')}`;
  await app.listen(configService.get<number>('APPLICATION_PORT'), () => {
    const appUrl = `${protocol}${configService.get<string>('APPLICATION_HOST')}${inverseProxy}`;
    logger.log(`Server running on ${appUrl}`);
    if (configService.get<boolean>('APPLICATION_SWAGGER')) {
      logger.log(`Access to swagger documentation on ${appUrl}/${configService.get<string>('SWAGGER_DOCUMENTATION_URL')}`);
    }
  });
}

void bootstrap();
