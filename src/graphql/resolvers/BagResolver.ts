import {Args, Query, Resolver} from '@nestjs/graphql';
import {UseGuards} from '@nestjs/common';
import AuthGuard from 'enhancers/guards/AuthGuard';
import IBagManager from 'managers/bag/IBagManager';
import Bag from 'graphql/entities/bag/Bag';
import {mapBagToGQL} from 'graphql/entities/Mappers';

@Resolver()
@UseGuards(AuthGuard)
export default class BagResolver {
  constructor(private readonly bagManager: IBagManager) {}

  @Query(() => Bag)
  async bagByCode(@Args({name: 'code', type: () => String}) code: string) {
    return mapBagToGQL(await this.bagManager.findBagByCodeOrThrow(code));
  }

  @Query(() => Bag)
  async bagByOrderId(@Args({name: 'id', type: () => String}) id: string) {
    return mapBagToGQL(await this.bagManager.getBagByOrderId(id));
  }
}
