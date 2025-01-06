import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { PaginationDto } from 'src/common';
import { CreateProductDto } from 'src/common/dto/create-product.dto';
import { UpdateProductDto } from 'src/common/dto/update-product.dto';
import { NATS_SERVICE } from 'src/config';


@Controller('product')
export class ProductController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post()
  createProduct(@Body() createProductDto: CreateProductDto){
    return this.client.send('create.product', createProductDto).pipe(
      catchError(error => { throw new RpcException(error)})
    );
  }

  @Get()
  findAllProduct(@Query() paginationDto: PaginationDto){
    return this.client.send('find.all.products', paginationDto).pipe(
      catchError(error => {throw new RpcException(error)})
    );
  }

  @Get(':id')
  findOneProduct(@Param('id', ParseIntPipe) id: number){

    return this.client.send('find.one.product', {id}).pipe(
      catchError(error => {throw new RpcException(error)})
    )

    //Otra manera de hacerlo
    // try {
    //   const productFound = await firstValueFrom(
    //     this.client.send('find.one.product', {id})
    //   )
    //   return productFound;
    // } catch (error) {
    //   throw new RpcException(error)
    // }
    
  }

  @Patch(':id')
  updateProduct(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto){
    return this.client.send('update.product', {id, ...updateProductDto}).pipe(
      catchError(error => {throw new RpcException(error)})
    );
  }

  @Delete(':id')
  deleteProduct(@Param('id', ParseIntPipe) id: number){
    return this.client.send('delete.product', {id}).pipe(
      catchError(error => {throw new RpcException(error)})
    );
  }
}
