import LocalLogin from 'database/entities/LocalLogin';
import User from 'database/entities/User';
import {ID} from 'entities/Common';

export default abstract class ILoginStore {
  abstract createLocalLogin(
    user: User,
    email: string,
    passwordHash: string,
  ): Promise<LocalLogin>;

  abstract getLocalLoginByEmail(email: string): Promise<LocalLogin | undefined>;

  abstract getLocalLoginByUser(user: {id: ID}): Promise<LocalLogin | undefined>;

  abstract updateLocalLoginPassword(
    user: {id: string},
    passwordHash: string,
  ): Promise<void>;

  abstract findLocalLoginByEmail(email: string): Promise<LocalLogin | undefined>;
}
