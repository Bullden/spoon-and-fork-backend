import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';
import ICartManager from 'managers/cart/ICartManager';
import Cart from 'graphql/entities/cart/Cart';
import Session from 'entities/Session';
import CreateAddressRequest from 'graphql/entities/address/CreateAddressRequest';
import CurrentSession from 'enhancers/decorators/CurrentSession';
import {UseGuards} from '@nestjs/common';
import AuthGuard from 'enhancers/guards/AuthGuard';
import SelectedSetInfo from 'graphql/entities/selectedSetInfo/SelectedSetInfo';
import Roles from 'enhancers/decorators/Roles';
import {mapCartsToGQL} from 'graphql/entities/Mappers';

@Resolver(Cart)
@UseGuards(AuthGuard)
export default class CartResolver {
  constructor(private readonly cartManager: ICartManager) {}

  @Mutation(() => Cart)
  @Roles('Client')
  async createCartAndDistributeOrders(
    @CurrentSession() {userId}: Session,
    @Args('clientAddress') clientAddress: CreateAddressRequest,
    @Args({name: 'selectedSetsInfo', type: () => [SelectedSetInfo]})
    selectedSetsInfo: SelectedSetInfo[],
  ): Promise<Cart> {
    return this.cartManager.createCartAndDistributeOrders(
      userId,
      clientAddress,
      selectedSetsInfo,
    );
  }

  @Query(() => [Cart])
  @Roles('Client')
  async cartsByUserId(@CurrentSession() {userId}: Session) {
    return mapCartsToGQL(await this.cartManager.getCartsByUserId(userId));
  }
}
