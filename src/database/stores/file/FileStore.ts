import File from '../../entities/File';
import IFileStore from './IFileStore';
import {Injectable} from '@nestjs/common';
import {InjectConnection, InjectRepository} from '@nestjs/typeorm';
import {Connection, Repository} from 'typeorm';

@Injectable()
export default class FileStore implements IFileStore {
  constructor(
    @InjectConnection()
    private connection: Connection,
    @InjectRepository(File)
    private readonly fileStore: Repository<File>,
  ) {}

  async addFile(name: string, mimeType: string, mediaLink: string) {
    const file = await this.fileStore.create({name, mimeType, mediaLink});
    await this.fileStore.insert(file);
    return file;
  }

  async getFile(file: {id: string}) {
    return this.fileStore.findOne({where: {id: file.id}});
  }
}
