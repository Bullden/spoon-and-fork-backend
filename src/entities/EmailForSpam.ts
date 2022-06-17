import {ID} from './Common';

export default interface EmailForSpam {
  id: ID;
  email: string;
  isDiscount: boolean;
}
