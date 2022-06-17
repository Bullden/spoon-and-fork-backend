import {ID} from 'entities/Common';
import {Buffer} from 'buffer';
import {Readable} from 'stream';

export default abstract class IFileManager {
  abstract addFile(name: string, mimeType: string, buffer: Buffer): Promise<{id: ID}>;

  abstract getFile(id: {id: string}): Promise<{stream: Readable}>;
}
