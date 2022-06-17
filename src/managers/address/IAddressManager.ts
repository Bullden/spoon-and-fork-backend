// import LatLng from 'entities/LatLng';
import {ID} from 'entities/Common';
import AppType from 'entities/AppType';
import Address from 'entities/Address';

export default abstract class IAddressManager {
  abstract getDistanceToRestaurant(
    restaurantId: ID,
    lat: number,
    lng: number,
    appType: AppType,
  ): Promise<number>;

  abstract getClientOrdersAddresses(userId: ID): Promise<Address[]>;
}
