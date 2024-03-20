import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { split, ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
// import DebounceLink from 'apollo-link-debounce';
import { HttpLink } from 'apollo-link-http';
// import { RetryLink } from 'apollo-link-retry';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import {GRAPHQL_SERVER, GRAPHQL_SUBSCRIPTION_ENDPOINT} from '../utils/constants'

// const DEFAULT_DEBOUNCE_TIMEOUT = 314;
export interface IAuthenticator {
  getIdToken(): Promise<string>;
}

export interface IGraphQLClientOptions {
  httpURL: string;
  wsURL: string;
  authenticator?: IAuthenticator;
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