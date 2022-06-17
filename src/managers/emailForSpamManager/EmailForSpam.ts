import {Injectable} from '@nestjs/common';
import IEmailForSpamManager from 'managers/emailForSpamManager/IEmailFroSpam';
import CreateEmailForSpamRequest from 'graphql/entities/emailForSpam/CreateEmailForSpamRequest';
import IEmailForSpamStoreStore from 'database/stores/emailForSpam/IEmailForSpamStore';
import EmailsForSpam from 'entities/EmailForSpam';
import SpoonError from 'SpoonError';
import {mapEmailForSpamListFromDb} from 'database/entities/Mappers';

@Injectable()
export default class EmailForSpam implements IEmailForSpamManager {
  constructor(
    //
    private emailForSpamStore: IEmailForSpamStoreStore,
  ) {}

  async createEmailForSpam(email: CreateEmailForSpamRequest) {
    await this.emailForSpamStore.createEmailForSpam({...email});
  }

  async getEmailsForSpam(): Promise<EmailsForSpam[]> {
    const emails = await this.emailForSpamStore.getEmails();
    if (emails.length < 0) throw new SpoonError('no emails at the moment');

    return mapEmailForSpamListFromDb(emails);
  }
}
