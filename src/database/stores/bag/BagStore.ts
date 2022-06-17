import IBagStore from './IBagStore';
import {InjectRepository} from '@nestjs/typeorm';
import Bag from 'database/entities/Bag';
import {Repository} from 'typeorm';
import Order from 'database/entities/Order';
import SpoonError from 'SpoonError';

export default class BagStore extends IBagStore {
  constructor(
    @InjectRepository(Bag)
    private readonly repository: Repository<Bag>,
    @InjectRepository(Order)
    private readonly order: Repository<Order>,
  ) {
    super();
  }

  async findBagByCode(code: string): Promise<Bag | undefined> {
    return this.repository.findOne({
      where: {code},
    });
  }

  async getBagByOrderIdOrFail(id: string) {
    const order = await this.order.findOneOrFail(id, {relations: ['bag']});
    if (!order.bag) throw new SpoonError('Order bag not found');
    return order.bag;
  }
}
