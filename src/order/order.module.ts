import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [OrderController],
  providers: [],
  imports: [NatsModule]
})
export class OrderModule {}
