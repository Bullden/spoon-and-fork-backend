import {Args, Query, Resolver} from '@nestjs/graphql';
import IIngredientManager from 'managers/ingredient/IIngredientManager';
import Ingredient from 'graphql/entities/ingredient/Ingredient';
import {mapIngredientsToGQL, mapIngredientToGQL} from 'graphql/entities/Mappers';

@Resolver()
export default class IngredientResolver {
  constructor(private readonly ingredientManager: IIngredientManager) {}

  @Query(() => Ingredient)
  async ingredientById(@Args({name: 'id', type: () => String}) id: string) {
    return mapIngredientToGQL(await this.ingredientManager.findIngredientByIdOrThrow(id));
  }

  @Query(() => [Ingredient])
  async ingredientsByDishId(@Args({name: 'id', type: () => String}) id: string) {
    return mapIngredientsToGQL(await this.ingredientManager.getIngredientsByDishId(id));
  }
}
