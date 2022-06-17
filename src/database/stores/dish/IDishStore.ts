import Dish from 'database/entities/Dish';
import Ingredient from 'database/entities/Ingredient';

export default abstract class IDishStore {
  abstract findDishById(id: string): Promise<Dish | undefined>;

  abstract getDishes(): Promise<Dish[]>;

  abstract getSelectedDishes(ids: string[]): Promise<Dish[]>;

  abstract getDishesBySetIdOrFail(id: string): Promise<Dish[]>;

  abstract updateDish(
    id: string,
    imageId: string,
    name: string,
    description: string,
    weight: string,
    kal: string,
    ingredient: Ingredient[],
  ): Promise<Dish>;

  abstract createDish(
    imageId: string,
    name: string,
    description: string,
    weight: string,
    kal: string,
    ingredient: Ingredient[],
  ): Promise<Dish>;

  abstract deleteDish(id: string): Promise<void>;
}
