// import LatLng from 'entities/LatLng';

export default abstract class IGeoService {
  abstract getDistanceMeters(
    origin: {lat: number; lng: number},
    destination: {lat: number; lng: number},
  ): Promise<number>;
}
