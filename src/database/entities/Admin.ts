import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import User from './User';

@Entity()
@Unique((c: Admin) => [c.user])
export default class Admin {
  constructor(id: string, user: User, userId: string, isEnabled: boolean) {
    this.id = id;
    this.user = user;
    this.userId = userId;
    this.isEnabled = isEnabled;
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, {nullable: false})
  @JoinColumn()
  user?: User;

  @Column()
  userId: string;

  @Column({default: false})
  isEnabled: boolean;
}
