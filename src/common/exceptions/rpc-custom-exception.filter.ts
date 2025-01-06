
import { Catch, RpcExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

interface responseInterface {
  status: number,
  message: string
}

@Catch(RpcException)
export class RpcCustomExceptionFilter implements RpcExceptionFilter<RpcException> {
  catch(exception: RpcException, host: ArgumentsHost): any{
    
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const rpcError = exception.getError();


    //En caso que hay un microservicio caido esto aqui lo detectara.
    if( rpcError.toString().includes('Empty response')){
      return response.status(500).json({
        status: 500,
        message: rpcError.toString().substring(0, rpcError.toString().indexOf('(') - 1)
      })
    }
    
    // console.log({rpcError});
    if(typeof rpcError === 'object' && 'status' in rpcError && 'message' in rpcError){
      const status = rpcError.status;
      return response.status(status).json(rpcError)
    }

    response.status(400).json({
      status: 400,
      message: rpcError
    })
  }
}
