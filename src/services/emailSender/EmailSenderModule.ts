import {Module} from '@nestjs/common';
import {IEmailSenderService} from 'services/emailSender/IEmailSenderService';
import {EmailSenderService} from 'services/emailSender/EmailSenderService';
import {HandlebarsAdapter, MailerModule} from '@nest-modules/mailer';
import * as fs from 'fs';
import IConfigService from 'services/config/IConfigService';
import {ConfigModule} from 'services/config/ConfigModule';
import {getProjectRoot} from 'utils/FileSystemUtils';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [IConfigService],
      useFactory: (configService: IConfigService) => {
        const templates = configService.get('EMAIL_TEMPLATES');
        const username = configService.get('EMAIL_SENDER_USERNAME');
        const password = configService.get('EMAIL_SENDER_PASSWORD');
        const host = configService.get('EMAIL_SMTP_HOST');
        const from = configService.get('EMAIL_FROM');
        const templatesDir = `${getProjectRoot()}/${templates}`;
        if (!fs.existsSync(templatesDir))
          throw new Error(`templatesDir not exists at '${templatesDir}'`);
        return {
          transport: `smtp://${username}:${password}@${host}`,
          defaults: {
            from,
          },
          template: {
            dir: templatesDir,
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
    }),
  ],
  providers: [
    {
      provide: IEmailSenderService,
      useClass: EmailSenderService,
    },
  ],
  exports: [
    //
    IEmailSenderService,
  ],
})
export class EmailSenderModule {}
