import ICuisineManager from 'managers/cuisine/ICuisineManager';
import ICuisineStore from 'database/stores/cuisine/ICuisineStore';
import Cuisine from 'entities/Cuisine';
import {mapCuisineFromDb, mapCuisinesFromDb} from 'database/entities/Mappers';
import {Injectable} from '@nestjs/common';
import SpoonError from 'SpoonError';
import {ID} from 'entities/Common';

@Injectable()
export default class CuisineManager extends ICuisineManager {
  constructor(private cuisineStore: ICuisineStore) {
    super();
  }

  async findCuisineByIdOrThrow(id: string): Promise<Cuisine> {
    const cuisine = await this.cuisineStore.findCuisineById(id);
    if (!cuisine) throw new SpoonError('Cuisine not found');
    return mapCuisineFromDb(cuisine);
  }

  async getCuisines(): Promise<Cuisine[]> {
    return mapCuisinesFromDb(await this.cuisineStore.getCuisines());
  }

  async getCuisinesByRestaurantId(id: string) {
    const cuisines = await this.cuisineStore.getCuisinesByRestaurantId(id);
    return mapCuisinesFromDb(cuisines);
  }

  async updateCuisine(
    id: string,
    imageId: string,
    nationality: string,
  ): Promise<Cuisine> {
    return mapCuisineFromDb(
      await this.cuisineStore.updateCuisine(id, imageId, nationality),
    );
  }

  async createCuisine(imageId: string, nationality: string): Promise<void> {
    return this.cuisineStore.createCuisine(imageId, nationality);
  }

  async deleteCuisine(cuisineId: ID) {
    await this.cuisineStore.deleteCuisine(cuisineId);
  }
}
