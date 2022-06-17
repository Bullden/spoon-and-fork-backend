import {Args, ID, Mutation, Query, Resolver} from '@nestjs/graphql';
import IRestaurantManager from 'managers/restaurant/IRestaurantManager';
import {mapRestaurantsToGQL, mapRestaurantToGQL} from 'graphql/entities/Mappers';
import Restaurant from 'graphql/entities/restaurant/Restaurant';
import AuthGuard from '../../enhancers/guards/AuthGuard';
import {UseGuards} from '@nestjs/common';
import Roles from '../../enhancers/decorators/Roles';
import CurrentSession from 'enhancers/decorators/CurrentSession';
import Session from 'entities/Session';

@Resolver()
@UseGuards(AuthGuard)
export default class RestaurantResolver {
  constructor(private readonly restaurantManager: IRestaurantManager) {}

  @Mutation(() => Boolean)
  @Roles('Admin')
  async createRestaurant(
    @Args('name') name: string,
    @Args('email') email: string,
    @Args('phoneNumber') phoneNumber: string,
    @Args('password') password: string,
    @Args('lat') lat: number,
    @Args('lng') lng: number,
    @Args('addressDescription') addressDescription: string,
    @Args('imageId') imageId: string,
    @Args('title') title: string,
    @Args('restaurantDescription') restaurantDescription: string,
    @Args({name: 'cuisines', type: () => [String]}) cuisines: string[],
    @Args('placeId', {nullable: true}) placeId?: string,
  ) {
    await this.restaurantManager.createRestaurant(
      name,
      email,
      phoneNumber,
      password,
      placeId,
      lat,
      lng,
      addressDescription,
      imageId,
      title,
      restaurantDescription,
      cuisines,
    );

    return true;
  }

  @Mutation(() => Restaurant)
  @Roles('Admin')
  async updateRestaurant(
    @Args('id') id: string,
    @Args('name') name: string,
    @Args('email') email: string,
    @Args('phoneNumber') phoneNumber: string,
    @Args('lat') lat: number,
    @Args('lng') lng: number,
    @Args('addressDescription') addressDescription: string,
    @Args('imageId') imageId: string,
    @Args('title') title: string,
    @Args('restaurantDescription') restaurantDescription: string,
    @Args({name: 'cuisines', type: () => [String]}) cuisines: string[],
    @Args('placeId', {nullable: true}) placeId?: string,
  ) {
    return mapRestaurantToGQL(
      await this.restaurantManager.updateRestaurant(
        id,
        name,
        email,
        phoneNumber,
        placeId,
        lat,
        lng,
        addressDescription,
        imageId,
        title,
        restaurantDescription,
        cuisines,
      ),
    );
  }

  @Mutation(() => Boolean)
  @Roles('Admin')
  async deleteRestaurant(
    @Args({name: 'restaurantId', type: () => ID}) restaurantId: string,
  ) {
    await this.restaurantManager.deleteRestaurant(restaurantId);
    return true;
  }

  @Query(() => [Restaurant], {name: 'restaurants'})
  @Roles('Admin', 'Courier')
  async getRestaurants() {
    return mapRestaurantsToGQL(await this.restaurantManager.getRestaurants());
  }

  @Query(() => Restaurant, {name: 'restaurantById'})
  @Roles('Admin', 'Courier', 'Client')
  async getRestaurantById(
    @Args({name: 'restaurantId', type: () => ID}) restaurantId: string,
  ) {
    return mapRestaurantToGQL(
      await this.restaurantManager.getRestaurantById(restaurantId),
    );
  }

  @Query(() => Restaurant, {nullable: true})
  async currentRestaurant(@CurrentSession() {userId}: Session) {
    const restaurant = await this.restaurantManager.getCurrentRestaurant(userId);
    return !restaurant ? restaurant : mapRestaurantToGQL(restaurant);
  }
}
