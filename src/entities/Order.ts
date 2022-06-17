import Bag from './Bag';
import Set from './Set';
import User from './User';
import {ID} from './Common';
import OrderInfo from './OrderInfo';
import Courier from './Courier';
import Restaurant from './Restaurant';
import Cart from 'entities/Cart';

export default interface Order {
  id: ID;
  client: User;
  restaurant?: Restaurant;
  cart: Cart;
  bag?: Bag;
  set: Set;
  state: OrderState;
  number: number;
  created: Date;
  orderInfo: OrderInfo;
  placement: OrderPlacement;
  rating: number | undefined;
  courierId?: string;
  courier: Courier | undefined;
  date: Date;
}

export enum OrderState {
  WaitingForPayment = 'WaitingForPayment',
  ReadyForDelivery = 'ReadyForDelivery',
  AcceptedByCourier = 'AcceptedByCourier',
  AcceptedByRestaurant = 'AcceptedByRestaurant',
  Delivering = 'Delivering',
  Delivered = 'Delivered',
  Completed = 'Completed',
}

export enum OrderPlacement {
  Client = 'Client',
  Restaurant = 'Restaurant',
}
