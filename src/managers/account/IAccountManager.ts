import Account from '../../entities/Account';
import {ID} from 'entities/Common';

export default abstract class IAccountManager {
  abstract getMyAccount(myUserId: string): Promise<Account>;

  abstract updateAccount(
    myUserId: ID,
    data: {
      name: string;
      email: string;
      phoneNumber: string;
    },
  ): Promise<Account>;

  abstract updateAccountImage(myUserId: ID, image: string): Promise<void>;
}
