import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import User from 'database/entities/User';

@Entity()
@Unique((c: Client) => [c.user])
export default class Client {
  constructor(id: string, user: User, userId: string) {
    this.id = id;
    this.user = user;
    this.userId = userId;
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, {nullable: false})
  @JoinColumn()
  user?: User;

  @Column()
  userId: string;
}
