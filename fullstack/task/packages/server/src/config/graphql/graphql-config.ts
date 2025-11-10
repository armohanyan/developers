import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Context } from 'apollo-server-core';
import { config } from 'dotenv';

config();

const {
  GQL_DEBUG: debug,
  GQL_PLAYGROUND: playground,
  GQL_INTROSPECTION: introspection,
} = process.env;

export const graphqlConfig: ApolloDriverConfig = {
  driver: ApolloDriver,
  subscriptions: {
    'graphql-ws': {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onConnect: (context: Context<any>) => {
        const { connectionParams, extra } = context;
        const authorization = connectionParams?.headers?.Authorization;

        extra.headers = { authorization };
      },
    },
  },
  cache: 'bounded',
  autoSchemaFile: 'schema.gql',
  debug: debug === 'true',
  playground: playground === 'true',
  introspection: introspection === 'true',
  context: ({ req, extra }) => {
    // Subscriptions
    if (extra) {
      return { req: { headers: extra.headers } };
    }

    // Queries and mutations
    return { req };
  },
};
