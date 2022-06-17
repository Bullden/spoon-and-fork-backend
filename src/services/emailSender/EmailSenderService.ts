import {IEmailSenderService} from 'services/emailSender/IEmailSenderService';
import {Injectable} from '@nestjs/common';
import {MailerService} from '@nest-modules/mailer';
import EmailMessage from './EmailMessage';

@Injectable()
export class EmailSenderService implements IEmailSenderService {
  constructor(private readonly mailerService: MailerService) {}

  public async sendMessage<TContext>(email: string, message: EmailMessage<TContext>) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: message.subject,
        template: message.template,
        context: message.context,
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
      throw e;
    }
  }
}
