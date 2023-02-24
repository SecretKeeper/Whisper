import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PhantomService } from './phantom.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'NATS',
        transport: Transport.NATS,
        options: {
          servers: ['nats://localhost:4222'],
        },
      },
    ]),
  ],
  providers: [PhantomService],
  controllers: [],
  exports: [PhantomService],
})
export class PhantomsModule {}
