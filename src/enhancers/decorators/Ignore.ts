import {SetMetadata} from '@nestjs/common';
import {IgnoreElement} from 'entities/Common';

export default (...elements: IgnoreElement[]) => SetMetadata('ignore', elements);
