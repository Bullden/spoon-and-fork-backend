import {Injectable} from '@nestjs/common';
import IAddressManager from 'managers/address/IAddressManager';
import AppType from 'entities/AppType';
import {mapRestaurantFromDb} from 'database/entities/Mappers';
import IRestaurantStore from 'database/stores/restaurant/IRestaurantStore';
import IRoadsService from 'services/googleRoads/IRoadsService';
import SpoonError from 'SpoonError';
import IGeoService from 'services/geolocation/IGeoService';
import IOrderStore from '../../database/stores/order/IOrderStore';
import IUserStore from 'database/stores/user/IUserStore';
import Address from 'entities/Address';

@Injectable()
export default class AddressManager implements IAddressManager {
  constructor(
    private readonly restaurantStore: IRestaurantStore,
    private readonly orderStore: IOrderStore,
    private readonly roadsService: IRoadsService,
    private readonly geoService: IGeoService,
    private readonly userStore: IUserStore,
  ) {}

  async getDistanceToRestaurant(
    restaurantId: string,
    lat: number,
    lng: number,
    appType: AppType,
  ) {
    if (appType !== AppType.Client) throw new SpoonError('you do not have enough rights');

    const restaurant = mapRestaurantFromDb(
      await this.restaurantStore.getRestaurantById(restaurantId),
    );

    const distanceMeters =
      // (await this.roadsService.getDistanceMeters(
      //   {
      //     lat,
      //     lng,
      //   },
      //   {
      //     lat: restaurant.address.lat,
      //     lng: restaurant.address.lng,
      //   },
      // )) ||
      await this.geoService.getDistanceMeters(
        {lat, lng},
        {lat: restaurant.address.lat, lng: restaurant.address.lng},
      );
    const distanceMiles = distanceMeters / 1609;
    return distanceMiles;
  }

  async getClientOrdersAddresses(userId: string): Promise<Address[]> {
    const client = await this.userStore.getClientOrThrow(userId);
    const orders = await this.orderStore.getOrdersByUserId(client.id);
    const ordersUniqueByDescription = [
      ...new Map(
        orders.map((item) => [item.orderInfo.clientAddress.description, item]),
      ).values(),
    ];
    ordersUniqueByDescription.sort((a, b) => {
      const c = new Date(a.orderInfo.clientAddress.date);
      const d = new Date(b.orderInfo.clientAddress.date);
      return +c - +d;
    });
    return ordersUniqueByDescription
      .splice(ordersUniqueByDescription.length - 3, 3)
      .map((item) => item.orderInfo.clientAddress);
  }

  //
  //   async getUserAddressesFromOrder(clientAddressId: string) {
  //     const userAddresses = await this.orderStore.getOrderInfoLocationsById(
  //       clientAddressId,
  //     );
  //     return mapAddressesFromDB(userAddresses);
  //   }
}
