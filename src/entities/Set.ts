import {ID} from './Common';
import Dish from 'entities/Dish';
import Status from 'entities/Status';

export default interface Set {
  id: ID;
  name: string;
  imageId: string;
  cuisineId: string;
  priceCents: number;
  dishes: Dish[];
  statuses: Status[];
  day: string | undefined;
  isFavorite: boolean | undefined;
}
