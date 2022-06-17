import Bag from 'entities/Bag';

export default abstract class IBagManager {
  abstract findBagByCodeOrThrow(code: string): Promise<Bag>;

  abstract getBagByOrderId(id: string): Promise<Bag>;
}
