import Address from 'database/entities/Address';
import OrderInfo from 'database/entities/OrderInfo';

export default abstract class IAddressStore {
  abstract createAddress(address: {
    placeId: string | undefined;
    description: string;
    entrance?: string;
    floor?: string;
    apartment?: string;
    lat: number;
    lng: number;
    date: Date;
  }): Promise<Address>;

  abstract updateAddress(address: {
    id: string;
    placeId: string | undefined;
    description: string;
    entrance?: string;
    floor?: string;
    apartment?: string;
    lat: number;
    lng: number;
    date: Date;
  }): Promise<Address>;

  abstract getUserAddressesFromOrder(clientAddressId: string): Promise<OrderInfo[]>;
}
