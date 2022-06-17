// import LatLng from 'entities/LatLng';

export default abstract class IRoadsService {
  abstract getDistanceMeters(
    origin: {lat: number; lng: number},
    destination: {lat: number; lng: number},
  ): Promise<number>;
}
