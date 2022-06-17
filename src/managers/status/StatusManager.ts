import IStatusManager from 'managers/status/IStatusManager';
import IStatusStore from 'database/stores/status/IStatusStore';
import Status from 'entities/Status';
import {mapStatusesFromDb, mapStatusFromDb} from 'database/entities/Mappers';
import {Injectable} from '@nestjs/common';
import SpoonError from 'SpoonError';
import {ID} from 'entities/Common';

@Injectable()
export default class StatusManager extends IStatusManager {
  constructor(private statusStore: IStatusStore) {
    super();
  }

  async findStatusByIdOrThrow(id: string): Promise<Status> {
    const status = await this.statusStore.findStatusById(id);
    if (!status) throw new SpoonError('Status not found');
    return mapStatusFromDb(status);
  }

  async getStatusesBySetId(id: string) {
    const statuses = await this.statusStore.getStatusesBySetIdOrFail(id);
    return mapStatusesFromDb(statuses);
  }

  async getStatuses(): Promise<Status[]> {
    return mapStatusesFromDb(await this.statusStore.getStatuses());
  }

  async updateStatus(id: string, imageId: string, name: string): Promise<Status> {
    return mapStatusFromDb(await this.statusStore.updateStatus(id, imageId, name));
  }

  async createStatus(imageId: string, name: string): Promise<void> {
    return this.statusStore.createStatus(imageId, name);
  }

  async deleteStatus(statusId: ID) {
    await this.statusStore.deleteStatus(statusId);
  }
}
