import { ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { join } from 'path';
import { isDev } from '../../shared/utils/is-dev.util';

export const getGraphQLConfig = (
  configService: ConfigService,
): ApolloDriverConfig => ({
  playground: isDev(configService),
  path: configService.getOrThrow<string>('GRAPHQL_PATH'),
  autoSchemaFile: join(process.cwd(), 'src/core/graphql/schema.gql'),
  sortSchema: true,
  context: ({ req, res }: { req: Request; res: Response }) => ({ req, res }),
});
