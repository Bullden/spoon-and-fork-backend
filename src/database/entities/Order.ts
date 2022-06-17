import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Restaurant from './Restaurant';
import Bag from 'database/entities/Bag';
import Cart from 'database/entities/Cart';
import Set from 'database/entities/Set';
import Client from 'database/entities/Client';
import Courier from 'database/entities/Courier';
import {OrderPlacement, OrderState} from 'entities/Order';
import OrderMark from 'database/entities/OrderMark';
// import RequestedIncomePayment from 'database/entities/RequestedIncomePayment';
// import IncomePayment from 'database/entities/IncomePayment';
import OrderInfo from './OrderInfo';

@Entity()
export default class Order {
  constructor(
    id: string,
    number: number,
    bag: Bag,
    cart: Cart,
    cartId: string,
    set: Set,
    orderInfo: OrderInfo,
    state: OrderState,
    // requestedPayment: RequestedIncomePayment,
    // payment: IncomePayment,
    created: Date,
    client: Client,
    clientId: string,
    courier: Courier,
    courierId: string,
    restaurant: Restaurant,
    restaurantId: string,
    placement: OrderPlacement,
    rating: number,
    clientCheckout: OrderMark,
    courierCheckin: OrderMark,
    courierCheckout: OrderMark,
    restaurantCheckout: OrderMark,
    date: Date,
  ) {
    this.id = id;
    this.number = number;
    this.bag = bag;
    this.cart = cart;
    this.cartId = cartId;
    this.set = set;
    this.orderInfo = orderInfo;
    this.state = state;
    // this.requestedPayment = requestedPayment;
    // this.payment = payment;
    this.created = created;
    this.client = client;
    this.clientId = clientId;
    this.courier = courier;
    this.courierId = courierId;
    this.restaurant = restaurant;
    this.restaurantId = restaurantId;
    this.placement = placement;
    this.rating = rating;
    this.clientCheckout = clientCheckout;
    this.courierCheckin = courierCheckin;
    this.courierCheckout = courierCheckout;
    this.restaurantCheckout = restaurantCheckout;
    this.date = date;
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Generated('increment')
  number: number;

  @ManyToOne(() => Bag, {nullable: true})
  @JoinColumn()
  bag?: Bag;

  @ManyToOne(() => Cart, (cart) => cart.id, {nullable: false})
  @JoinColumn()
  cart: Cart;

  @Column()
  cartId: string;

  @ManyToOne(() => Set, {nullable: false})
  @JoinColumn()
  set: Set;

  @ManyToOne(() => OrderInfo, {nullable: false})
  @JoinColumn()
  orderInfo: OrderInfo;

  @Column('enum', {enum: OrderState})
  state: OrderState;

  // @ManyToOne(() => RequestedIncomePayment, {nullable: true})
  // @JoinColumn()
  // requestedPayment?: RequestedIncomePayment;
  //
  // @ManyToOne(() => IncomePayment, {nullable: true})
  // @JoinColumn()
  // payment?: IncomePayment;

  @CreateDateColumn()
  created: Date;

  @ManyToOne(() => Client, {nullable: false})
  client?: Client;

  @Column()
  clientId: string;

  @ManyToOne(() => Courier, {nullable: false})
  @JoinColumn()
  courier?: Courier;

  @Column({nullable: true})
  courierId: string;

  @ManyToOne(() => Restaurant, {nullable: true})
  restaurant?: Restaurant;

  @Column()
  restaurantId: string;

  @Column({type: 'enum', enum: OrderPlacement})
  placement: OrderPlacement;

  @Column({nullable: true})
  rating: number;

  @ManyToOne(() => OrderMark, {nullable: true})
  @JoinColumn()
  clientCheckout?: OrderMark;
  // endregion

  // region revision progress
  @ManyToOne(() => OrderMark, {nullable: true})
  @JoinColumn()
  courierCheckin?: OrderMark;

  @ManyToOne(() => OrderMark, {nullable: true})
  @JoinColumn()
  courierCheckout?: OrderMark;
  // endregion

  @ManyToOne(() => OrderMark, {nullable: true})
  @JoinColumn()
  restaurantCheckout?: OrderMark;

  @Column()
  date: Date;
}
