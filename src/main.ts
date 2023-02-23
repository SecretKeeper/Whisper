import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { WsAdapter } from '@nestjs/platform-ws';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new WsAdapter(app));

  const microservice = app.connectMicroservice({
    transport: Transport.NATS,
    options: {
      servers: ['nats://localhost:4222'],
    },
  });

  await app.startAllMicroservices();
  await app.listen(3335);
}
bootstrap();
