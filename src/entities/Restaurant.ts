import {ID} from './Common';
import Address from 'entities/Address';
import Cuisine from 'entities/Cuisine';
import User from 'entities/User';

export default interface Restaurant {
  id: ID;
  user: User;
  imageId: string;
  address: Address;
  title: string;
  description: string;
  cuisines: Cuisine[];
}
