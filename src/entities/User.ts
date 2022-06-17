import {ID} from './Common';
import {IsString} from 'class-validator';
// import LatLng from 'entities/LatLng';
import AdditionalUserInfo from 'entities/AdditionalUserInfo';

export default class User {
  constructor(
    id: string,
    image: string,
    name: string,
    preferencesId: string,
    lat: number,
    lng: number,
    additionalUserInfo: AdditionalUserInfo | undefined,
  ) {
    this.id = id;
    this.image = image;
    this.name = name;
    this.preferencesId = preferencesId;
    this.lat = lat;
    this.lng = lng;
    this.additionalUserInfo = additionalUserInfo;
  }

  id: ID;

  @IsString()
  image: string;

  name: string;

  lat: number;

  lng: number;

  additionalUserInfo: AdditionalUserInfo | undefined;

  @IsString()
  preferencesId: string;
}
