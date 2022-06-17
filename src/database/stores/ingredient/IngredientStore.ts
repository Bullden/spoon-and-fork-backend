import IIngredientStore from './IIngredientStore';
import {InjectRepository} from '@nestjs/typeorm';
import Ingredient from 'database/entities/Ingredient';
import {Repository} from 'typeorm';
import Dish from 'database/entities/Dish';
import SpoonError from 'SpoonError';

export default class IngredientStore extends IIngredientStore {
  constructor(
    @InjectRepository(Ingredient)
    private readonly repository: Repository<Ingredient>,
    @InjectRepository(Dish)
    private readonly dish: Repository<Dish>,
  ) {
    super();
  }

  async findIngredientById(id: string) {
    return this.repository.findOne({
      where: {id},
    });
  }

  async getIngredientsByDishIdOrFail(id: string) {
    const dish = await this.dish.findOneOrFail(id, {relations: ['ingredients']});
    if (!dish.ingredients) throw new SpoonError('Dish ingredients not found');
    return dish.ingredients;
  }

  async createIngredients(ingredienNames: string[]) {
    const ingredients = ingredienNames.map((ingredienName) =>
      this.repository.create({name: ingredienName}),
    );

    await this.repository.insert(ingredients);
    await this.repository.save(ingredients);

    return ingredients;
  }
}
