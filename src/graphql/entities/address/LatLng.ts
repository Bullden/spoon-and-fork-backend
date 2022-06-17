import {Field, ObjectType} from '@nestjs/graphql';

@ObjectType()
export default class LatLng {
  constructor(lat: number, lng: number) {
    this.lat = lat;
    this.lng = lng;
  }

  @Field()
  lat: number;

  @Field()
  lng: number;
}
