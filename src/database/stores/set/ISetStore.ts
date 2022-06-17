import Set from 'database/entities/Set';
import Dish from 'database/entities/Dish';
import Status from 'entities/Status';
import SetIdAndDay from 'entities/SetIdAndDay';

export default abstract class ISetStore {
  abstract findSetById(id: string): Promise<Set | undefined>;

  abstract getCuisineSets(id: string): Promise<Set[]>;

  abstract getSets(): Promise<Set[]>;

  abstract getSetsByDishId(dishId: string): Promise<Set[]>;

  abstract updateSet(
    id: string,
    name: string,
    imageId: string,
    priceCents: number,
    cuisineId: string,
    dishes: Dish[],
    statuses: Status[],
  ): Promise<Set>;

  abstract createSet(
    name: string,
    imageId: string,
    priceCents: number,
    cuisineId: string,
    dishes: Dish[],
    statuses: Status[],
  ): Promise<void>;

  abstract updateSetDishes(id: string, dishes: Dish[]): Promise<void>;

  abstract updateSetStatuses(id: string, statuses: Status[]): Promise<void>;

  abstract addDishToSelectedSets(dish: Dish, setIds: string[]): Promise<void>;

  abstract deleteDishFromSelectedSets(dish: Dish, setIds: string[]): Promise<void>;

  abstract distributeSetsOfWeek(setIdsAndDays: SetIdAndDay[]): Promise<void>;

  abstract deleteSet(id: string): Promise<void>;
}
