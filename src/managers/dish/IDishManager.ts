import Dish from 'entities/Dish';
import {ID} from 'entities/Common';

export default abstract class IDishManager {
  abstract findDishByIdOrThrow(id: string): Promise<Dish>;

  abstract getDishes(): Promise<Dish[]>;

  abstract getDishesBySetId(id: string): Promise<Dish[]>;

  abstract updateDish(
    id: string,
    imageId: string,
    name: string,
    description: string,
    weight: string,
    kal: string,
    ingredients: string[],
    sets: string[],
  ): Promise<Dish>;

  abstract createDish(
    imageId: string,
    name: string,
    description: string,
    weight: string,
    kal: string,
    ingredients: string[],
    sets: string[],
  ): Promise<void>;

  abstract deleteDish(dishId: ID): Promise<void>;
}
