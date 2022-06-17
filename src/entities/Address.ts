// import LatLng from 'entities/LatLng';

export default interface Address {
  placeId: string | undefined;
  id: string;
  description: string;
  entrance?: string;
  floor?: string;
  apartment?: string;
  lat: number;
  lng: number;
  date: Date;
}
