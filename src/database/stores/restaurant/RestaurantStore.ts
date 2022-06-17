import IRestaurantStore from './IRestaurantStore';
import {InjectRepository} from '@nestjs/typeorm';
import Restaurant from 'database/entities/Restaurant';
import {Repository} from 'typeorm';
import {ID} from '../../../entities/Common';
import Cuisine from 'database/entities/Cuisine';
import Address from 'database/entities/Address';
import User from 'database/entities/User';
import LocalLogin from 'database/entities/LocalLogin';
import ILoginStore from '../login/ILoginStore';

export default class RestaurantStore extends IRestaurantStore {
  constructor(
    @InjectRepository(Restaurant)
    private readonly repository: Repository<Restaurant>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(LocalLogin)
    private readonly localLoginRepository: Repository<LocalLogin>,
    private localLoginStore: ILoginStore,
  ) {
    super();
  }

  private readonly allRelations = [
    //
    'user',
    'address',
    'cuisines',
  ];

  async getRestaurantById(id: string) {
    return this.repository.findOneOrFail(id, {
      relations: this.allRelations,
    });
  }

  async getRestaurantByUserId(userId: ID) {
    return this.repository.findOneOrFail(
      {user: {id: userId}},
      {relations: ['user', 'address', 'cuisines']},
    );
  }

  async getRestaurants() {
    return this.repository.find({
      relations: this.allRelations,
    });
  }

  async createRestaurant(
    userId: string,
    imageId: string,
    title: string,
    description: string,
    address: Address,
    cuisines: Cuisine[],
  ) {
    const restaurant = await this.repository.create({
      userId,
      imageId,
      title,
      description,
      address,
    });

    await this.repository.insert(restaurant);
    await this.repository.save(restaurant);

    const restaurantFromDB = await this.getRestaurantById(restaurant.id);
    if (!restaurantFromDB.cuisines)
      throw new Error('restaurant.cuisines must be not undefined');
    restaurantFromDB.cuisines = cuisines;

    await this.repository.save(restaurantFromDB);
  }

  async updateRestaurant(
    id: string,
    imageId: string,
    title: string,
    description: string,
    address: Address,
    cuisines: Cuisine[],
  ) {
    await this.repository.update(id, {
      imageId,
      title,
      description,
      address,
    });

    const restaurant = await this.getRestaurantById(id);
    if (!restaurant.cuisines)
      throw new Error('restaurant.cuisines must be not undefined');
    restaurant.cuisines = cuisines;

    await this.repository.save(restaurant);

    return restaurant;
  }

  async deleteRestaurant(id: string): Promise<void> {
    const restaurant = await this.repository.findOneOrFail(id, {relations: ['user']});
    const userId = restaurant.user && restaurant.user.id;

    await this.repository.delete({id});

    if (userId) {
      const localLogin = await this.localLoginStore.getLocalLoginByUser({id: userId});

      if (localLogin) {
        await this.localLoginRepository.delete({id: localLogin.id});
        await this.userRepository.delete({id: userId});
      }
    }
  }
}
