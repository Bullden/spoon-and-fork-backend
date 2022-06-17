import Address from './Address';

export default interface OrderInfo {
  id: string;
  clientAddress: Address;
  distanceMiles?: number;
  priceCents: number;
}
