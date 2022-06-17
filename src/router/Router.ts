import IRouter, {Absolute, Routes} from './IRouter';
import {Injectable} from '@nestjs/common';
import {IConfigService} from '@spryrocks/config-node';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const q = (key: string, value: string) => ({key, value});

@Injectable()
export default class Router extends IRouter {
  private readonly globalPrefix: string | undefined;

  constructor(private readonly configService: IConfigService) {
    super();
    this.globalPrefix = configService.getOptional('HTTP_GLOBAL_PREFIX');
  }

  getSuccessOrderPaymentRoute(
    queries: {orderId: string},
    options: {absolute: Absolute},
  ): string {
    const path = (() => {
      return Routes.payment.successOrder.path;
    })();
    return this.constructUri(
      options ? options.absolute : undefined,
      [Routes.payment.prefix, path],
      [q(Routes.payment.successOrder.query_orderId, queries.orderId)],
    );
  }

  getOrderPaymentCompletedRoute(queries: {orderId: string}) {
    const schema = this.configService.get('LINKING_CLIENT_SCHEMA');
    const host = this.configService.get('LINKING_HOST');
    const path = (() => {
      return Routes.payment.successOrderCompleted.path;
    })();
    return this.constructUri(
      {baseUrl: `${schema}://${host}`},
      [Routes.payment.prefix, path],
      [q(Routes.payment.successOrderCompleted.query_orderId, queries.orderId)],
    );
  }

  private constructUri(
    absolute: Absolute | undefined,
    elements: string[],
    queries?: {key: string; value: string}[],
  ) {
    let uri: string = '';
    if (absolute) uri += absolute.baseUrl;
    if (this.globalPrefix) uri += `/${this.globalPrefix}`;
    uri += elements.map((el) => `/${el}`).join('');
    if (queries) uri += `?${queries.map(({key, value}) => `${key}=${value}`).join('')}`;
    return uri;
  }
}
