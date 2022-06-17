import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import File from 'database/entities/File';
import Cuisine from 'database/entities/Cuisine';
import Dish from 'database/entities/Dish';
import Status from 'database/entities/Status';

@Entity()
export default class Set {
  constructor(
    id: string,
    name: string,
    image: File,
    imageId: string,
    cuisine: Cuisine,
    cuisineId: string,
    priceCents: number,
    dishes: Dish[],
    status: Status[],
    day: string,
    isFavorite: boolean,
  ) {
    this.id = id;
    this.name = name;
    this.image = image;
    this.imageId = imageId;
    this.cuisine = cuisine;
    this.cuisineId = cuisineId;
    this.priceCents = priceCents;
    this.dishes = dishes;
    this.statuses = status;
    this.day = day;
    this.isFavorite = isFavorite;
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => File, {nullable: false})
  image?: File;

  @Column()
  imageId: string;

  @ManyToOne(() => Cuisine, {nullable: false})
  cuisine?: Cuisine;

  @Column()
  cuisineId: string;

  @Column()
  priceCents: number;

  @ManyToMany(() => Dish, {nullable: false})
  @JoinTable()
  dishes?: Dish[];

  @ManyToMany(() => Status, {nullable: false})
  @JoinTable()
  statuses?: Status[];

  @Column({nullable: true})
  day: string;

  @Column({nullable: true})
  isFavorite: boolean;
}
