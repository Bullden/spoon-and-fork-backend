import Set from 'entities/Set';
import SetIdAndDay from 'entities/SetIdAndDay';
import {ID} from 'entities/Common';

export default abstract class ISetManager {
  abstract findSetByIdOrThrow(id: string): Promise<Set>;

  abstract getSetsByCuisineId(id: string): Promise<Set[]>;

  abstract getSets(): Promise<Set[]>;

  abstract getSetsByDishId(id: string): Promise<Set[]>;

  abstract updateSet(
    id: string,
    name: string,
    imageId: string,
    priceCents: string,
    cuisineId: string,
    dishes: string[],
    statuses: string[],
  ): Promise<Set>;

  abstract createSet(
    name: string,
    imageId: string,
    priceCents: string,
    cuisineId: string,
    dishes: string[],
    statuses: string[],
  ): Promise<void>;

  abstract distributeSetsOfWeek(setIdsAndDays: SetIdAndDay[]): Promise<void>;

  abstract deleteSet(setId: ID): Promise<void>;
}
