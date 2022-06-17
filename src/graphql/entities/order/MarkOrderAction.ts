import {registerEnumType} from '@nestjs/graphql';

export enum MarkOrderAction {
  CheckIn = 'checkin',
  CheckOut = 'checkout',
}

registerEnumType(MarkOrderAction, {name: 'MarkOrderAction'});
