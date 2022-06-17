import Order from 'entities/Order';
import {ID} from 'entities/Common';
import AppType from 'entities/AppType';

export default abstract class IOrderManager {
  abstract getDeliveryPriceInCents(distanceMiles: number): number;

  abstract createOrder(
    cartId: ID,
    userId: ID,
    setId: ID,
    clientAddress: {
      lat: number;
      lng: number;
      description: string;
    },
    restaurantId: ID,
    numberOfDays: number,
  ): Promise<Order>;

  abstract setOrderRestaurant(
    id: ID,
    restaurantId: ID,
    orderInfoId: string,
    priceCents: number,
  ): Promise<void>;

  abstract getOrders(): Promise<Order[]>;

  abstract getOrderById(orderId: string): Promise<Order>;

  abstract getOrdersByRestaurantId(userId: ID): Promise<Order[]>;

  abstract getOrdersByCartId(id: string): Promise<Order[]>;

  abstract getOrdersByCourierId(userId: ID): Promise<Order[]>;

  abstract getOrdersByUserId(userId: ID): Promise<Order[]>;

  abstract getOrdersForDelivery(appType: AppType): Promise<Order[]>;

  abstract getOrderHistory(userId: ID, appType: AppType): Promise<Order[]>;

  abstract evaluateOrder(
    role: AppType,
    userId: string,
    orderId: string,
    rating: number,
  ): Promise<void>;

  abstract acceptOrder(userId: string, orderId: string): Promise<void>;

  abstract markOrder(
    appType: AppType,
    orderId: string,
    bagId: string,
    // latLng: LatLng | undefined,
  ): Promise<void>;

  abstract deleteOrder(userId: ID, orderId: ID, appType: AppType): Promise<void>;

  abstract getCurrentOrder(userId: string, appType: AppType): Promise<Order | undefined>;

  abstract removeTheCurrentCourier(orderId: string): Promise<void>;
}
