import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import cors from 'cors';
import { typeDefs, config } from '@bookstore/shared';
import { resolvers } from './graphql/resolvers.js';
import { prisma } from './lib/prisma.js';
import { getUserFromToken } from './lib/auth.js';
import type { Context } from '@bookstore/shared';

const app = express();

const server = new ApolloServer<Context>({
  typeDefs,
  resolvers,
});

await server.start();

app.use(cors());
app.use(express.json());

app.get('/health', (_, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(
  config.api.graphqlPath,
  expressMiddleware(server, {
    context: async ({ req }) => {
      const token = req.headers.authorization?.replace('Bearer ', '');
      const user = token ? await getUserFromToken(token) : null;
      return { user, prisma };
    },
  })
);

app.listen(config.api.port, () => {
  console.log(`🚀 Server ready at http://localhost:${config.api.port}${config.api.graphqlPath}`);
});
