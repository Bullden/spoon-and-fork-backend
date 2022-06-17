import {ID} from './Common';
import User from 'entities/User';

export default interface Client {
  id: ID;
  user: User;
}
