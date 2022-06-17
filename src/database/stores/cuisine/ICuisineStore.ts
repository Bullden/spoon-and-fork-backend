import Cuisine from 'database/entities/Cuisine';

export default abstract class ICuisineStore {
  abstract findCuisineById(id: string): Promise<Cuisine | undefined>;

  abstract getCuisines(): Promise<Cuisine[]>;

  abstract getCuisinesByRestaurantId(id: string): Promise<Cuisine[]>;

  abstract getCuisinesByIds(ids: string[]): Promise<Cuisine[]>;

  abstract updateCuisine(
    id: string,
    imageId: string,
    nationality: string,
  ): Promise<Cuisine>;

  abstract createCuisine(imageId: string, nationality: string): Promise<void>;

  abstract deleteCuisine(id: string): Promise<void>;
}
