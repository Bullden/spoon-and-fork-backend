import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';
import {UseGuards} from '@nestjs/common';
import AuthGuard from 'enhancers/guards/AuthGuard';
import ILocationManager from 'managers/location/ILocationManager';
import CurrentSession from 'enhancers/decorators/CurrentSession';
import Session from 'entities/Session';
import CreateAddressRequest from 'graphql/entities/address/CreateAddressRequest';
import IAddressManager from '../../managers/address/IAddressManager';
import Address from '../entities/address/Address';
import Roles from '../../enhancers/decorators/Roles';
import LatLngInput from 'graphql/entities/address/LatLngInput';
import LatLng from 'graphql/entities/address/LatLng';

@Resolver()
@UseGuards(AuthGuard)
export class LocationResolver {
  constructor(
    private readonly locationManager: ILocationManager,
    private readonly addressManager: IAddressManager,
  ) {}

  @Mutation(() => Boolean)
  async createAddress(
    @CurrentSession() {userId}: Session,
    @Args('location') location: CreateAddressRequest,
  ) {
    await this.locationManager.createAddress(userId, location);
    return true;
  }

  @Query(() => [Address])
  @Roles('Client')
  async clientOrdersAddresses(@CurrentSession() {userId}: Session) {
    return this.addressManager.getClientOrdersAddresses(userId);
    // const test = await this.addressManager.getClientOrdersAddresses(userId);
    // console.log(test);
    // return test;
  }

  @Mutation(() => Boolean)
  async updateLocation(
    @CurrentSession() {userId}: Session,
    @Args('latLng') latLng: LatLngInput,
  ) {
    await this.locationManager.updateLocation(userId, latLng);
    return true;
  }

  @Query(() => LatLng, {nullable: true})
  async userLocation(@Args({name: 'id', type: () => String}) id: string) {
    return this.locationManager.getUserLocation(id);
  }
}
