import ISetManager from 'managers/set/ISetManager';
import ISetStore from 'database/stores/set/ISetStore';
import IDishStore from 'database/stores/dish/IDishStore';
import IStatusStore from 'database/stores/status/IStatusStore';
import Set from 'entities/Set';
import {mapSetFromDb, mapSetsFromDb} from 'database/entities/Mappers';
import {Injectable} from '@nestjs/common';
import SpoonError from 'SpoonError';
import SetIdAndDay from 'entities/SetIdAndDay';
import {ID} from 'entities/Common';

@Injectable()
export default class SetManager extends ISetManager {
  constructor(
    private setStore: ISetStore,
    private dishStore: IDishStore,
    private statusStore: IStatusStore,
  ) {
    super();
  }

  async findSetByIdOrThrow(id: string): Promise<Set> {
    const set = await this.setStore.findSetById(id);
    if (!set) throw new SpoonError('Set not found');
    return mapSetFromDb(set);
  }

  async getSetsByCuisineId(id: string) {
    const sets = await this.setStore.getCuisineSets(id);
    return mapSetsFromDb(sets);
  }

  async getSets(): Promise<Set[]> {
    return mapSetsFromDb(await this.setStore.getSets());
  }

  async getSetsByDishId(id: string): Promise<Set[]> {
    return mapSetsFromDb(await this.setStore.getSetsByDishId(id));
  }

  async updateSet(
    id: string,
    name: string,
    imageId: string,
    priceCents: string,
    cuisineId: string,
    dishes: string[],
    statuses: string[],
  ): Promise<Set> {
    const selectedDishes = await this.dishStore.getSelectedDishes(dishes);
    await this.setStore.updateSetDishes(id, selectedDishes);
    const dishesDB = await this.dishStore.getDishesBySetIdOrFail(id);

    const selectedStatuses = await this.statusStore.getSelectedStatuses(statuses);
    await this.setStore.updateSetStatuses(id, selectedStatuses);
    const statusesDB = await this.statusStore.getStatusesBySetIdOrFail(id);

    return mapSetFromDb(
      await this.setStore.updateSet(
        id,
        name,
        imageId,
        +priceCents,
        cuisineId,
        dishesDB,
        statusesDB,
      ),
    );
  }

  async createSet(
    name: string,
    imageId: string,
    priceCents: string,
    cuisineId: string,
    dishes: string[],
    statuses: string[],
  ): Promise<void> {
    const selectedDishes = await this.dishStore.getSelectedDishes(dishes);

    const selectedStatuses = await this.statusStore.getSelectedStatuses(statuses);

    return this.setStore.createSet(
      name,
      imageId,
      +priceCents,
      cuisineId,
      selectedDishes,
      selectedStatuses,
    );
  }

  async distributeSetsOfWeek(setIdsAndDays: SetIdAndDay[]): Promise<void> {
    return this.setStore.distributeSetsOfWeek(setIdsAndDays);
  }

  async deleteSet(setId: ID) {
    await this.setStore.deleteSet(setId);
  }
}
