import {SetMetadata} from '@nestjs/common';
import {Role} from 'entities/Common';

export default (...roles: Role[]) => SetMetadata('roles', roles);
