import Restaurant from 'database/entities/Restaurant';
import {ID} from '../../../entities/Common';
import Address from 'database/entities/Address';
import Cuisine from 'database/entities/Cuisine';

export default abstract class IRestaurantStore {
  abstract getRestaurantById(id: string): Promise<Restaurant>;

  abstract getRestaurants(): Promise<Restaurant[]>;

  abstract getRestaurantByUserId(userId: ID): Promise<Restaurant>;

  abstract createRestaurant(
    userId: string,
    imageId: string,
    title: string,
    description: string,
    address: Address,
    cuisines: Cuisine[],
  ): Promise<void>;

  abstract updateRestaurant(
    id: string,
    imageId: string,
    title: string,
    description: string,
    address: Address,
    cuisines: Cuisine[],
  ): Promise<Restaurant>;

  abstract deleteRestaurant(id: string): Promise<void>;
}
