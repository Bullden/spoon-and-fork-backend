import IGeoService from './IGeoService';
import SpoonError from 'SpoonError';
import LatLng from '../../entities/LatLng';
import {Coordinate} from 'tsgeo/Coordinate';
import {Vincenty} from 'tsgeo/Distance/Vincenty';

export default class GeoService extends IGeoService {
  // eslint-disable-next-line class-methods-use-this
  async getDistanceMeters(origin: LatLng, destination: LatLng) {
    const originPlace = new Coordinate(origin.lat, origin.lng);
    const destinationPlace = new Coordinate(destination.lat, destination.lng);
    const result = originPlace.getDistance(destinationPlace, new Vincenty());
    if (result === 0) {
      throw new SpoonError(`It is exactly the same place`);
    }
    return result;
  }
}
