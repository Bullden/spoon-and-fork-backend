import IDishManager from 'managers/dish/IDishManager';
import IDishStore from 'database/stores/dish/IDishStore';
import Dish from 'entities/Dish';
import {mapDishesFromDb, mapDishFromDb} from 'database/entities/Mappers';
import {Injectable} from '@nestjs/common';
import SpoonError from 'SpoonError';
import IIngredientStore from 'database/stores/ingredient/IIngredientStore';
import ISetStore from 'database/stores/set/ISetStore';
import {ID} from 'entities/Common';

@Injectable()
export default class DishManager extends IDishManager {
  constructor(
    private dishStore: IDishStore,
    private ingredientStore: IIngredientStore,
    private setStore: ISetStore,
  ) {
    super();
  }

  async findDishByIdOrThrow(id: string): Promise<Dish> {
    const dish = await this.dishStore.findDishById(id);
    if (!dish) throw new SpoonError('Dish not found');
    return mapDishFromDb(dish);
  }

  async getDishes(): Promise<Dish[]> {
    return mapDishesFromDb(await this.dishStore.getDishes());
  }

  async getDishesBySetId(id: string) {
    const dishes = await this.dishStore.getDishesBySetIdOrFail(id);
    return mapDishesFromDb(dishes);
  }

  async updateDish(
    id: string,
    imageId: string,
    name: string,
    description: string,
    weight: string,
    kal: string,
    ingredients: string[],
    sets: string[],
  ): Promise<Dish> {
    const ingredientsDB = await this.ingredientStore.createIngredients(ingredients);

    const updatedDish = await this.dishStore.updateDish(
      id,
      imageId,
      name,
      description,
      weight,
      kal,
      ingredientsDB,
    );

    const dishSets = await this.setStore.getSetsByDishId(updatedDish.id);

    const dishSetsIds = dishSets.map((set) => set.id);

    const setsToAddDish = sets.filter((x) => !dishSetsIds.includes(x));
    const setsToDeleteDish = dishSetsIds.filter((x) => !sets.includes(x));

    await this.setStore.addDishToSelectedSets(updatedDish, setsToAddDish);
    await this.setStore.deleteDishFromSelectedSets(updatedDish, setsToDeleteDish);

    return mapDishFromDb(updatedDish);
  }

  async createDish(
    imageId: string,
    name: string,
    description: string,
    weight: string,
    kal: string,
    ingredients: string[],
    sets: string[],
  ): Promise<void> {
    const ingredientsDB = await this.ingredientStore.createIngredients(ingredients);

    const dish = await this.dishStore.createDish(
      imageId,
      name,
      description,
      weight,
      kal,
      ingredientsDB,
    );

    await this.setStore.addDishToSelectedSets(dish, sets);
  }

  async deleteDish(dishId: ID) {
    await this.dishStore.deleteDish(dishId);
  }
}
