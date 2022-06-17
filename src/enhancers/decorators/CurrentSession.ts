import {createParamDecorator} from '../utils/DecoratorUtils';

export default createParamDecorator((request) => request.session);
