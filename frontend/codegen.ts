import type { CodegenConfig } from '@graphql-codegen/cli';
import 'dotenv/config';

const config: CodegenConfig = {
  schema: process.env.NEXT_PUBLIC_SERVER_URL,
  documents: ['graphql/**/*.graphql'],
  generates: {
    'graphql/gql/': {
      preset: 'client',
    },
  },
};

export default config;
