import {Field, ID, ObjectType} from '@nestjs/graphql';
// import LatLng from './LatLng';

@ObjectType()
export default class Address {
  constructor(
    id: string,
    placeId: string,
    lat: number,
    lng: number,
    description: string,
    entrance: string,
    floor: string,
    apartment: string,
    date: Date,
  ) {
    this.id = id;
    this.placeId = placeId;
    this.lat = lat;
    this.lng = lng;
    this.description = description;
    this.entrance = entrance;
    this.floor = floor;
    this.apartment = apartment;
    this.date = date;
  }

  @Field(() => ID)
  id: string;

  @Field({nullable: true})
  placeId?: string;

  @Field()
  lat: number;

  @Field()
  lng: number;

  @Field()
  description: string;

  @Field({nullable: true})
  entrance?: string;

  @Field({nullable: true})
  floor?: string;

  @Field({nullable: true})
  apartment?: string;

  @Field({nullable: true})
  date?: Date;
}
