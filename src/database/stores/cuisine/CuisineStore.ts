import ICuisineStore from './ICuisineStore';
import {InjectRepository} from '@nestjs/typeorm';
import Cuisine from 'database/entities/Cuisine';
import {Repository, In} from 'typeorm';
import Restaurant from 'database/entities/Restaurant';
import SpoonError from 'SpoonError';

export default class CuisineStore extends ICuisineStore {
  constructor(
    @InjectRepository(Cuisine)
    private readonly repository: Repository<Cuisine>,
    @InjectRepository(Restaurant)
    private readonly restaurant: Repository<Restaurant>,
  ) {
    super();
  }

  async findCuisineById(id: string) {
    return this.repository.findOneOrFail(id);
  }

  async getCuisines() {
    return this.repository.find();
  }

  async getCuisinesByRestaurantId(id: string) {
    const restaurant = await this.restaurant.findOneOrFail(id, {relations: ['cuisines']});
    if (!restaurant.cuisines) throw new SpoonError('Restaurant cuisines not found');
    return restaurant.cuisines;
  }

  async getCuisinesByIds(ids: string[]) {
    return this.repository.find({
      where: {id: In(ids)},
    });
  }

  async updateCuisine(id: string, imageId: string, nationality: string) {
    await this.repository.update(id, {
      imageId,
      nationality,
    });

    return this.findCuisineById(id);
  }

  async createCuisine(imageId: string, nationality: string) {
    await this.repository.insert({imageId, nationality});
  }

  async deleteCuisine(id: string): Promise<void> {
    await this.repository.delete({id});
  }
}
