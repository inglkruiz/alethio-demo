/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import packageJson from 'package.json';

import { INestApplication, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder } from '@nestjs/swagger/dist/document-builder';
import { SwaggerModule } from '@nestjs/swagger/dist/swagger-module';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  initializeSwagger(app);

  const port = process.env.PORT || 3333;
  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port);
  });
}

function initializeSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle('Alethio demo')
    .setDescription(
      'An API that uses Alethio Blockchain API to query Ethereum data'
    )
    .setVersion(packageJson.version)
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('doc', app, document);
}

bootstrap();
