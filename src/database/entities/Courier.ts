import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import User from './User';
import DocumentsRevision from 'database/entities/DocumentsRevision';

@Entity()
@Unique((c: Courier) => [c.user])
export default class Courier {
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

  @ManyToOne(() => DocumentsRevision, {nullable: true})
  revision?: DocumentsRevision;

  @Column({nullable: true})
  revisionId: string | undefined;
}
