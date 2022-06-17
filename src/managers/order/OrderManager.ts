import {Injectable} from '@nestjs/common';
import IOrderManager from 'managers/order/IOrderManager';
import IOrderStore from 'database/stores/order/IOrderStore';
import Order, {OrderPlacement, OrderState} from 'entities/Order';
import {mapOrderFromDb, mapOrderListFromDb} from 'database/entities/Mappers';
import SpoonError from 'SpoonError';
import IUserStore from 'database/stores/user/IUserStore';
import {ID} from 'entities/Common';
import IAddressStore from 'database/stores/address/IAddressStore';
import AppType from 'entities/AppType';
import IPaymentStore from 'database/stores/payment/IPaymentStore';
import IBagStore from 'database/stores/bag/IBagStore';
// import LatLng from 'entities/LatLng';
// import {MarkOrderAction} from 'graphql/entities/order/MarkOrderAction';
import * as R from 'ramda';
import ICartStore from '../../database/stores/cart/ICartStore';
import ISetStore from '../../database/stores/set/ISetStore';
import IRestaurantStore from '../../database/stores/restaurant/IRestaurantStore';
import INotificationService from '../../services/notification/INotificationService';
import IAddressManager from 'managers/address/IAddressManager';
// import IRestaurantStore from 'database/stores/restaurant/IRestaurantStore';
// import IAddressManager from 'managers/address/IAddressManager';

@Injectable()
export default class OrderManager extends IOrderManager {
  constructor(
    private readonly orderStore: IOrderStore,
    private readonly cartStore: ICartStore,
    private readonly restaurantStore: IRestaurantStore,
    private readonly userStore: IUserStore,
    private readonly locationStore: IAddressStore,
    private readonly setStore: ISetStore,
    private readonly paymentStore: IPaymentStore,
    private readonly notificationService: INotificationService,
    private readonly bagsStore: IBagStore,
    private readonly addressManager: IAddressManager, // private readonly restaurantStore: IRestaurantStore, // private readonly addressManager: IAddressManager,
  ) {
    super();
  }

  // eslint-disable-next-line class-methods-use-this
  getDeliveryPriceInCents(distanceMiles: number): number {
    const deliveryPrice = 399; // $3.99

    const basicPricePerAdditionalMile = 50; // $0.5

    const basicDeliveryRadius = 2;

    let price: number;

    if (distanceMiles <= basicDeliveryRadius) {
      price = deliveryPrice;
    } else {
      const additionalPrice =
        (distanceMiles - basicDeliveryRadius) * basicPricePerAdditionalMile;
      price = deliveryPrice + additionalPrice;
    }

    return +price.toFixed(0);
  }

  async createOrder(
    cartId: ID,
    userId: ID,
    setId: ID,
    clientAddress: {
      placeId: string | undefined;
      lat: number;
      lng: number;
      description: string;
      entrance: string | undefined;
      floor: string | undefined;
      apartment: string | undefined;
    },
    restaurantId: string,
    numberOfDays: number,
  ) {
    if (!setId) {
      throw new SpoonError('Cannot add order without set');
    }

    // todo: validate distance

    const client = await this.userStore.getClientOrThrow(userId);

    const date = new Date();

    const newLocation = await this.locationStore.createAddress({
      placeId: clientAddress.placeId,
      lat: clientAddress.lat,
      lng: clientAddress.lng,
      description: clientAddress.description,
      entrance: clientAddress.entrance,
      floor: clientAddress.floor,
      apartment: clientAddress.apartment,
      date,
    });

    const set = await this.setStore.findSetById(setId);
    if (!set) throw new Error('Set not exist');

    const price = set?.priceCents;

    const distanceMiles = await this.addressManager.getDistanceToRestaurant(
      restaurantId,
      newLocation.lat,
      newLocation.lng,
      AppType.Client,
    );
    if (distanceMiles === 0) throw new SpoonError('you entered two identical addresses');

    const orderInfo = await this.orderStore.createOrderInfo(
      newLocation,
      price,
      +distanceMiles.toFixed(1),
    );

    const cart = await this.cartStore.getCartByIdOrFail(cartId);
    const restaurant = await this.restaurantStore.getRestaurantById(restaurantId);

    date.setDate(date.getDate() + numberOfDays);
    return mapOrderFromDb(
      await this.orderStore.createOrder(
        client,
        orderInfo,
        cart,
        set,
        restaurant,
        OrderState.ReadyForDelivery,
        OrderPlacement.Restaurant,
        date,
      ),
    );
  }

  async setOrderRestaurant(
    id: string,
    restaurantId: string,
    orderInfoId: string,
    priceCents: number,
  ): Promise<void> {
    await this.orderStore.setOrderRestaurant(
      id,
      {id: restaurantId},
      orderInfoId,
      priceCents,
    );
  }

  async getOrders(): Promise<Order[]> {
    const orders = await this.orderStore.getOrders();

    if (orders.length < 0) throw new SpoonError('no orders at the moment');

    return mapOrderListFromDb(orders);
  }

  async getOrderById(id: string) {
    const order = await this.orderStore.getOrderByIdOrFail(id);

    return mapOrderFromDb(order);
  }

  async acceptOrder(userId: string, orderId: string) {
    const courier = await this.userStore.getCourierByUserIdOrThrow(userId);

    const dbOrder = await this.orderStore.getOrderByIdOrFail(orderId);
    if (!dbOrder) throw new SpoonError('Order is not found');

    const order = mapOrderFromDb(dbOrder);

    if (order.state !== OrderState.ReadyForDelivery)
      throw new SpoonError(
        'this order does not ready for delivery or already shipped to order',
      );

    await this.orderStore.assignCourier(orderId, courier, OrderState.AcceptedByCourier);
    await this.notificationService.sendOrderAccepted(order, 'courier', courier);
  }

  async getOrdersByRestaurantId(userId: string): Promise<Order[]> {
    const restaurant = await this.restaurantStore.getRestaurantByUserId(userId);
    const orders = await this.orderStore.getOrdersByRestaurantId(restaurant.id);
    return mapOrderListFromDb(orders);
  }

  async getOrdersByCartId(id: string): Promise<Order[]> {
    const cart = await this.cartStore.getCartByIdOrFail(id);
    const orders = await this.orderStore.getOrdersByCartId(cart.id);
    return mapOrderListFromDb(orders);
  }

  async getOrdersByCourierId(userId: string): Promise<Order[]> {
    const cart = await this.userStore.getCourierByUserIdOrThrow(userId);
    const orders = await this.orderStore.getOrdersByCourierId(cart.id);
    return mapOrderListFromDb(orders);
  }

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    const client = await this.userStore.getClientOrThrow(userId);
    const orders = await this.orderStore.getOrdersByUserId(client.id);
    return mapOrderListFromDb(orders);
  }

  async getOrdersForDelivery(appType: AppType): Promise<Order[]> {
    if (appType !== AppType.Courier)
      throw new SpoonError('You do not have sufficient rights to take a delivery order');

    return mapOrderListFromDb(await this.orderStore.getOrdersForDelivery()); // todo: implement filter
  }

  async getOrderHistory(userId: ID, appType: AppType): Promise<Order[]> {
    switch (appType) {
      case AppType.Client: {
        const client = await this.userStore.getClientOrThrow(userId);
        return mapOrderListFromDb(await this.orderStore.getClientOrderHistory(client.id));
      }
      case AppType.Courier: {
        const courier = await this.userStore.getCourierByUserIdOrThrow(userId);
        return mapOrderListFromDb(
          await this.orderStore.getCourierOrderHistory(courier.id),
        );
      }
      default:
        throw new SpoonError(`appType not supported: ${appType}`);
    }
  }

  async evaluateOrder(role: AppType, userId: string, orderId: string, rating: number) {
    const dbOrder = await this.orderStore.getOrderByIdOrFail(orderId);
    if (!dbOrder) throw new SpoonError('Order not found');

    const order = mapOrderFromDb(dbOrder);

    if (order.state !== OrderState.Completed)
      throw new SpoonError('Order is not finished yet');

    if (order.client && order.client.id !== userId)
      throw new SpoonError('You do not own this order');

    if (role !== AppType.Client)
      throw new SpoonError('You must be a client to evaluate an order');

    if (order.rating) throw new SpoonError('You have already rated the order');

    await this.orderStore.updateRating(orderId, rating);
  }

  async markOrder(
    appType: AppType,
    orderId: string,
    bagId: string,
    // action: MarkOrderAction,
    // latLng?: LatLng,
  ) {
    const dbOrder = await this.orderStore.getOrderByIdOrFail(orderId);
    if (!dbOrder) throw new SpoonError('Order not found');

    const order = mapOrderFromDb(dbOrder);
    await this.checkOrderBag(orderId, bagId);

    // const mark = await this.orderStore.createMark(latLng);

    // const chekin = action === MarkOrderAction.CheckIn;

    let type: 'courier' | 'client' | 'restaurant' | undefined;
    let newState: OrderState | undefined;
    // let newPlacement;

    if (appType === AppType.Restaurant) {
      if (order.state !== OrderState.AcceptedByCourier)
        throw new SpoonError('Cannot mark this order (bad state)');

      newState = OrderState.Delivering;
      // } else {
      //   if (order.state !== OrderState.Delivering)
      //     throw new SpoonError('Cannot mark this order (bad state)');
      //
      //   newState = OrderState.Delivered;
      //
      //   const currentCourierId = order.courierId;
      //
      //   if (!currentCourierId) throw new SpoonError('courier not found!');
      //
      //   // const deliveryPrice = +(order.orderInfo.priceCents / 2).toFixed(0);
      //
      //   // await this.transactionManager.createCourierTransaction(
      //   //   {courierId: currentCourierId},
      //   //   deliveryPrice,
      //   //   TransactionType.Credit,
      //   //   true,
      //   // );
      //
      //   newPlacement =
      //     order.placement === OrderPlacement.Client
      //       ? OrderPlacement.Restaurant
      //       : OrderPlacement.Client;
      // }
      //
      type = 'restaurant';
    }
    // else if (appType === AppType.Client) {
    //   if (!chekin) {
    //     newState = OrderState.Completed;
    //   }
    //
    //   type = 'client';
    // }

    if (!newState) throw new SpoonError('New state is not defined');
    if (!type) throw new SpoonError('Type is not defined');

    await this.orderStore.markOrder(orderId, type, newState);
    await this.notificationService.sendMarkOrder(order, type);
  }

  private async checkOrderBag(orderId: ID, bagId: string) {
    const bag = await this.bagsStore.getBagByOrderIdOrFail(orderId);
    const verifyId = bag.id;
    if (!R.equals(bagId, verifyId)) {
      throw new SpoonError('Bags id are not equal');
    }
  }

  async deleteOrder(userId: ID, orderId: ID, appType: AppType) {
    const order = await this.getOrderById(orderId);
    if (!order) throw new SpoonError('Order not exists');
    if (!order.client) throw new SpoonError('No customer data');
    if (appType === AppType.Client) {
      if (
        order.state !== OrderState.WaitingForPayment ||
        order.placement !== OrderPlacement.Client ||
        order.client.id !== userId
      ) {
        throw new SpoonError('You could not delete this order');
      }
    }

    await this.orderStore.deleteOrder(orderId);
  }

  async getCurrentOrder(userId: string, appType: AppType) {
    if (appType === AppType.Client) {
      const client = await this.userStore.getClientOrThrow(userId);
      const order = await this.orderStore.currentClientOrderById(client.id);
      return !order ? undefined : mapOrderFromDb(order);
    }

    if (appType === AppType.Courier) {
      const courier = await this.userStore.getCourierByUserIdOrThrow(userId);
      const order = await this.orderStore.currentCourierOrderById(courier.id);

      if (order && order.placement === 'Restaurant') {
        return undefined;
      }

      return !order ? undefined : mapOrderFromDb(order);
    }
  }

  async removeTheCurrentCourier(orderId: string) {
    const order = await this.orderStore.getOrderByIdOrFail(orderId);

    if (
      order.state === OrderState.AcceptedByRestaurant ||
      order.state === OrderState.WaitingForPayment ||
      order.state === OrderState.ReadyForDelivery ||
      order.state === OrderState.Delivered
    )
      throw new SpoonError('currently there is no active courier');

    await this.orderStore.removeCourier(orderId);
  }
}
