import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export default class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({nullable: true})
  placeId: string;

  @Column()
  description: string;

  @Column({nullable: true})
  entrance?: string;

  @Column({nullable: true})
  floor?: string;

  @Column({nullable: true})
  apartment?: string;

  @Column('decimal')
  lat: number;

  @Column('decimal')
  lng: number;

  @Column({nullable: true})
  date: Date;

  constructor(
    id: string,
    placeId: string,
    description: string,
    entrance: string,
    floor: string,
    apartment: string,
    date: Date,
    lat: number,
    lng: number,
  ) {
    this.id = id;
    this.placeId = placeId;
    this.description = description;
    this.entrance = entrance;
    this.floor = floor;
    this.apartment = apartment;
    this.date = date;
    this.lat = lat;
    this.lng = lng;
  }
}
