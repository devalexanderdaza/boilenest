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
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      ignoreEnvFile: false,
      envFilePath: ['.env'],
      cache: false,
      validationSchema: Joi.object({
        // ENVIRONMENT CONFIGURATION
        NODE_ENV: Joi.string().valid('development', 'production', 'test', 'provision').required(),
        // APPLICATION CONFIGURATION
        APPLICATION_NAME: Joi.string().default('Boilenest API'),
        APPLICATION_DESCRIPTION: Joi.string().default('A most complete and updated Baileys REST and Socket API'),
        APPLICATION_HOST: Joi.string().required().default('localhost'),
        APPLICATION_PORT: Joi.number().required().default(3000),
        APPLICATION_SSL: Joi.boolean().valid(true, false).default(false),
        APPLICATION_INVERSE_PROXY: Joi.boolean().valid(true, false).default(false),
        APPLICATION_PREFIX: Joi.boolean().valid(true, false).default(true),
        APPLICATION_VERSIONING: Joi.boolean().valid(true, false).default(true),
        APPLICATION_SWAGGER: Joi.boolean().valid(true, false).default(true),
        // PREFIX CONFIGURATION
        PREFIX_ROUTE: Joi.string().default('api'),
        // VERSIONING CONFIGURATION
        VERSIONING_PREFIX: Joi.string().default('v'),
        VERSIONING_DEFAULT_VERSION: Joi.string().default('1'),
        // SWAGGER CONFIGURATION
        SWAGGER_DOCUMENTATION_URL: Joi.string().default('documentation'),
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
