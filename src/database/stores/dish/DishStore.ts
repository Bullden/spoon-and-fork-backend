import IDishStore from './IDishStore';
import {InjectRepository} from '@nestjs/typeorm';
import Dish from 'database/entities/Dish';
import {In, Repository} from 'typeorm';
import Set from 'database/entities/Set';
import SpoonError from 'SpoonError';
import Ingredient from 'database/entities/Ingredient';

export default class DishStore extends IDishStore {
  constructor(
    @InjectRepository(Dish)
    private readonly repository: Repository<Dish>,
    @InjectRepository(Set)
    private readonly setRepository: Repository<Set>,
    @InjectRepository(Ingredient)
    private readonly ingredientRepository: Repository<Ingredient>,
  ) {
    super();
  }

  async findDishById(id: string) {
    return this.repository.findOne(id, {
      relations: ['ingredients'],
    });
  }

  async findDishOrThrowById(id: string) {
    return this.repository.findOneOrFail(id, {
      relations: ['ingredients'],
    });
  }

  async getDishes() {
    return this.repository.find({
      relations: ['ingredients'],
    });
  }

  async getSelectedDishes(ids: string[]) {
    return this.repository.find({
      relations: ['ingredients'],
      where: {id: In(ids)},
    });
  }

  async getDishesBySetIdOrFail(id: string) {
    const set = await this.setRepository.findOneOrFail(id, {
      relations: ['dishes', 'dishes.ingredients'],
    });
    if (!set.dishes) throw new SpoonError('Set dishes not found');
    return set.dishes;
  }

  async updateDish(
    id: string,
    imageId: string,
    name: string,
    description: string,
    weight: string,
    kal: string,
    ingredients: Ingredient[],
  ) {
    await this.repository.update(id, {
      imageId,
      name,
      description,
      weight,
      kal,
    });

    const dish = await this.findDishOrThrowById(id);
    if (!dish.ingredients) throw new Error('dish.ingredients must be not undefined');
    dish.ingredients = ingredients;

    await this.repository.save(dish);

    return dish;
  }

  async createDish(
    imageId: string,
    name: string,
    description: string,
    weight: string,
    kal: string,
    ingredients: Ingredient[],
  ) {
    const dish = await this.repository.create({
      imageId,
      name,
      description,
      weight,
      kal,
      ingredients,
    });

    await this.repository.insert(dish);
    await this.repository.save(dish);

    return this.repository.findOneOrFail({
      id: dish.id,
    });
  }

  async deleteDish(id: string): Promise<void> {
    await this.repository.delete({id});
  }
}
