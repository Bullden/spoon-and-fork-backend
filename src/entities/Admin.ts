import {ID} from './Common';
import User from 'entities/User';

export default interface Admin {
  id: ID;
  user: User;
}
