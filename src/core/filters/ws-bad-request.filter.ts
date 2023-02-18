import { BadRequestException, Catch } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';

@Catch(BadRequestException)
export class BadRequestTransformationFilter extends BaseWsExceptionFilter {
  catch(exception: BadRequestException, host: any) {
    const properException = new WsException(exception.getResponse());
    super.catch(properException, host);
  }

  handleError(client: any, exception: any): void {
    client.send(JSON.stringify(exception.error));
  }
}
