import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { split, ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import DebounceLink from 'apollo-link-debounce';
import { HttpLink } from 'apollo-link-http';
// import { RetryLink } from 'apollo-link-retry';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import {GRAPHQL_SERVER, GRAPHQL_SUBSCRIPTION_ENDPOINT} from '../utils/constants'

const DEFAULT_DEBOUNCE_TIMEOUT = 314;
export interface IAuthenticator {
  getIdToken(): Promise<string>;
}

export interface IGraphQLClientOptions {
  httpURL: string;
  wsURL: string;
  authenticator?: IAuthenticator;
}


function getOsversion() {
  if (navigator.platform) {
    return navigator.platform;
  }

  return '';
}
function getModel() {
  const ua= navigator.userAgent;
  let tem,
    M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
  if (/trident/i.test(M[1])) {
    tem = /\brv[ :]+(\d+)/g.exec(ua) || [];

    return 'IE ' + (tem[1] || '');
  }
  if (M[1] === 'Chrome') {
    tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
    if (tem !== null) { return tem.slice(1).join(' ').replace('OPR', 'Opera'); }
  }
  M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
  // tslint:disable-next-line:no-conditional-assignment
  if ((tem = ua.match(/version\/(\d+)/i)) !== null) { M.splice(1, 1, tem[1]); }

  return M.join(' ');
}
function GraphQLClient(
  options: IGraphQLClientOptions
): ApolloClient<any> {

  const authLink = setContext(async (_, { headers }) => {
    const authorization = options && options.authenticator ? await options.authenticator.getIdToken() : null;
      // platform = 'service_sale';

    return {
      headers: {
        ...headers,
        // platform,
        ...(authorization ? {authorization} : null),
        platform: 'portal',
      }
    };
  });
  // const retryLink = new RetryLink({
  //   delay: {
  //     initial: 300,
  //     max: Infinity,
  //     jitter: true
  //   },
  //   attempts: {
  //     max: 5,
  //     retryIf: (error, _operation) => !!error
  //   }
  // });
  const httpLink = ApolloLink.from([
    // retryLink,
    // new DebounceLink(DEFAULT_DEBOUNCE_TIMEOUT),
    new HttpLink({
      uri: `${GRAPHQL_SERVER}`
    }),
  ]);

  // Create a WebSocket link:
  const wsLink = new WebSocketLink({
    uri: `${GRAPHQL_SUBSCRIPTION_ENDPOINT}`,
    options: {
      lazy: true,
      connectionParams: async () => {
        const authorization = localStorage.getItem('accessToken');

        return ({
          headers: {
            authorization,
            platform: 'portal',
            // 'x-hasura-access-token': authorization
          }
        });
      },
      reconnect: true
    }
  });

  const link = split(
    ({ query }) => {
      const { kind, operation } = <any> getMainDefinition(query);

      return kind === 'OperationDefinition'
        && operation === 'subscription';
    },
    wsLink,
    authLink.concat(httpLink),
  );

  return new ApolloClient(<any> {
    link,

    cache: new InMemoryCache(
      {addTypename: false}
    ),
    connectToDevTools: process.env.NODE_ENV !== 'production'
  });

}
export default GraphQLClient