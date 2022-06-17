import {Args, ID, Mutation, Query, Resolver} from '@nestjs/graphql';
import ICuisineManager from 'managers/cuisine/ICuisineManager';
import Cuisine from 'graphql/entities/cuisine/Cuisine';
import {mapCuisinesToGQL, mapCuisineToGQL} from 'graphql/entities/Mappers';
import Roles from 'enhancers/decorators/Roles';

@Resolver()
export default class CuisineResolver {
  constructor(private readonly cuisineManager: ICuisineManager) {}

  @Query(() => Cuisine)
  async cuisineById(@Args({name: 'id', type: () => String}) id: string) {
    return mapCuisineToGQL(await this.cuisineManager.findCuisineByIdOrThrow(id));
  }

  @Query(() => [Cuisine], {name: 'cuisines'})
  @Roles('Admin', 'Client')
  async getCuisines() {
    return mapCuisinesToGQL(await this.cuisineManager.getCuisines());
  }

  @Query(() => [Cuisine], {name: 'cuisinesByRestaurantId'})
  @Roles('Admin')
  async cuisinesByRestaurantId(@Args({name: 'id', type: () => String}) id: string) {
    return mapCuisinesToGQL(await this.cuisineManager.getCuisinesByRestaurantId(id));
  }

  @Mutation(() => Cuisine)
  @Roles('Admin')
  async updateCuisine(
    @Args('id') id: string,
    @Args('imageId') imageId: string,
    @Args('nationality') nationality: string,
  ) {
    return mapCuisineToGQL(
      await this.cuisineManager.updateCuisine(id, imageId, nationality),
    );
  }

  @Mutation(() => Boolean)
  @Roles('Admin')
  async createCuisine(
    @Args('imageId') imageId: string,
    @Args('nationality') nationality: string,
  ) {
    await this.cuisineManager.createCuisine(imageId, nationality);

    return true;
  }

  @Mutation(() => Boolean)
  @Roles('Admin')
  async deleteCuisine(@Args({name: 'cuisineId', type: () => ID}) cuisineId: string) {
    await this.cuisineManager.deleteCuisine(cuisineId);
    return true;
  }
}
