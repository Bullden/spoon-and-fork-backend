import Status from 'entities/Status';
import {ID} from 'entities/Common';

export default abstract class IStatusManager {
  abstract findStatusByIdOrThrow(id: string): Promise<Status>;

  abstract getStatusesBySetId(id: string): Promise<Status[]>;

  abstract getStatuses(): Promise<Status[]>;

  abstract updateStatus(id: string, imageId: string, name: string): Promise<Status>;

  abstract createStatus(imageId: string, name: string): Promise<void>;

  abstract deleteStatus(statusId: ID): Promise<void>;
}
