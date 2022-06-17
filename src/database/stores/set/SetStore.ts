import ISetStore from './ISetStore';
import {InjectRepository} from '@nestjs/typeorm';
import Set from 'database/entities/Set';
import {Repository} from 'typeorm';
import Cuisine from 'database/entities/Cuisine';
import Dish from 'database/entities/Dish';
import Status from 'database/entities/Status';
import ICuisineStore from 'database/stores/cuisine/ICuisineStore';
import SetIdAndDay from 'entities/SetIdAndDay';

export default class SetStore extends ISetStore {
  constructor(
    @InjectRepository(Set)
    private readonly repository: Repository<Set>,
    @InjectRepository(Cuisine)
    private readonly cuisineRepository: Repository<Cuisine>,
    private cuisineStore: ICuisineStore,
  ) {
    super();
  }

  async findSetById(id: string) {
    return this.repository.findOneOrFail(id, {
      relations: ['statuses', 'dishes', 'dishes.ingredients'],
    });
  }

  async getCuisineSets(cuisineId: string) {
    return this.repository.find({
      where: {cuisineId},
      relations: ['dishes', 'dishes.ingredients', 'statuses'],
    });
  }

  async getSets() {
    return this.repository.find({
      relations: ['dishes', 'dishes.ingredients', 'statuses'],
    });
  }

  async getSetsByDishId(dishId: string) {
    return this.repository
      .createQueryBuilder('s')
      .innerJoinAndSelect('s.dishes', 'dishes')
      .innerJoinAndSelect('dishes.ingredients', 'ingredients')
      .innerJoinAndSelect('s.statuses', 'statuses')
      .where('dishes.id = :id', {id: dishId})
      .getMany();
  }

  async updateSet(
    id: string,
    name: string,
    imageId: string,
    priceCents: number,
    cuisine: string,
    dishes: Dish[],
    statuses: Status[],
  ) {
    const cuisineDB = await this.cuisineStore.findCuisineById(cuisine);

    await this.repository.update(id, {
      imageId,
      name,
      priceCents,
      cuisine: cuisineDB,
    });

    const set = await this.findSetById(id);
    if (!set.dishes) throw new Error('set.dishes must be not undefined');
    set.dishes = dishes;
    if (!set.statuses) throw new Error('set.statuses must be not undefined');
    set.statuses = statuses;

    await this.repository.save(set);

    return set;
  }

  async createSet(
    name: string,
    imageId: string,
    priceCents: number,
    cuisine: string,
    dishes: Dish[],
    statuses: Status[],
  ) {
    const cuisineDB = await this.cuisineStore.findCuisineById(cuisine);

    const dish = await this.repository.create({
      imageId,
      name,
      priceCents,
      cuisine: cuisineDB,
      dishes,
      statuses,
    });

    await this.repository.insert(dish);
    await this.repository.save(dish);
  }

  async updateSetDishes(id: string, dishes: Dish[]) {
    const set = await this.repository.findOneOrFail(id, {
      relations: ['cuisine', 'dishes', 'dishes.ingredients', 'statuses'],
    });

    if (!set.dishes) throw new Error('set.dishes must be not undefined');
    set.dishes = dishes;

    await this.repository.save(set);
  }

  async updateSetStatuses(id: string, statuses: Status[]) {
    const set = await this.repository.findOneOrFail(id, {
      relations: ['cuisine', 'dishes', 'dishes.ingredients', 'statuses'],
    });

    if (!set.statuses) throw new Error('set.statuses must be not undefined');
    set.statuses = statuses;

    await this.repository.save(set);
  }

  async addDishToSelectedSets(dish: Dish, setIds: string[]) {
    const setsDB = await this.repository.findByIds(setIds, {
      relations: ['cuisine', 'dishes', 'dishes.ingredients', 'statuses'],
    });

    setsDB.forEach((setDB) => {
      if (!setDB.dishes) throw new Error('set.dishes must be not undefined');
      // eslint-disable-next-line no-param-reassign
      setDB.dishes = [...setDB.dishes, dish];
    });

    await this.repository.save(setsDB);
  }

  async deleteDishFromSelectedSets(dish: Dish, setIds: string[]) {
    const setsDB = await this.repository.findByIds(setIds, {
      relations: ['cuisine', 'dishes', 'dishes.ingredients', 'statuses'],
    });

    setsDB.forEach((setDB) => {
      if (!setDB.dishes) throw new Error('set.dishes must be not undefined');
      // eslint-disable-next-line no-param-reassign
      setDB.dishes = [...setDB.dishes.filter((setDish) => setDish.id !== dish.id)];
    });

    await this.repository.save(setsDB);
  }

  async distributeSetsOfWeek(setIdsAndDays: SetIdAndDay[]) {
    const setIds = setIdsAndDays.map((item) => item.setId);

    const setsDB: Set[] = await this.repository.findByIds(setIds, {
      relations: ['cuisine', 'dishes', 'dishes.ingredients', 'statuses'],
    });

    setsDB.forEach((setDB) => {
      // eslint-disable-next-line no-param-reassign
      setDB.day = setIdsAndDays.filter((item) => item.setId === setDB.id)[0].day || '';
    });

    await this.repository.save(setsDB);
  }

  async deleteSet(id: string): Promise<void> {
    await this.repository.delete({id});
  }
}
