import {Column, Entity} from 'typeorm';

@Entity()
export default class CreateAddressRequest {
  @Column({nullable: true})
  placeId: string | undefined;

  @Column()
  description: string;

  @Column({nullable: true})
  entrance?: string;

  @Column({nullable: true})
  floor?: string;

  @Column({nullable: true})
  apartment?: string;

  @Column({nullable: true})
  date?: Date;

  @Column('decimal')
  lat: number;

  @Column('decimal')
  lng: number;

  constructor(
    placeId: string | undefined,
    description: string,
    entrance: string,
    floor: string,
    apartment: string,
    date: Date,
    lat: number,
    lng: number,
  ) {
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
