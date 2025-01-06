import { Controller, Get, Post, Body, Patch, Param, Inject, ParseUUIDPipe, Query } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { NATS_SERVICE, ORDER_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { OrderPaginationDto, PaginationDto } from 'src/common';
import { StatusDto } from './dto/status.dto';

@Controller('order')
export class OrderController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.client.send('create.order', createOrderDto).pipe(
      catchError(error => {throw new RpcException(error)})
    );
  }

  @Get()
  findAll(@Query() orderPaginationDto: OrderPaginationDto) {
    return this.client.send('find.all.order', orderPaginationDto).pipe(
      catchError(error => {throw new RpcException(error)})
    );
  }

  @Get('id/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.client.send('find.one.order', {id}).pipe(
      catchError(error => {throw new RpcException(error)})
    );
  }

  @Get(':status')
  findAllByStatus(@Param() statusDto: StatusDto, @Query() paginationDto: PaginationDto) {
    return this.client.send('find.all.order', {
      ...paginationDto, status: statusDto.status
    }).pipe(
      catchError(error => {throw new RpcException(error)})
    );
  }

  @Patch(':id')
  changeOrderStatus(@Param('id', ParseUUIDPipe) id: string, @Body() statusDto: StatusDto){
    return this.client.send('change.status.order', {id, status: statusDto.status}).pipe(
      catchError(error => {throw new RpcException(error)})
    );
  }

}
