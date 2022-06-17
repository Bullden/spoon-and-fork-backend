import {Field, InputType} from '@nestjs/graphql';

@InputType()
export default class CreateAddressRequest {
  constructor(
    placeId: string,
    lat: number,
    lng: number,
    description: string,
    entrance: string,
    floor: string,
    apartment: string,
  ) {
    this.placeId = placeId;
    this.lat = lat;
    this.lng = lng;
    this.description = description;
    this.entrance = entrance;
    this.floor = floor;
    this.apartment = apartment;
  }

  @Field({nullable: true})
  placeId: string;

  @Field()
  lat: number;

  @Field()
  lng: number;

  @Field()
  description: string;

  @Field({nullable: true})
  entrance: string;

  @Field({nullable: true})
  floor: string;

  @Field({nullable: true})
  apartment: string;
}
