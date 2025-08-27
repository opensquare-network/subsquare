import { gql, ApolloClient, InMemoryCache } from "@apollo/client";

const PREIMAGE_QUERY = gql`
  query MyQuery {
    preimages {
      hash
      hex
      requested {
        count
        maybeLen
        maybeTicket {
          amount
          who
        }
      }
      unrequested {
        len
        ticket {
          amount
          who
        }
      }
    }
  }
`;

const apolloClient = new ApolloClient({
  ssrMode: true,
  uri: process.env.NEXT_PUBLIC_GOV_TRACKER_API,
  cache: new InMemoryCache(),
});

export async function queryPreimages() {
  try {
    const { data } = await apolloClient.query({
      query: PREIMAGE_QUERY,
      fetchPolicy: "no-cache",
    });

    return data?.preimages;
  } catch (e) {
    return null;
  }
}
