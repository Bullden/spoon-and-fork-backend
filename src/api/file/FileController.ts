import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {FileInterceptor} from '@nestjs/platform-express';
import IFileManager from 'managers/file/IFileManager';
import {Response} from 'express';
import UploadFileInfo from './UploadFileInfo';
import Ignore from 'enhancers/decorators/Ignore';
import {ID} from 'entities/Common';

@Controller('api/files')
export class FilesController {
  constructor(private readonly fileManager: IFileManager) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @Ignore('Authorization')
  async uploadFile(@UploadedFile() file: UploadFileInfo): Promise<string> {
    const image = await this.fileManager.addFile(
      file.originalname,
      file.mimetype,
      file.buffer,
    );
    return image.id;
  }

  @Get(':id')
  @Ignore('Platform', 'AppType')
  async getFile(@Param('id') id: ID, @Res() res: Response): Promise<void> {
    const file = await this.fileManager.getFile({id});
    file.stream
      .on('error', (err) => {
        res.status(400).send(err);
      })
      .pipe(res);
  }
}
