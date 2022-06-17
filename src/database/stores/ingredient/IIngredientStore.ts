import Ingredient from 'entities/Ingredient';

export default abstract class IIngredientStore {
  abstract findIngredientById(id: string): Promise<Ingredient | undefined>;

  abstract getIngredientsByDishIdOrFail(id: string): Promise<Ingredient[]>;

  abstract createIngredients(ingredientNames: string[]): Promise<Ingredient[]>;
}
