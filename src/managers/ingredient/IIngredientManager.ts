import Ingredient from 'entities/Ingredient';

export default abstract class IIngredientManager {
  abstract findIngredientByIdOrThrow(id: string): Promise<Ingredient>;

  abstract getIngredientsByDishId(id: string): Promise<Ingredient[]>;
}
