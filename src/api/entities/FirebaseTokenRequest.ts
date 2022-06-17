import {IsNotEmpty} from 'class-validator';

export default class FirebaseTokenRequest {
  constructor(registrationId: string) {
    this.registrationId = registrationId;
  }

  @IsNotEmpty()
  registrationId: string;
}
