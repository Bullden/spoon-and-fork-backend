import {Module} from '@nestjs/common';
import {ConfigModule} from 'services/config/ConfigModule';
import IConfigService from 'services/config/IConfigService';
import IFirebaseService from 'services/firebase/IFirebaseService';
import FirebaseService from 'services/firebase/FirebaseService';
import * as FirebaseAdmin from 'firebase-admin';
import * as fs from 'fs';
import {StoresModule} from 'database/stores/StoresModule';
import {getProjectRoot} from 'utils/FileSystemUtils';

@Module({
  imports: [
    //
    ConfigModule,
    StoresModule,
  ],
  providers: [
    {
      provide: IFirebaseService,
      useClass: FirebaseService,
    },
  ],
  exports: [IFirebaseService],
})
export class FirebaseModule {
  constructor(configService: IConfigService) {
    const certFile = configService.get('FIREBASE_CERT');
    const certFilePath = `${getProjectRoot()}/${certFile}`;
    if (!fs.existsSync(certFilePath))
      throw new Error(`config file not exists at '${certFilePath}'`);
    FirebaseAdmin.initializeApp({
      credential: FirebaseAdmin.credential.cert(certFilePath),
    });
  }
}
