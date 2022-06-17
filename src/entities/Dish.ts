import {ID} from './Common';
import Ingredient from 'entities/Ingredient';

export default interface Dish {
  id: ID;
  name: string;
  description: string;
  imageId: string;
  weight: string;
  kal: string;
  ingredients: Ingredient[];
}
