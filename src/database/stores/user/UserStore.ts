import {Injectable} from '@nestjs/common';
import {InjectRepository, InjectConnection} from '@nestjs/typeorm';
import {Repository, Connection} from 'typeorm';
import IUserStore, {GetCouriersFilter} from './IUserStore';
import User from '../../entities/User';
import {ID} from 'entities/Common';
import SpoonError from 'SpoonError';
import Client from 'database/entities/Client';
import Admin from 'database/entities/Admin';
import Courier from 'database/entities/Courier';
import Order from 'database/entities/Order';
import Address from 'database/entities/Address';
import {OrderState} from 'entities/Order';
// import CreateAddressRequest from 'database/entities/CreateAddressRequest';
import LatLng from '../../../entities/LatLng';

@Injectable()
export default class UserStore implements IUserStore {
  constructor(
    @InjectConnection()
    private connection: Connection,
    @InjectRepository(User)
    private readonly repository: Repository<User>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(Courier)
    private readonly courierRepository: Repository<Courier>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  async getUser(userId: ID) {
    return this.repository.findOneOrFail({
      where: {id: userId},
    });
  }

  async getUserOrFail(userId: ID) {
    const user = await this.getUser(userId);
    if (!user) throw new SpoonError('User not found');
    return user;
  }

  async createUser(user: Partial<User>) {
    const newUser = this.repository.create({...user});
    await this.repository.insert(newUser);
    return newUser;
  }

  async createClientIfNotExists(userId: string) {
    const user = {id: userId};
    const client = await this.clientRepository.findOne(
      {user},
      {
        loadRelationIds: true,
      },
    );
    if (client) return client;

    {
      const client = this.clientRepository.create({user});
      await this.clientRepository.insert(client);
      return client;
    }
  }

  async createCourierIfNotExists(userId: string) {
    const user = {id: userId};
    const courier = await this.courierRepository.findOne(
      {user},
      {
        loadRelationIds: true,
      },
    );
    if (courier) return courier;

    {
      const courier = this.courierRepository.create({user});
      await this.courierRepository.insert(courier);
      return courier;
    }
  }

  async getClientOrThrow(userId: ID) {
    return this.clientRepository.findOneOrFail({user: {id: userId}});
  }

  async getCourierByUserIdOrThrow(userId: ID) {
    return this.courierRepository.findOneOrFail(
      {user: {id: userId}},
      {relations: ['user', 'revision']},
    );
  }

  async getClientById(id: string) {
    return this.clientRepository.findOneOrFail({id}, {relations: ['user']});
  }

  async getCourierById(id: string) {
    return this.courierRepository.findOneOrFail({id}, {relations: ['user', 'revision']});
  }

  async getCourierByIdOrThrow(id: ID) {
    const courier = await this.getCourierById(id);
    if (!courier) throw new SpoonError(`Courier with id ${id} not found`);
    return courier;
  }

  async updateLocation(userId: ID, latLng: LatLng): Promise<void> {
    await this.repository.update(userId, {lat: latLng.lat, lng: latLng.lng});
  }

  async updateClientInformation(
    id: string,
    name: string,
    email: string,
    phoneNumber: string,
  ) {
    const client = await this.getClientById(id);

    await this.repository.update(client.userId, {
      name,
      email,
      phoneNumber,
    });
  }

  async updateCourierInformation(
    id: string,
    name: string,
    email: string,
    phoneNumber: string,
  ) {
    const courier = await this.getCourierById(id);

    await this.repository.update(courier.userId, {
      name,
      email,
      phoneNumber,
    });
  }

  async getClients() {
    return this.clientRepository.find({relations: ['user']});
  }

  async getCouriers(filter?: GetCouriersFilter) {
    const ordersInProgressQuery = this.orderRepository
      .createQueryBuilder('o')
      .andWhere('o.state <> :state', {state: OrderState.Completed})
      .select(['c.id']);

    let queryBuilder = this.courierRepository.createQueryBuilder('c');

    if (filter) {
      if (filter.withoutActiveOrders) {
        queryBuilder = queryBuilder.where(
          `NOT EXISTS (${ordersInProgressQuery.getQuery()})`,
          ordersInProgressQuery.getParameters(),
        );
      }
    }

    return queryBuilder
      .leftJoinAndSelect('c.user', 'user')
      .leftJoinAndSelect('c.revision', 'revision')
      .getMany();
  }

  async getEnabledAdmins() {
    return this.adminRepository.find({where: {isEnabled: true}, relations: ['user']});
  }

  async updateUser(
    userId: string,
    data: {
      name: string;
      email: string;
      phoneNumber: string;
      allowNotifications: boolean;
    },
  ) {
    await this.repository.update(userId, data);
  }

  async updateUserImage(userId: string, imageId: string) {
    await this.repository.update(userId, {
      imageId,
    });
  }
}
