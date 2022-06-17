import IRestaurantManager from 'managers/restaurant/IRestaurantManager';
import IRestaurantStore from 'database/stores/restaurant/IRestaurantStore';
import Restaurant from 'entities/Restaurant';
import {mapRestaurantFromDb, mapRestaurantsFromDb} from 'database/entities/Mappers';
import {Injectable} from '@nestjs/common';
import SpoonError from 'SpoonError';
import IAuthManager from '../auth/IAuthManager';
import AppType from '../../entities/AppType';
import {Platform} from '../../entities/Platform';
import IAddressStore from 'database/stores/address/IAddressStore';
import ICuisineStore from 'database/stores/cuisine/ICuisineStore';
import IAccountManager from '../account/IAccountManager';
import {ID} from '../../entities/Common';

@Injectable()
export default class RestaurantManager extends IRestaurantManager {
  constructor(
    private restaurantStore: IRestaurantStore,
    private authManager: IAuthManager,
    private accountManager: IAccountManager,
    private locationStore: IAddressStore,
    private cuisineStore: ICuisineStore,
  ) {
    super();
  }

  async getRestaurantById(id: string) {
    const restaurant = await this.restaurantStore.getRestaurantById(id);

    if (!restaurant) throw new SpoonError('there is no such restaurant');

    return mapRestaurantFromDb(restaurant);
  }

  async getRestaurants(): Promise<Restaurant[]> {
    return mapRestaurantsFromDb(await this.restaurantStore.getRestaurants());
  }

  async getCurrentRestaurant(userId: string) {
    const restaurant = await this.restaurantStore.getRestaurantByUserId(userId);
    return !restaurant ? undefined : mapRestaurantFromDb(restaurant);
  }

  async createRestaurant(
    name: string,
    email: string,
    phoneNumber: string,
    password: string,
    placeId: string | undefined,
    lat: number,
    lng: number,
    addressDescription: string,
    imageId: string,
    title: string,
    restaurantDescription: string,
    cuisines: string[],
  ): Promise<void> {
    const user = await this.authManager.registerRestaurant(
      AppType.Restaurant,
      Platform.Android,
      email,
      password,
      name,
      phoneNumber,
    );

    const date = new Date();
    const address = await this.locationStore.createAddress({
      placeId,
      lat,
      lng,
      description: addressDescription,
      entrance: undefined,
      floor: undefined,
      apartment: undefined,
      date,
    });

    const cuisinesFromDB = await this.cuisineStore.getCuisinesByIds(cuisines);

    return this.restaurantStore.createRestaurant(
      user.id,
      imageId,
      title,
      restaurantDescription,
      address,
      cuisinesFromDB,
    );
  }

  async updateRestaurant(
    id: string,
    name: string,
    email: string,
    phoneNumber: string,
    placeId: string | undefined,
    lat: number,
    lng: number,
    addressDescription: string,
    imageId: string,
    title: string,
    restaurantDescription: string,
    cuisines: string[],
  ): Promise<Restaurant> {
    const restaurant = await this.getRestaurantById(id);

    await this.accountManager.updateAccount(restaurant.user.id, {
      email,
      name,
      phoneNumber,
    });

    await this.accountManager.updateAccountImage(restaurant.user.id, imageId);

    const date = new Date();
    const address = await this.locationStore.updateAddress({
      id: restaurant.address.id,
      placeId,
      lat,
      lng,
      description: addressDescription,
      entrance: undefined,
      floor: undefined,
      apartment: undefined,
      date,
    });

    const cuisinesFromDB = await this.cuisineStore.getCuisinesByIds(cuisines);

    return mapRestaurantFromDb(
      await this.restaurantStore.updateRestaurant(
        id,
        imageId,
        title,
        restaurantDescription,
        address,
        cuisinesFromDB,
      ),
    );
  }

  async deleteRestaurant(restaurantId: ID) {
    await this.restaurantStore.deleteRestaurant(restaurantId);
  }
}
