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
@Unique((l: LocalLogin) => [l.email])
export default class LocalLogin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  constructor(id: string, user: User, email: string, passwordHash: string) {
    this.id = id;
    this.user = user;
    this.email = email;
    this.passwordHash = passwordHash;
  }

  @OneToOne(() => User, {nullable: false})
  @JoinColumn()
  user: User;

  @Column()
  email: string;

  @Column()
  passwordHash: string;
}
