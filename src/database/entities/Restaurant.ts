import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import File from 'database/entities/File';
import Cuisine from 'database/entities/Cuisine';
import User from 'database/entities/User';
import Address from 'database/entities/Address';

@Entity()
export default class Restaurant {
  constructor(
    id: string,
    user: User,
    userId: string,
    image: File,
    imageId: string,
    address: Address,
    title: string,
    description: string,
    cuisines: Cuisine[],
  ) {
    this.id = id;
    this.user = user;
    this.userId = userId;
    this.image = image;
    this.imageId = imageId;
    this.address = address;
    this.title = title;
    this.description = description;
    this.cuisines = cuisines;
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, {nullable: false})
  @JoinColumn()
  user?: User;

  @Column()
  userId: string;

  @ManyToOne(() => File, {nullable: false})
  image?: File;

  @Column()
  imageId: string;

  @ManyToOne(() => Address)
  @JoinColumn()
  address: Address;

  @Column()
  title: string;

  @Column()
  description: string;

  @ManyToMany(() => Cuisine, {nullable: false})
  @JoinTable()
  cuisines?: Cuisine[];
}
