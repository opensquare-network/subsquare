import { ApolloClient, InMemoryCache } from "@apollo/client";

const dashApiUrl =
  process.env.NEXT_PUBLIC_CENTRIFUGE_DASH_API ||
  "https://dash-api.odes.io/graphql";

if (!dashApiUrl) {
  console.error("NEXT_PUBLIC_CENTRIFUGE_DASH_API is not set in .env file.");
  process.exit(1);
}

const apolloClient = new ApolloClient({
  ssrMode: true,
  uri: dashApiUrl,
  cache: new InMemoryCache(),
});

export default apolloClient;
