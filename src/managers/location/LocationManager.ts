import {Injectable} from '@nestjs/common';
import ILocationManager from 'managers/location/ILocationManager';
import CreateAddressRequest from 'entities/CreateAddressRequest';
import IAddressStore from 'database/stores/address/IAddressStore';
import IUserStore from '../../database/stores/user/IUserStore';
import SpoonError from '../../SpoonError';
import LatLng from 'entities/LatLng';

@Injectable()
export default class LocationManager implements ILocationManager {
  constructor(
    //
    private addressStore: IAddressStore,
    private userStore: IUserStore,
  ) {}

  async createAddress(userId: string, address: CreateAddressRequest) {
    const date = new Date();
    await this.addressStore.createAddress({...address, date});
  }

  async createAddressForRestaurant(userId: string, address: CreateAddressRequest) {
    const date = new Date();
    return this.addressStore.createAddress({...address, date});
  }

  async updateLocation(userId: string, latLng: LatLng) {
    await this.userStore.updateLocation(userId, latLng);
  }

  async getUserLocation(id: string): Promise<LatLng | undefined> {
    const courier = await this.userStore.getCourierById(id);

    if (!courier) throw new SpoonError('Such courier does not exist');

    const {user} = courier;

    if (!user) throw new SpoonError('Such user does not exist');

    return user.lat && user.lng ? {lat: user.lat, lng: user.lng} : undefined;
  }
}
