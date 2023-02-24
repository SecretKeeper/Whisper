import { Injectable } from '@nestjs/common';

@Injectable()
export class PhantomService {
  phantoms: Map<string, any> = new Map();

  public connectPhantom(phantom_id: string, client: any): void {
    this.phantoms.set(phantom_id, client);
  }

  public disconnectPhantom(phantom_id: string): void {
    this.phantoms.delete(phantom_id);
  }
}
