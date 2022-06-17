import CreateAddressRequest from 'entities/CreateAddressRequest';
import LatLng from 'entities/LatLng';
import Address from '../../entities/Address';

export default abstract class ILocationManager {
  abstract createAddress(userId: string, location: CreateAddressRequest): Promise<void>;

  abstract createAddressForRestaurant(
    userId: string,
    location: CreateAddressRequest,
  ): Promise<Address>;

  abstract updateLocation(userId: string, latLng: LatLng): Promise<void>;

  abstract getUserLocation(id: string): Promise<LatLng | undefined>;
}
