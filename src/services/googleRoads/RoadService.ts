import IRoadService from 'services/googleRoads/IRoadsService';
import {GoogleMapsClientWithPromise} from '@google/maps';
import SpoonError from 'SpoonError';
import LatLng from '../../entities/LatLng';

export default class RoadsService extends IRoadService {
  constructor(private readonly client: GoogleMapsClientWithPromise) {
    super();
  }

  async getDistanceMeters(origin: LatLng, destination: LatLng) {
    const result = await this.client
      .directions({
        origin,
        destination,
        mode: 'driving',
      })
      .asPromise();

    if (result.status !== 200) {
      throw new SpoonError(`Bad directions http response status: ${result.status}`);
    }

    if (result.json.status !== 'OK') {
      throw new SpoonError(`Bad directions json response status: ${result.json.status}`);
    }

    const {json} = result;

    if (json.routes.length < 1) {
      throw new SpoonError('There are no routes in the response');
    }

    const route = json.routes[0];

    if (route.legs.length < 1) {
      throw new SpoonError('There are no route legs in the response');
    }

    const leg = route.legs[0];

    return leg.distance.value;
  }
}
