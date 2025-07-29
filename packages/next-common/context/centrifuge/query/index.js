import { ApolloClient, InMemoryCache } from "@apollo/client";

const apolloClient = new ApolloClient({
  ssrMode: true,
  uri: "https://dash-api.odes.io/graphql",
  cache: new InMemoryCache(),
});

export default apolloClient;
