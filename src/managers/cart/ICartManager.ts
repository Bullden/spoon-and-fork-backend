import Cart from 'entities/Cart';
import {ID} from 'entities/Common';
import SelectedSetInfo from 'entities/SelectedSetInfo';

export default abstract class ICartManager {
  abstract createCartAndDistributeOrders(
    userId: ID,
    clientAddress: {
      lat: number;
      lng: number;
      description: string;
    },
    selectedSetsInfo: SelectedSetInfo[],
  ): Promise<Cart>;

  abstract getCartById(id: string): Promise<Cart>;

  abstract getCartByUserId(userId: string): Promise<Cart>;

  abstract getCartsByUserId(userId: ID): Promise<Cart[]>;

  abstract deleteCart(userId: ID, cartId: ID): Promise<void>;
}
