import {InjectRepository} from '@nestjs/typeorm';
import EmailsForSpam from 'database/entities/EmailsForSpam';
import {Repository} from 'typeorm';
import IEmailForSpamStore from 'database/stores/emailForSpam/IEmailForSpamStore';

export default class EmailForSpamStore extends IEmailForSpamStore {
  constructor(
    @InjectRepository(EmailsForSpam)
    private readonly repository: Repository<EmailsForSpam>,
  ) {
    super();
  }

  async createEmailForSpam(email: {email: string; isDiscount: boolean}) {
    const newEmailForSpam = this.repository.create({
      email: email.email,
      isDiscount: email.isDiscount,
    });
    await this.repository.insert(newEmailForSpam);
    return newEmailForSpam;
  }

  async getEmails() {
    return this.repository.find({});
  }
}
