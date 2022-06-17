import Cuisine from 'entities/Cuisine';
import {ID} from 'entities/Common';

export default abstract class ICuisineManager {
  abstract findCuisineByIdOrThrow(id: string): Promise<Cuisine>;

  abstract getCuisines(): Promise<Cuisine[]>;

  abstract getCuisinesByRestaurantId(id: string): Promise<Cuisine[]>;

  abstract updateCuisine(
    id: string,
    imageId: string,
    nationality: string,
  ): Promise<Cuisine>;

  abstract createCuisine(imageId: string, nationality: string): Promise<void>;

  abstract deleteCuisine(cuisineId: ID): Promise<void>;
}
