// import { ApolloClient, InMemoryCache, createHttpLink } from'@apollo/client';

// const httpLink = createHttpLink({
//     uri: 'http://localhost:8080/v1/graphql',
//     headers: {
//         'x-hasura-admin-secret': 'f42586e3e1d7e7d24757b580281552310d03fd4240f17c12a331d021d6a3794e',
//         'x-hasura-role': 'user',
//         'x-hasura-user-id': '00000000-0000-0000-0000-000000000000'
//     }
// });

// export const client = new ApolloClient({
//     link: httpLink,
//     cache: new InMemoryCache()
// });

import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'http://localhost:8080/v1/graphql',
    headers: {
      'x-hasura-admin-secret': 'myhasurasecret',
    },
  }),
  cache: new InMemoryCache(),
});

export default client;
