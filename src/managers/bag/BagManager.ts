import IBagManager from 'managers/bag/IBagManager';
import IBagStore from 'database/stores/bag/IBagStore';
import Bag from 'entities/Bag';
import {mapBagFromDb} from 'database/entities/Mappers';
import {Injectable} from '@nestjs/common';
import SpoonError from 'SpoonError';

@Injectable()
export default class BagManager extends IBagManager {
  constructor(private bagStore: IBagStore) {
    super();
  }

  async findBagByCodeOrThrow(code: string): Promise<Bag> {
    const bag = await this.bagStore.findBagByCode(code);
    if (!bag) throw new SpoonError('Bag not found');
    return mapBagFromDb(bag);
  }

  async getBagByOrderId(id: string) {
    const bag = await this.bagStore.getBagByOrderIdOrFail(id);
    return mapBagFromDb(bag);
  }
}
