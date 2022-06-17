import {Column, Entity, PrimaryGeneratedColumn, Unique} from 'typeorm';

@Entity()
@Unique((b: Bag) => [b.code])
export default class Bag {
  constructor(id: string, code: string) {
    this.id = id;
    this.code = code;
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  code: string;
}
