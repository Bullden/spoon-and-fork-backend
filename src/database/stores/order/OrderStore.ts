import IOrderStore from 'database/stores/order/IOrderStore';
import {InjectRepository} from '@nestjs/typeorm';
import {
  IsNull,
  Repository,
  // SelectQueryBuilder
} from 'typeorm';
import Order from 'database/entities/Order';
import Bag from 'database/entities/Bag';
import Restaurant from 'database/entities/Restaurant';
import OrderMark from 'database/entities/OrderMark';
import {OrderPlacement, OrderState} from 'entities/Order';
import {ID} from 'entities/Common';
// import {MarkOrderAction} from 'graphql/entities/order/MarkOrderAction';
import OrderInfo from 'database/entities/OrderInfo';
import LatLng from 'entities/LatLng';

export default class OrderStore extends IOrderStore {
  constructor(
    @InjectRepository(Order)
    private readonly repository: Repository<Order>,
    @InjectRepository(OrderInfo)
    private readonly orderInfoRepository: Repository<OrderInfo>,
    @InjectRepository(Bag)
    private readonly bagRepository: Repository<Bag>,
    @InjectRepository(OrderMark)
    private readonly orderMarkRepository: Repository<OrderMark>,
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
  ) {
    super();
  }

  private readonly allRelations = [
    'orderInfo',
    'orderInfo.clientAddress',
    'client',
    'client.user',
    'restaurant',
    'restaurant.address',
    'restaurant.user',
    'restaurant.cuisines',
    'bag',
    'set',
    'set.statuses',
    'set.dishes',

    'set.dishes.ingredients',
    'courier',
    'courier.user',
    'cart',
  ];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getRestaurantsByCuisines(cuisines: string[]) {
    return this.restaurantRepository.find({
      join: {
        alias: 'r',
        leftJoinAndSelect: {
          cuisines: 'r.cuisines',
        },
      },
    });
  }

  // async getRestaurantsWithMinOrdersQuantity(cuisines: string[]) {
  //   const availableRestaurantsQuery = await this.restaurantRepository
  //     .createQueryBuilder('r')
  //     .where('r.cuisineId IN (:...cuisinesIds)', {
  //       cuisinesIds: cuisines,
  //     });
  //
  //   const restaurantsByCuisines: {
  //     cuisine: string;
  //     restaurants: SelectQueryBuilder<Restaurant>;
  //   }[] = [];
  //
  //   for (const cuisine of cuisines) {
  //     const cuisineRestaurants = availableRestaurantsQuery.where('r.cuisineId = cuisine');
  //
  //     restaurantsByCuisines.push({cuisine, restaurants: cuisineRestaurants});
  //   }
  //
  //   const restaurantsWithMinOrdersQuantityByCuisines = restaurantsByCuisines.map(
  //     async (item) => {
  //       return {
  //         cuisine: item.cuisine,
  //         restaurantsIds: await this.repository
  //           .createQueryBuilder('o')
  //           .where('o.restaurantId IN (:...restaurantsIds)', {
  //             restaurantsIds: item.restaurants,
  //           })
  //           .select('o.id')
  //           .addSelect('SUM(o.restaurantId)', 'sum')
  //           .groupBy('o.restaurantId')
  //           .select('MIN (sum)')
  //           .select(['o.restaurantId'])
  //           .getRawMany(),
  //       };
  //     },
  //   );
  //
  //   return restaurantsWithMinOrdersQuantityByCuisines;
  // }

  async getOrderByIdOrFail(id: string) {
    return this.repository.findOneOrFail(id, {
      relations: this.allRelations,
    });
  }

  async getOrderInfoLocationsById(clientAddressId: string) {
    return this.orderInfoRepository.findOneOrFail(clientAddressId);
  }

  async createOrderInfo(
    clientAddress: {id: ID},
    priceCents: number | undefined,
    distanceMiles: number,
  ) {
    const newOrderInfo = this.orderInfoRepository.create({
      clientAddress,
      priceCents,
      distanceMiles,
    });
    await this.orderInfoRepository.insert(newOrderInfo);
    await this.orderInfoRepository.save(newOrderInfo);
    return this.orderInfoRepository.findOneOrFail({
      id: newOrderInfo.id,
    });
  }

  async createOrder(
    client: {id: ID},
    orderInfo: {id: ID},
    cart: {id: ID},
    set: {id: ID},
    restaurant: {id: ID},
    state: OrderState.ReadyForDelivery,
    placement: OrderPlacement.Restaurant,
    date: Date,
  ) {
    const newOrder = this.repository.create({
      client,
      orderInfo,
      cart,
      set,
      restaurant,
      state,
      placement,
      date,
    });

    await this.repository.insert(newOrder);
    await this.repository.save(newOrder);

    return this.getOrderByIdOrFail(newOrder.id);
  }

  async setOrderRestaurant(
    id: string,
    restaurant: {id: ID},
    orderInfoId: string,
    priceCents: number,
  ) {
    await this.repository.update(id, {
      restaurant,
    });

    await this.orderInfoRepository.update(
      {id: orderInfoId},
      {
        priceCents,
      },
    );
  }

  async getOrders() {
    return this.repository.find({
      relations: this.allRelations,
    });
  }

  async getOrdersByRestaurantId(id: string) {
    return this.repository.find({
      where: {restaurantId: id},
      relations: this.allRelations,
    });
  }

  async getOrdersByCartId(id: string) {
    return this.repository.find({
      where: {cartId: id},
      relations: this.allRelations,
    });
  }

  async getOrdersByUserId(id: string) {
    return this.repository.find({
      where: {clientId: id},
      relations: this.allRelations,
    });
  }

  async getOrdersByCourierId(id: string) {
    return this.repository.find({
      where: {courierId: id},
      relations: this.allRelations,
    });
  }

  async getOrdersForDelivery() {
    return this.repository.find({
      where: {
        placement: OrderPlacement.Restaurant,
        state: OrderState.ReadyForDelivery,
        courierId: IsNull(),
      },
      relations: this.allRelations,
    }); // use query builder
  }

  async getClientOrderHistory(clientId: ID) {
    return this.repository.find({
      where: {
        clientId,
      },
      relations: this.allRelations,
    });
  }

  async getCourierOrderHistory(courierId: ID) {
    return this.repository.find({
      where: {
        courierId,
      },
      relations: this.allRelations,
    });
  }

  async updateRating(id: string, rating: number) {
    await this.repository.update(id, {rating});
  }

  async assignCourier(id: ID, courier: {id: ID}, state: OrderState.AcceptedByCourier) {
    await this.repository.update(id, {
      courier,
      state,
    });
  }

  // async getRequestedPaymentByOrderId(id: string) {
  //   const order = await this.repository.findOneOrFail(id, {
  //     relations: ['requestedDeliveryPayment'],
  //   });
  //
  //   return order.requestedPayment;
  // }
  //
  // async getIncomePaymentByOrderId(id: string) {
  //   const order = await this.repository.findOneOrFail(id, {
  //     relations: ['deliveryPayment'],
  //   });
  //   return order.payment;
  // }
  //
  // async updateRequestedPayment(id: string, requestedPayment: {id: string}) {
  //   await this.repository.update(id, {requestedPayment});
  // }
  //
  // async updatePayment(
  //   id: string,
  //   payment: {id: string},
  //   state: OrderState.ReadyForDelivery,
  // ) {
  //   await this.repository.update(id, {
  //     payment,
  //     state,
  //   });
  // }

  async markOrder(
    id: ID,
    type: 'client' | 'courier' | 'restaurant',
    // action: MarkOrderAction,
    // mark: {id: ID},
    state: OrderState,
    // placement: OrderPlacement | undefined,
  ): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {
      state,
    };

    await this.repository.update(id, updateData);
  }

  async createMark(latLng: LatLng | undefined): Promise<OrderMark> {
    const newMark = this.orderMarkRepository.create({
      lat: latLng && latLng.lat,
      lng: latLng && latLng.lng,
    });
    await this.orderMarkRepository.insert(newMark);
    return newMark;
  }

  async deleteOrder(id: string): Promise<void> {
    await this.repository.delete({id});
  }

  async currentClientOrderById(id: string) {
    return this.repository.findOne({
      where: [
        {
          clientId: id,
          state: OrderState.Delivering,
        },
        {
          clientId: id,
          state: OrderState.AcceptedByCourier,
        },
        {
          clientId: id,
          state: OrderState.Delivered,
        },
        {
          clientId: id,
          state: OrderState.AcceptedByRestaurant,
        },
        {
          clientId: id,
          state: OrderState.ReadyForDelivery,
        },
        {
          clientId: id,
          state: OrderState.WaitingForPayment,
        },
      ],
      relations: this.allRelations,
    });
  }

  async currentCourierOrderById(id: string) {
    return this.repository.findOne({
      where: [
        {
          courierId: id,
          state: OrderState.AcceptedByCourier,
        },
        {
          courierId: id,
          state: OrderState.Delivering,
        },
      ],
      relations: this.allRelations,
    });
  }

  async removeCourier(orderId: string) {
    await this.repository.update(orderId, {
      courierId: undefined,
      state: OrderState.ReadyForDelivery,
    });
  }
}
