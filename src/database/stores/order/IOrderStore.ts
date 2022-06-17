import Order from 'database/entities/Order';
import {OrderPlacement, OrderState} from 'entities/Order';
import OrderMark from 'database/entities/OrderMark';
// import IncomePayment from 'database/entities/IncomePayment';
// import RequestedIncomePayment from 'database/entities/RequestedIncomePayment';
import {ID} from 'entities/Common';
import LatLng from 'entities/LatLng';
import OrderInfo from 'database/entities/OrderInfo';
import Restaurant from 'database/entities/Restaurant';

export default abstract class IOrderStore {
  abstract createOrder(
    client: {id: ID},
    orderInfo: {id: ID},
    cart: {id: ID},
    set: {id: ID},
    restaurant: {id: ID},
    state: OrderState.ReadyForDelivery,
    placement: OrderPlacement.Restaurant,
    date: Date,
  ): Promise<Order>;

  abstract setOrderRestaurant(
    id: ID,
    restaurant: {id: ID},
    orderInfoId: string,
    priceCents: number,
  ): Promise<void>;

  abstract createOrderInfo(
    clientAddress: {id: ID},
    priceCents: number | undefined,
    distanceMiles: number,
  ): Promise<OrderInfo>;

  abstract getOrders(): Promise<Order[]>;

  abstract getOrderByIdOrFail(id: ID): Promise<Order>;

  abstract getOrderInfoLocationsById(clientAddressId: ID): Promise<OrderInfo>;

  abstract getOrdersByRestaurantId(id: ID): Promise<Order[]>;

  abstract getOrdersByCartId(id: ID): Promise<Order[]>;

  abstract getOrdersByUserId(id: ID): Promise<Order[]>;

  abstract getOrdersByCourierId(id: ID): Promise<Order[]>;

  abstract getOrdersForDelivery(): Promise<Order[]>;

  abstract getRestaurantsByCuisines(cuisines: string[]): Promise<Restaurant[]>;

  // abstract getRestaurantsWithMinOrdersQuantity(
  //   cuisines: string[],
  // ): Promise<{cuisine: string; restaurantsIds: string[]}[]>;

  abstract getClientOrderHistory(clientId: ID): Promise<Order[]>;

  abstract getCourierOrderHistory(courierId: ID): Promise<Order[]>;

  abstract updateRating(id: ID, rating: number): Promise<void>;

  abstract assignCourier(
    id: ID,
    courier: {id: ID},
    state: OrderState.AcceptedByCourier,
  ): Promise<void>;

  // abstract getRequestedPaymentByOrderId(
  //   id: ID,
  // ): Promise<RequestedIncomePayment | undefined>;
  //
  // abstract getIncomePaymentByOrderId(id: ID): Promise<IncomePayment | undefined>;

  abstract markOrder(
    id: ID,
    type: 'client' | 'courier' | 'restaurant',
    // action: MarkOrderAction,
    // mark: {id: ID},
    state: OrderState,
    // placement: OrderPlacement | undefined,
  ): Promise<void>;

  // abstract updateRequestedPayment(
  //   id: string,
  //   requestedDeliveryPayment: {id: string},
  // ): Promise<void>;
  //
  // abstract updatePayment(
  //   id: string,
  //   deliveryPayment: {id: string},
  //   state: OrderState.ReadyForDelivery,
  // ): Promise<void>;

  abstract createMark(latLng: LatLng | undefined): Promise<OrderMark>;

  abstract deleteOrder(id: string): Promise<void>;

  abstract currentClientOrderById(id: string): Promise<Order | undefined>;

  abstract currentCourierOrderById(id: string): Promise<Order | undefined>;

  abstract removeCourier(orderId: string): Promise<void>;
}
