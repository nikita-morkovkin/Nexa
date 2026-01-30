'use client';

import { WEBSOCKET_URL } from '@/shared/constants/url.constants';
import { ApolloLink } from '@apollo/client';
import {
  ApolloClient,
  ApolloNextAppProvider,
  InMemoryCache,
} from '@apollo/client-integration-nextjs';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import UploadHttpLink from 'apollo-upload-client/UploadHttpLink.mjs';
import { type PropsWithChildren } from 'react';

function makeClient() {
  const uploadLink = new UploadHttpLink({
    uri: process.env.NEXT_PUBLIC_SERVER_URL,
    credentials: 'include',
    headers: {
      'apollo-require-preflight': 'true',
    },
  });

  const wsLink = new WebSocketLink({
    uri: WEBSOCKET_URL,
    options: {
      reconnect: true,
    },
  });

  const splitLink = ApolloLink.split(
    ({ query }) => {
      const definition = getMainDefinition(query);

      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    uploadLink,
  );

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: splitLink,
  });
}

const ApolloClientProvider = ({ children }: PropsWithChildren) => {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
};

export default ApolloClientProvider;
