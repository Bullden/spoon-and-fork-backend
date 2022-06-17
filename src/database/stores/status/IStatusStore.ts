import Status from 'entities/Status';

export default abstract class IStatusStore {
  abstract findStatusById(id: string): Promise<Status | undefined>;

  abstract getStatusesBySetIdOrFail(id: string): Promise<Status[]>;

  abstract getStatuses(): Promise<Status[]>;

  abstract getSelectedStatuses(ids: string[]): Promise<Status[]>;

  abstract updateStatus(id: string, imageId: string, name: string): Promise<Status>;

  abstract createStatus(imageId: string, name: string): Promise<void>;

  abstract deleteStatus(id: string): Promise<void>;
}
