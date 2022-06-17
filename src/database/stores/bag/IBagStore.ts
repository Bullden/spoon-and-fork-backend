import Bag from 'database/entities/Bag';

export default abstract class IBagStore {
  abstract findBagByCode(code: string): Promise<Bag | undefined>;

  abstract getBagByOrderIdOrFail(id: string): Promise<Bag>;
}
