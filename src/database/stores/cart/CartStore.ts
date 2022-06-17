import ICartStore from 'database/stores/cart/ICartStore';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import Cart from 'database/entities/Cart';
import {CartState} from 'entities/Cart';

export default class CartStore extends ICartStore {
  constructor(
    @InjectRepository(Cart)
    private readonly repository: Repository<Cart>,
  ) {
    super();
  }

  async getCartByIdOrFail(id: string) {
    return this.repository.findOneOrFail(id);
  }

  async createCart(userId: string, status: CartState.Active) {
    const newCart = this.repository.create({
      userId,
      status,
    });

    await this.repository.insert(newCart);
    await this.repository.save(newCart);

    return this.getCartByIdOrFail(newCart.id);
  }

  async getCartByUserId(userId: string) {
    return this.repository.findOneOrFail({
      where: {userId},
    });
  }

  async getCartsByUserId(userId: string) {
    return this.repository.find({
      where: {userId},
    });
  }

  async deleteCart(id: string): Promise<void> {
    await this.repository.delete({id});
  }
}
