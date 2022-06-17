import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export default class EmailsForSpam {
  constructor(id: string, email: string, isDiscount: boolean) {
    this.id = id;
    this.email = email;
    this.isDiscount = isDiscount;
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  isDiscount: boolean;
}
