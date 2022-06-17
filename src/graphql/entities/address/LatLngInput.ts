import {Field, InputType} from '@nestjs/graphql';

@InputType()
export default class LatLngInput {
  constructor(lat: number, lng: number) {
    this.lat = lat;
    this.lng = lng;
  }

  @Field()
  lat: number;

  @Field()
  lng: number;
}
