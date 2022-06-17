import IStatusStore from './IStatusStore';
import {InjectRepository} from '@nestjs/typeorm';
import Status from 'database/entities/Status';
import {In, Repository} from 'typeorm';
import Set from 'database/entities/Set';
import SpoonError from 'SpoonError';

export default class StatusStore extends IStatusStore {
  constructor(
    @InjectRepository(Status)
    private readonly repository: Repository<Status>,
    @InjectRepository(Set)
    private readonly setRepository: Repository<Set>,
  ) {
    super();
  }

  async findStatusById(id: string) {
    return this.repository.findOne({
      where: {id},
    });
  }

  async findStatusByIdOrThrow(id: string) {
    return this.repository.findOneOrFail({
      where: {id},
    });
  }

  async getStatusesBySetIdOrFail(id: string) {
    const set = await this.setRepository.findOneOrFail(id, {relations: ['statuses']});
    if (!set.statuses) throw new SpoonError('Set statuses not found');
    return set.statuses;
  }

  async getStatuses() {
    return this.repository.find();
  }

  async getSelectedStatuses(ids: string[]) {
    return this.repository.find({
      where: {id: In(ids)},
    });
  }

  async updateStatus(id: string, imageId: string, name: string) {
    await this.repository.update(id, {
      imageId,
      name,
    });

    return this.findStatusByIdOrThrow(id);
  }

  async createStatus(imageId: string, name: string) {
    await this.repository.insert({imageId, name});
  }

  async deleteStatus(id: string): Promise<void> {
    await this.repository.delete({id});
  }
}
