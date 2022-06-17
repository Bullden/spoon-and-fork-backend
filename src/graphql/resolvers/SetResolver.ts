import {Args, ID, Mutation, Query, Resolver} from '@nestjs/graphql';
import ISetManager from 'managers/set/ISetManager';
import Set from 'graphql/entities/set/Set';
import {mapSetsToGQL, mapSetToGQL} from 'graphql/entities/Mappers';
import Roles from 'enhancers/decorators/Roles';
import SetIdAndDay from 'graphql/entities/set/SetIdAndDay';

@Resolver()
export default class SetResolver {
  constructor(private readonly setManager: ISetManager) {}

  @Query(() => Set)
  async setById(@Args({name: 'id', type: () => String}) id: string) {
    return mapSetToGQL(await this.setManager.findSetByIdOrThrow(id));
  }

  @Query(() => [Set])
  async setsByCuisineId(@Args({name: 'id', type: () => String}) id: string) {
    return mapSetsToGQL(await this.setManager.getSetsByCuisineId(id));
  }

  @Query(() => [Set], {name: 'sets'})
  async getSets() {
    return mapSetsToGQL(await this.setManager.getSets());
  }

  @Query(() => [Set], {name: 'setsByDishId'})
  @Roles('Admin')
  async getSetsByDishId(@Args({name: 'id', type: () => String}) id: string) {
    return mapSetsToGQL(await this.setManager.getSetsByDishId(id));
  }

  @Mutation(() => Set)
  @Roles('Admin')
  async updateSet(
    @Args('id') id: string,
    @Args('name') name: string,
    @Args('imageId') imageId: string,
    @Args('priceCents') priceCents: string,
    @Args('cuisineId') cuisineId: string,
    @Args({name: 'dishes', type: () => [String]}) dishes: string[],
    @Args({name: 'statuses', type: () => [String]}) statuses: string[],
  ) {
    return mapSetToGQL(
      await this.setManager.updateSet(
        id,
        name,
        imageId,
        priceCents,
        cuisineId,
        dishes,
        statuses,
      ),
    );
  }

  @Mutation(() => Boolean)
  @Roles('Admin')
  async createSet(
    @Args('name') name: string,
    @Args('imageId') imageId: string,
    @Args('priceCents') priceCents: string,
    @Args('cuisineId') cuisineId: string,
    @Args({name: 'dishes', type: () => [String]}) dishes: string[],
    @Args({name: 'statuses', type: () => [String]}) statuses: string[],
  ) {
    await this.setManager.createSet(
      name,
      imageId,
      priceCents,
      cuisineId,
      dishes,
      statuses,
    );

    return true;
  }

  @Mutation(() => Boolean)
  @Roles('Admin')
  async distributeSetsOfWeek(
    @Args({name: 'setIdsAndDays', type: () => [SetIdAndDay]})
    setIdsAndDays: SetIdAndDay[],
  ) {
    await this.setManager.distributeSetsOfWeek(setIdsAndDays);

    return true;
  }

  @Mutation(() => Boolean)
  @Roles('Admin')
  async deleteSet(@Args({name: 'setId', type: () => ID}) setId: string) {
    await this.setManager.deleteSet(setId);
    return true;
  }
}
