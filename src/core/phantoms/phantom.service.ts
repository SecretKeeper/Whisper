import { Injectable } from '@nestjs/common';
import { types } from 'cassandra-driver';

@Injectable()
export class PhantomService {
  phantoms: Map<types.Uuid, any> = new Map();

  public connectPhantom(phantom_id: types.Uuid, client: any): void {
    this.phantoms.set(phantom_id, client);
  }

  public disconnectPhantom(phantom_id: types.Uuid): void {
    this.phantoms.delete(phantom_id);
  }
}
