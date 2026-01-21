'use client';

import {
  ApolloClient,
  ApolloNextAppProvider,
  InMemoryCache,
} from '@apollo/client-integration-nextjs';
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

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: uploadLink,
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
