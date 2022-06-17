import {Args, ID, Mutation, Query, Resolver} from '@nestjs/graphql';
import IStatusManager from 'managers/status/IStatusManager';
import Status from 'graphql/entities/status/Status';
import {mapStatusesToGQL, mapStatusToGQL} from 'graphql/entities/Mappers';
import Roles from 'enhancers/decorators/Roles';

@Resolver()
export default class IngredientResolver {
  constructor(private readonly statusManager: IStatusManager) {}

  @Query(() => Status)
  async statusById(@Args({name: 'id', type: () => String}) id: string) {
    return mapStatusToGQL(await this.statusManager.findStatusByIdOrThrow(id));
  }

  @Query(() => [Status], {name: 'statuses'})
  @Roles('Admin')
  async getStatuses() {
    return mapStatusesToGQL(await this.statusManager.getStatuses());
  }

  @Query(() => Status)
  async ingredientById(@Args({name: 'id', type: () => String}) id: string) {
    return mapStatusToGQL(await this.statusManager.findStatusByIdOrThrow(id));
  }

  @Query(() => [Status])
  async ingredientsByDishId(@Args({name: 'id', type: () => String}) id: string) {
    return mapStatusesToGQL(await this.statusManager.getStatusesBySetId(id));
  }

  @Mutation(() => Status)
  @Roles('Admin')
  async updateStatus(
    @Args('id') id: string,
    @Args('imageId') imageId: string,
    @Args('name') name: string,
  ) {
    return mapStatusToGQL(await this.statusManager.updateStatus(id, imageId, name));
  }

  @Mutation(() => Boolean)
  @Roles('Admin')
  async createStatus(@Args('imageId') imageId: string, @Args('name') name: string) {
    await this.statusManager.createStatus(imageId, name);

    return true;
  }

  @Mutation(() => Boolean)
  @Roles('Admin')
  async deleteStatus(@Args({name: 'statusId', type: () => ID}) statusId: string) {
    await this.statusManager.deleteStatus(statusId);
    return true;
  }
}
