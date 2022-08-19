import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { env } from 'process';
import { winstonLogger } from './utils/winston.util';
import { ValidationPipe } from '@nestjs/common';
// import {
//   utilities as nestWinstonModuleUtilities,
//   WinstonModule,
// } from 'nest-winston';
// import winston from 'winston';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule ,{
    logger: winstonLogger,
  });

  const config = new DocumentBuilder()
  .setTitle('Sleact API')
  .setDescription('Sleact 개발 API')
  .setVersion('1.0')
  .addTag('Sleact')
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform:true,
  }))

  const port : string = env.PORT
  await app.listen(port);
  console.log(`listening on port ${port}`)

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
