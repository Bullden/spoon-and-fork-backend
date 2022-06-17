import {Injectable} from '@nestjs/common';
import ICartStore from 'database/stores/cart/ICartStore';
import IUserStore from 'database/stores/user/IUserStore';
import {ID} from 'entities/Common';
import IAddressStore from 'database/stores/address/IAddressStore';
import IBagStore from 'database/stores/bag/IBagStore';
import IRestaurantStore from 'database/stores/restaurant/IRestaurantStore';
import IAddressManager from 'managers/address/IAddressManager';
import IOrderManager from 'managers/order/IOrderManager';
import {mapCartsFromDb, mapCartToGQL} from 'graphql/entities/Mappers';
import SelectedSetInfo from 'entities/SelectedSetInfo';
import ICartManager from './ICartManager';
import Cart, {CartState} from 'entities/Cart';
import {mapCartFromDb} from 'database/entities/Mappers';
import SpoonError from 'SpoonError';
import Set from 'entities/Set';
import IOrderStore from 'database/stores/order/IOrderStore';

@Injectable()
export default class CartManager extends ICartManager {
  constructor(
    private readonly cartStore: ICartStore,
    private readonly userStore: IUserStore,
    private readonly locationStore: IAddressStore,
    // private readonly paymentStore: IPaymentStore,
    private readonly bagsStore: IBagStore,
    private readonly orderStore: IOrderStore,
    private readonly restaurantStore: IRestaurantStore,
    private readonly addressManager: IAddressManager,
    private readonly orderManager: IOrderManager,
  ) {
    super();
  }

  async createCartAndDistributeOrders(
    userId: ID,
    clientAddress: {
      lng: number;
      lat: number;
      description: string;
    },
    selectedSetsInfo: SelectedSetInfo[],
  ) {
    const cart = await this.createCart(userId);

    let cuisines: string[];
    cuisines = selectedSetsInfo.map((item) => {
      return item.set.cuisineId;
    });
    cuisines = [...new Set(cuisines)];

    const restaurants = await this.orderStore.getRestaurantsByCuisines(cuisines);

    let restaurantsByCuisines: {cuisine: string; restaurantsIds: string[]}[] = [];

    cuisines.forEach((item) => {
      restaurantsByCuisines.push({cuisine: item, restaurantsIds: []});
    });

    restaurantsByCuisines = restaurantsByCuisines.map((item) => {
      const rests = restaurants.filter((restaurant) => {
        if (restaurant.cuisines) {
          return (
            restaurant.cuisines.filter((cuisine) => cuisine.id === item.cuisine).length >
            0
          );
        }

        return false;
      });

      return {cuisine: item.cuisine, restaurantsIds: rests.map((rest) => rest.id)};
    });

    const createOrders = async (setsInfo: SelectedSetInfo, quantity: number) => {
      const restaurant = restaurantsByCuisines.filter(
        (restaurantsCuisineInfo) =>
          restaurantsCuisineInfo.cuisine === setsInfo.set.cuisineId,
      )[0].restaurantsIds[Math.floor(restaurants.length * Math.random())];

      const promises = [];
      // eslint-disable-next-line no-plusplus
      for (let l = quantity; l > 0; l--) {
        // eslint-disable-next-line no-await-in-loop
        promises.push(
          this.createOrdersBySetsIds(
            cart.id,
            userId,
            setsInfo.set.id,
            clientAddress,
            setsInfo.numberOfDays,
            restaurant,
          ),
        );
      }

      await Promise.all(promises);
    };

    selectedSetsInfo.map(async (item) => {
      // eslint-disable-next-line no-plusplus
      const neededRestaurantsQuantity = item.quantity / 4;

      // eslint-disable-next-line no-plusplus
      for (let j = Math.trunc(neededRestaurantsQuantity); j > 0; j--) {
        // eslint-disable-next-line no-await-in-loop
        await createOrders(item, 4);
      }

      if (Math.trunc(neededRestaurantsQuantity) !== neededRestaurantsQuantity) {
        const numberOfRemainingSets =
          neededRestaurantsQuantity - Math.trunc(neededRestaurantsQuantity);

        // eslint-disable-next-line no-await-in-loop
        await createOrders(item, numberOfRemainingSets * 4);
      }
    });
    return mapCartToGQL(cart);
  }

  private async createOrdersBySetsIds(
    cartId: string,
    userId: string,
    setId: string,
    clientAddress: {
      lat: number;
      lng: number;
      description: string;
    },
    numberOfDays: number,
    restaurantId: string,
  ) {
    return this.orderManager.createOrder(
      cartId,
      userId,
      setId,
      clientAddress,
      restaurantId,
      numberOfDays,
    );
  }

  private async createCart(userId: ID) {
    return mapCartToGQL(await this.cartStore.createCart(userId, CartState.Active));
  }

  async getCartById(id: string): Promise<Cart> {
    const cart = await this.cartStore.getCartByIdOrFail(id);
    return mapCartFromDb(cart);
  }

  async getCartByUserId(userId: string): Promise<Cart> {
    const cart = await this.cartStore.getCartByUserId(userId);
    return mapCartFromDb(cart);
  }

  async getCartsByUserId(userId: string): Promise<Cart[]> {
    const carts = await this.cartStore.getCartsByUserId(userId);
    return mapCartsFromDb(carts);
  }

  async deleteCart(userId: ID, cartId: ID) {
    const cart = await this.getCartById(cartId);
    if (!cart) throw new SpoonError('Cart not exists');
    // if (appType === AppType.Client) {
    //   if (
    //     cart.state !== OrderState.WaitingForPayment ||
    //     cart.placement !== OrderPlacement.Client ||
    //     cart.client.id !== userId
    //   ) {
    //     throw new SpoonError('You could not delete this order');
    //   }
    // }

    await this.cartStore.deleteCart(cartId);
  }
}
