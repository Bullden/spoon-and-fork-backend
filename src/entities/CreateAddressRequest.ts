export default interface CreateAddressRequest {
  placeId: string | undefined;
  description: string;
  entrance: string | undefined;
  floor: string | undefined;
  apartment: string | undefined;
  lat: number;
  lng: number;
}
