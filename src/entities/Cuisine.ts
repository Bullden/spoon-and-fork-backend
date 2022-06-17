import {ID} from './Common';

export default interface Cuisine {
  id: ID;
  imageId: string;
  nationality: string;
  rating: string | undefined;
}
