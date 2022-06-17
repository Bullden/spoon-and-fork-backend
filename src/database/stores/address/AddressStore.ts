import IAddressStore from 'database/stores/address/IAddressStore';
import {InjectRepository} from '@nestjs/typeorm';
import Address from 'database/entities/Address';
import {Repository} from 'typeorm';
import OrderInfo from '../../entities/OrderInfo';

export default class AddressStore extends IAddressStore {
  constructor(
    @InjectRepository(Address)
    private readonly repository: Repository<Address>,
    @InjectRepository(OrderInfo)
    private readonly orderInfoRepository: Repository<OrderInfo>,
  ) {
    super();
  }

  async createAddress(address: {
    placeId: string | undefined;
    lat: number;
    lng: number;
    description: string;
    entrance: string | undefined;
    floor: string | undefined;
    apartment: string | undefined;
    date: Date;
  }) {
    const newAddress = this.repository.create({
      placeId: address.placeId,
      lat: address.lat,
      lng: address.lng,
      description: address.description,
      entrance: address.entrance,
      floor: address.floor,
      apartment: address.apartment,
      date: address.date,
    });
    await this.repository.insert(newAddress);
    return newAddress;
  }

  async updateAddress(address: {
    id: string;
    placeId: string | undefined;
    lat: number;
    lng: number;
    description: string;
    entrance: string | undefined;
    floor: string | undefined;
    apartment: string | undefined;
    date: Date;
  }) {
    await this.repository.update(address.id, {
      placeId: address.placeId,
      lat: address.lat,
      lng: address.lng,
      description: address.description,
      entrance: address.entrance,
      floor: address.floor,
      apartment: address.apartment,
      date: address.date,
    });

    return this.repository.findOneOrFail(address.id);
  }

  async getUserAddressesFromOrder(clientAddressId: string) {
    return this.orderInfoRepository.find({
      where: {clientAddressId},
      relations: ['clientAddress'],
    });
  }
}
