import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export default class Ingredient {
  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;
}
