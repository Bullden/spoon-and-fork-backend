import User from 'database/entities/User';
import {ID} from 'entities/Common';
import Courier from 'database/entities/Courier';
import Client from 'database/entities/Client';
import LatLng from 'entities/LatLng';
import Admin from 'database/entities/Admin';

export interface GetCouriersFilter {
  withoutActiveOrders?: true;
}

export default abstract class IUserStore {
  abstract createUser(user: Partial<User>): Promise<User>;

  abstract getUser(userId: ID): Promise<User | undefined>;

  abstract getUserOrFail(userId: ID): Promise<User>;

  abstract createClientIfNotExists(userId: ID): Promise<Client>;

  abstract createCourierIfNotExists(userId: ID): Promise<Courier>;

  abstract getClientOrThrow(userId: ID): Promise<Client>;

  abstract getCourierByUserIdOrThrow(userId: ID): Promise<Courier>;

  abstract getCourierById(id: string): Promise<Courier | undefined>;

  abstract getCourierByIdOrThrow(id: ID): Promise<Courier>;

  abstract updateClientInformation(
    id: string,
    name: string,
    email: string,
    phoneNumber: string,
  ): Promise<void>;

  abstract updateCourierInformation(
    id: string,
    name: string,
    email: string,
    phoneNumber: string,
  ): Promise<void>;

  abstract getClientById(id: string): Promise<Client | undefined>;

  abstract getClients(): Promise<Client[]>;

  abstract getCouriers(filter?: GetCouriersFilter): Promise<Courier[]>;

  abstract updateLocation(userId: ID, latLng: LatLng): Promise<void>;

  abstract getEnabledAdmins(): Promise<Admin[]>;

  abstract updateUser(
    userId: ID,
    data: {
      name: string;
      email: string;
      phoneNumber: string;
    },
  ): Promise<void>;

  abstract updateUserImage(userId: ID, imageId: string): Promise<void>;
}
