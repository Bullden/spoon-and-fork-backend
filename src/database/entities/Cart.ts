import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import Order from './Order';
import {CartState} from 'entities/Cart';
import User from './User';

@Entity()
export default class Cart {
  constructor(id: string, userId: string, status: CartState, orders: Order[]) {
    this.id = id;
    this.userId = userId;
    this.status = status;
    this.orders = orders;
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, {nullable: false})
  @JoinColumn()
  user?: User;

  @Column({type: 'enum', enum: CartState})
  status: CartState;

  @OneToMany(() => Order, (order) => order.cart.id, {nullable: false})
  orders: Order[];
}
