import {Args, Mutation, Query, Resolver, ID} from '@nestjs/graphql';
import IOrderManager from 'managers/order/IOrderManager';
import Order from 'graphql/entities/order/Order';
import {mapOrdersToGQL, mapOrderToGQL} from 'graphql/entities/Mappers';
import Session from 'entities/Session';
import CreateAddressRequest from 'graphql/entities/address/CreateAddressRequest';
import {OrderState} from 'entities/Order';
import Roles from 'enhancers/decorators/Roles';
// import {MarkOrderAction} from '../entities/order/MarkOrderAction';
// import LatLngInput from 'graphql/entities/address/LatLngInput';
import CurrentSession from 'enhancers/decorators/CurrentSession';
import HttpRequest, {HttpRequestInfo} from 'enhancers/decorators/HttpRequest';
import {UseGuards} from '@nestjs/common';
import AuthGuard from 'enhancers/guards/AuthGuard';

@Resolver(Order)
@UseGuards(AuthGuard)
export default class OrderResolver {
  constructor(private readonly orderManager: IOrderManager) {}

  @Mutation(() => Order)
  async createOrder(
    @CurrentSession() {userId}: Session,
    @Args('clientAddress') clientAddress: CreateAddressRequest,
    @Args('setId') setId: string,
    @Args('cartId') cartId: string,
    @Args('restaurantId') restaurantId: string,
    @Args('numberOfDays') numberOfDays: number,
  ) {
    return mapOrderToGQL(
      await this.orderManager.createOrder(
        cartId,
        userId,
        setId,
        clientAddress,
        restaurantId,
        numberOfDays,
      ),
    );
  }

  @Query(() => [Order], {name: 'orders'})
  async getOrders() {
    return mapOrdersToGQL(await this.orderManager.getOrders());
  }

  @Query(() => Order)
  async orderById(@Args({name: 'id', type: () => ID}) orderId: string) {
    return mapOrderToGQL(await this.orderManager.getOrderById(orderId));
  }

  @Query(() => OrderState)
  async orderState(@Args({name: 'id', type: () => ID}) orderId: string) {
    return (await this.orderManager.getOrderById(orderId)).state;
  }

  @Query(() => [Order], {name: 'ordersForDelivery'})
  @Roles('Courier')
  async ordersForDelivery(@HttpRequest() {appType}: HttpRequestInfo) {
    return mapOrdersToGQL(await this.orderManager.getOrdersForDelivery(appType));
  }

  @Query(() => [Order], {name: 'orderHistory'})
  async getOrderHistory(
    @CurrentSession() {userId}: Session,
    @HttpRequest() {appType}: HttpRequestInfo,
  ) {
    return mapOrdersToGQL(await this.orderManager.getOrderHistory(userId, appType));
  }

  @Mutation(() => Boolean)
  @Roles('Client')
  async evaluateOrder(
    @CurrentSession() {userId}: Session,
    @HttpRequest() {appType}: HttpRequestInfo,
    @Args({name: 'id', type: () => String}) orderId: string,
    @Args({name: 'rating', type: () => Number}) rating: number,
  ) {
    await this.orderManager.evaluateOrder(appType, userId, orderId, rating);
    return true;
  }

  @Mutation(() => Boolean)
  @Roles('Courier')
  async acceptOrder(
    @CurrentSession() {userId}: Session,
    @Args({name: 'id', type: () => String}) id: string,
  ) {
    await this.orderManager.acceptOrder(userId, id);
    return true;
  }

  @Mutation(() => Boolean)
  async markOrder(
    @HttpRequest() {appType}: HttpRequestInfo,
    @Args('orderId') orderId: string,
    @Args('bagId') bagId: string,
    // @Args({name: 'latLng', type: () => LatLngInput, nullable: true})
    // latLng: LatLngInput | undefined,
  ) {
    await this.orderManager.markOrder(appType, orderId, bagId);
    return true;
  }

  @Mutation(() => Boolean)
  async deleteOrder(
    @CurrentSession() {userId}: Session,
    @Args({name: 'orderId', type: () => ID}) orderId: string,
    @HttpRequest() {appType}: HttpRequestInfo,
  ) {
    await this.orderManager.deleteOrder(userId, orderId, appType);
    return true;
  }

  @Query(() => Order, {nullable: true})
  async currentOrder(
    @CurrentSession() {userId}: Session,
    @HttpRequest() {appType}: HttpRequestInfo,
  ) {
    const order = await this.orderManager.getCurrentOrder(userId, appType);
    return !order ? order : mapOrderToGQL(order);
  }

  @Mutation(() => Boolean)
  @Roles('Admin')
  async removeTheCurrentCourier(
    @Args({name: 'orderId', type: () => ID})
    orderId: string,
  ) {
    await this.orderManager.removeTheCurrentCourier(orderId);
    return true;
  }

  @Query(() => [Order])
  @Roles('Client')
  async ordersByUserId(@CurrentSession() {userId}: Session) {
    return mapOrdersToGQL(await this.orderManager.getOrdersByUserId(userId));
  }

  @Query(() => [Order])
  async ordersByCartId(@Args({name: 'id', type: () => String}) id: string) {
    return mapOrdersToGQL(await this.orderManager.getOrdersByCartId(id));
  }

  @Query(() => [Order])
  @Roles('Courier')
  async ordersByCourierId(@CurrentSession() {userId}: Session) {
    return mapOrdersToGQL(await this.orderManager.getOrdersByCourierId(userId));
  }

  @Query(() => [Order])
  @Roles('Restaurant')
  async ordersByRestaurantId(@CurrentSession() {userId}: Session) {
    return mapOrdersToGQL(await this.orderManager.getOrdersByRestaurantId(userId));
  }
}
