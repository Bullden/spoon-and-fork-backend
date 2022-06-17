import Restaurant from 'entities/Restaurant';
import {ID} from '../../entities/Common';

export default abstract class IRestaurantManager {
  abstract getRestaurantById(id: string): Promise<Restaurant>;

  abstract getRestaurants(): Promise<Restaurant[]>;

  abstract getCurrentRestaurant(userId: string): Promise<Restaurant | undefined>;

  abstract createRestaurant(
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
  ): Promise<void>;

  abstract updateRestaurant(
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
  ): Promise<Restaurant>;

  abstract deleteRestaurant(restaurantId: ID): Promise<void>;
}
