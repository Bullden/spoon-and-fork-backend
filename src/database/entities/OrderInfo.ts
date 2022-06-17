import {Column, ManyToOne, Entity, PrimaryGeneratedColumn, JoinColumn} from 'typeorm';
import Address from './Address';

@Entity()
export default class OrderInfo {
  constructor(
    id: string,
    priceCents: number,
    distanceMiles: number,
    clientAddress: Address,
  ) {
    this.id = id;
    this.priceCents = priceCents;
    this.distanceMiles = distanceMiles;
    this.clientAddress = clientAddress;
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({nullable: true})
  priceCents: number;

  @Column('float', {nullable: true})
  distanceMiles?: number;

  @ManyToOne(() => Address)
  @JoinColumn()
  clientAddress: Address;
}
