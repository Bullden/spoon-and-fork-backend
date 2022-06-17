import {ID} from './Common';
import User from 'entities/User';
import {DocumentsRevision} from 'entities/Document';

export default interface Courier {
  id: ID;
  user: User;
  revision: DocumentsRevision | undefined;
}
