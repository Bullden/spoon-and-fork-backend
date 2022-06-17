import {ID} from 'entities/Common';
import Cart from 'database/entities/Cart';
import {CartState} from 'entities/Cart';

export default abstract class ICartStore {
  abstract createCart(userId: ID, status: CartState.Active): Promise<Cart>;

  abstract getCartByIdOrFail(id: ID): Promise<Cart>;

  abstract getCartByUserId(userId: ID): Promise<Cart>;

  abstract getCartsByUserId(userId: ID): Promise<Cart[]>;

  abstract deleteCart(id: ID): Promise<void>;
}
