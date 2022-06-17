import {Field, ObjectType, registerEnumType} from '@nestjs/graphql';
import Bag from 'graphql/entities/bag/Bag';
import Set from 'graphql/entities/set/Set';
import User from 'graphql/entities/user/User';
import Restaurant from 'graphql/entities/restaurant/Restaurant';
import OrderInfo from 'graphql/entities/order/OrderInfo';
import {OrderPlacement, OrderState} from 'entities/Order';
import Courier from '../user/Courier';
import Cart from 'graphql/entities/cart/Cart';

registerEnumType(OrderState, {name: 'OrderState'});

registerEnumType(OrderPlacement, {name: 'OrderPlacement'});

@ObjectType()
export default class Order {
  constructor(
    id: string,
    client: User,
    restaurant: Restaurant,
    cart: Cart,
    bag: Bag,
    set: Set,
    number: number,
    orderInfo: OrderInfo,
    created: Date,
    placement: OrderPlacement,
    state: OrderState,
    courierId: string | undefined,
    courier: Courier | undefined,
    date: Date,
  ) {
    this.id = id;
    this.client = client;
    this.restaurant = restaurant;
    this.cart = cart;
    this.bag = bag;
    this.set = set;
    this.number = number;
    this.orderInfo = orderInfo;
    this.created = created;
    this.placement = placement;
    this.state = state;
    this.courierId = courierId;
    this.courier = courier;
    this.date = date;
  }

  @Field()
  id: string;

  @Field()
  client: User;

  @Field(() => Restaurant, {nullable: true})
  restaurant?: Restaurant;

  @Field(() => Cart, {nullable: false})
  cart: Cart;

  @Field(() => Bag, {nullable: true})
  bag?: Bag;

  @Field(() => Set)
  set: Set;

  @Field()
  number: number;

  @Field()
  orderInfo: OrderInfo;

  @Field()
  created: Date;

  @Field(() => OrderPlacement)
  placement: OrderPlacement;

  @Field(() => OrderState)
  state: OrderState;

  @Field(() => String, {nullable: true})
  courierId: string | undefined;

  @Field(() => Courier, {nullable: true})
  courier: Courier | undefined;

  @Field(() => String, {nullable: true})
  rating: number | undefined;

  @Field(() => Date)
  date: Date;
}
