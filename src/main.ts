import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { winstonLogger } from './util/winston.util';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';

declare const module: any;

async function bootstrap() {
  const PORT = process.env.PORT || 3005;

  const app = await NestFactory.create(AppModule, {
    logger: winstonLogger,
  });

  // helmet
  app.use(helmet());
  // cookie-parser
  app.use(cookieParser());

  // swagger
  const config = new DocumentBuilder()
    .setTitle('Lattice 2.0')
    .setDescription('Lattice 2.0 API 입니다.')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // validation
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(PORT);
  console.log(`Server Listening on ${PORT}, ENV : ${process.env.NODE_ENV}`);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
