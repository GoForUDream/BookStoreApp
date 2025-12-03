export const config = {
  api: {
    port: 4000,
    graphqlPath: '/graphql',
  },
  frontend: {
    port: 3000,
  },
  jwt: {
    expiresIn: '7d',
  },
  pagination: {
    defaultLimit: 12,
    maxLimit: 50,
  },
  shipping: {
    freeThreshold: 50,
    cost: 5.99,
  },
  tax: {
    rate: 0.1, // 10%
  },
} as const;

export const getApiUrl = () => {
  return `http://localhost:${config.api.port}${config.api.graphqlPath}`;
};
