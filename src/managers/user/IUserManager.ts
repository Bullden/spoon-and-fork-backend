import Client from 'entities/Client';
import Courier from 'entities/Courier';
import {ID} from 'entities/Common';

export default abstract class IUserManager {
  abstract updateClientInformation(
    id: ID,
    name: string,
    email: string,
    phoneNumber: string,
  ): Promise<void>;

  abstract updateCourierInformation(
    id: ID,
    name: string,
    email: string,
    phoneNumber: string,
  ): Promise<void>;

  abstract getClients(): Promise<Client[]>;

  abstract getClientById(id: ID): Promise<Client | undefined>;

  abstract getCouriers(): Promise<Courier[]>;

  abstract getCourierById(id: ID): Promise<Courier | undefined>;
}
