import {Args, ID, Mutation, Query, Resolver} from '@nestjs/graphql';
import IDishManager from 'managers/dish/IDishManager';
import Dish from 'graphql/entities/dish/Dish';
import {mapDishesToGQL, mapDishToGQL} from 'graphql/entities/Mappers';
import Roles from 'enhancers/decorators/Roles';

@Resolver()
export default class DishResolver {
  constructor(private readonly dishManager: IDishManager) {}

  @Query(() => Dish)
  async dishById(@Args({name: 'id', type: () => String}) id: string) {
    return mapDishToGQL(await this.dishManager.findDishByIdOrThrow(id));
  }

  @Query(() => [Dish], {name: 'dishes'})
  @Roles('Admin')
  async getDishes() {
    return mapDishesToGQL(await this.dishManager.getDishes());
  }

  @Query(() => [Dish])
  async dishesBySetId(@Args({name: 'id', type: () => String}) id: string) {
    return mapDishesToGQL(await this.dishManager.getDishesBySetId(id));
  }

  @Mutation(() => Dish)
  @Roles('Admin')
  async updateDish(
    @Args('id') id: string,
    @Args('name') name: string,
    @Args('description') description: string,
    @Args('weight') weight: string,
    @Args('kal') kal: string,
    @Args({name: 'ingredients', type: () => [String]}) ingredients: string[],
    @Args({name: 'sets', type: () => [String]}) sets: string[],
    @Args('imageId') imageId: string,
  ) {
    return mapDishToGQL(
      await this.dishManager.updateDish(
        id,
        imageId,
        name,
        description,
        weight,
        kal,
        ingredients,
        sets,
      ),
    );
  }

  @Mutation(() => Boolean)
  @Roles('Admin')
  async createDish(
    @Args('imageId') imageId: string,
    @Args('name') name: string,
    @Args('description') description: string,
    @Args('weight') weight: string,
    @Args('kal') kal: string,
    @Args({name: 'ingredients', type: () => [String]}) ingredients: string[],
    @Args({name: 'sets', type: () => [String]}) sets: string[],
  ) {
    await this.dishManager.createDish(
      imageId,
      name,
      description,
      weight,
      kal,
      ingredients,
      sets,
    );

    return true;
  }

  @Mutation(() => Boolean)
  @Roles('Admin')
  async deleteDish(@Args({name: 'dishId', type: () => ID}) dishId: string) {
    await this.dishManager.deleteDish(dishId);
    return true;
  }
}
