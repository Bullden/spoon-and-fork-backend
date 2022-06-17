import IIngredientManager from 'managers/ingredient/IIngredientManager';
import IIngredientStore from 'database/stores/ingredient/IIngredientStore';
import Ingredient from 'entities/Ingredient';
import {mapIngredientFromDb, mapIngredientsFromDb} from 'database/entities/Mappers';
import {Injectable} from '@nestjs/common';
import SpoonError from 'SpoonError';

@Injectable()
export default class IngredientManager extends IIngredientManager {
  constructor(private ingredientStore: IIngredientStore) {
    super();
  }

  async findIngredientByIdOrThrow(id: string): Promise<Ingredient> {
    const ingredient = await this.ingredientStore.findIngredientById(id);
    if (!ingredient) throw new SpoonError('Ingredient not found');
    return mapIngredientFromDb(ingredient);
  }

  async getIngredientsByDishId(id: string) {
    const ingredients = await this.ingredientStore.getIngredientsByDishIdOrFail(id);
    return mapIngredientsFromDb(ingredients);
  }
}
