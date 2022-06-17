import {Field, ID, ObjectType} from '@nestjs/graphql';
// import LatLng from 'graphql/entities/address/LatLng';
import AdditionalUserInfo from './AdditionalUserInfo';

@ObjectType()
export default class User {
  constructor(
    id: string,
    image: string,
    name: string,
    preferencesId: string,
    lat: number,
    lng: number,
    additionalUserInfo?: AdditionalUserInfo,
  ) {
    this.id = id;
    this.image = image;
    this.name = name;
    this.preferencesId = preferencesId;
    this.lat = lat;
    this.lng = lng;
    this.additionalUserInfo = additionalUserInfo;
  }

  @Field(() => ID)
  id: string;

  @Field(() => String, {nullable: true})
  image: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  preferencesId: string;

  @Field(() => Number)
  lat: number;

  @Field(() => Number)
  lng: number;

  @Field(() => AdditionalUserInfo, {nullable: true})
  additionalUserInfo: AdditionalUserInfo | undefined;
}
