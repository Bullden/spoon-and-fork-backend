import {Args, Mutation, Query, Resolver, ID} from '@nestjs/graphql';
import {UseGuards} from '@nestjs/common';
import AuthGuard from 'enhancers/guards/AuthGuard';
import Client from 'graphql/entities/user/Client';
import Courier from 'graphql/entities/user/Courier';
import Roles from 'enhancers/decorators/Roles';
import IUserManager from 'managers/user/IUserManager';
import {
  mapClientsToGQL,
  mapClientToGQL,
  mapCouriersToGQL,
  mapCourierToGQL,
} from 'graphql/entities/Mappers';
import SpoonError from 'SpoonError';

@Resolver()
@UseGuards(AuthGuard)
export default class UserResolver {
  constructor(private readonly userManager: IUserManager) {}

  @Mutation(() => Boolean)
  @Roles('Admin')
  async updateClientInformation(
    @Args({name: 'id', type: () => ID}) id: string,
    @Args('name') name: string,
    @Args('email') email: string,
    @Args('phoneNumber') phoneNumber: string,
  ) {
    await this.userManager.updateClientInformation(id, name, email, phoneNumber);

    return true;
  }

  @Mutation(() => Boolean)
  @Roles('Admin')
  async updateCourierInformation(
    @Args({name: 'id', type: () => ID}) id: string,
    @Args('name') name: string,
    @Args('email') email: string,
    @Args('phoneNumber') phoneNumber: string,
  ) {
    await this.userManager.updateCourierInformation(id, name, email, phoneNumber);

    return true;
  }

  @Query(() => [Courier], {name: 'couriers'})
  @Roles('Admin')
  async getCouriers() {
    return mapCouriersToGQL(await this.userManager.getCouriers());
  }

  @Query(() => Courier, {name: 'courierById'})
  @Roles('Admin')
  async getCourierById(@Args({name: 'courierId', type: () => ID}) courierId: string) {
    const courier = await this.userManager.getCourierById(courierId);
    if (!courier) throw new SpoonError('Courier not found');
    return mapCourierToGQL(courier);
  }

  @Query(() => [Client], {name: 'clients'})
  @Roles('Admin')
  async getClients() {
    return mapClientsToGQL(await this.userManager.getClients());
  }

  @Query(() => Client, {name: 'clientById'})
  @Roles('Admin')
  async getClientById(@Args({name: 'clientId', type: () => ID}) clientId: string) {
    const client = await this.userManager.getClientById(clientId);
    if (!client) throw new SpoonError('Client not found');
    return mapClientToGQL(client);
  }
}
