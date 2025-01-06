import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { NATS_SERVICE } from 'src/config';

@Controller('auth')
export class AuthController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post('register')
  registerUser(@Body() algo:any){
    return this.client.send('auth.register.user', {}).pipe(
      catchError(error => { throw new RpcException(error)})
    );
  }

  @Post('login')
  loginUser(@Body() algo:any){
    return this.client.send('auth.login.user', {}).pipe(
      catchError(error => { throw new RpcException(error)})
    );
  }

  @Get('verify')
  verifyUser(@Body() algo:any){
    return this.client.send('auth.verify.user', {}).pipe(
      catchError(error => { throw new RpcException(error)})
    );
  }

}
