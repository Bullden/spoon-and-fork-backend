import {Module} from '@nestjs/common';
import INotificationService from './INotificationService';
import NotificationService from './NotificationService';
import {StoresModule} from 'database/stores/StoresModule';
import {EmailSenderModule} from 'services/emailSender/EmailSenderModule';
import {FirebaseModule} from 'services/firebase/FirebaseModule';

@Module({
  imports: [
    //
    StoresModule,
    EmailSenderModule,
    FirebaseModule,
  ],
  providers: [
    {
      provide: INotificationService,
      useClass: NotificationService,
    },
  ],
  exports: [INotificationService],
})
export class NotificationModule {}
