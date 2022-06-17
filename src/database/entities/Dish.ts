import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import File from 'database/entities/File';
import Ingredient from './Ingredient';

@Entity()
export default class Dish {
  constructor(
    id: string,
    name: string,
    description: string,
    image: File,
    imageId: string,
    weight: string,
    kal: string,
    ingredients: Ingredient[],
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.image = image;
    this.imageId = imageId;
    this.weight = weight;
    this.kal = kal;
    this.ingredients = ingredients;
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToOne(() => File, {nullable: false})
  image?: File;

  @Column()
  imageId: string;

  @Column()
  weight: string;

  @Column()
  kal: string;

  @ManyToMany(() => Ingredient, {nullable: false})
  @JoinTable()
  ingredients?: Ingredient[];
}
