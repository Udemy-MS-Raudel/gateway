import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs, ORDER_SERVICE } from 'src/config';

@Module({
  controllers: [OrderController],
  providers: [],
  imports: [
    ClientsModule.register([
      { 
        name: ORDER_SERVICE, 
        transport: Transport.TCP,
        options: {
          host: envs.orderMicroHost,
          port: envs.orderMicroPort
        }
      },
    ]),
  ]
})
export class OrderModule {}
