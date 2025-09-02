import { gql, ApolloClient, InMemoryCache } from "@apollo/client";

const PREIMAGE_QUERY = gql`
  query MyQuery {
    preimages {
      hash
      hex
      requested {
        count
        len
        maybeLen
        deposit {
          amount
          who
        }
        maybeTicket {
          amount
          who
        }
      }
      unrequested {
        len
        deposit {
          amount
          who
        }
        ticket {
          who
          amount
        }
      }
    }
  }
`;

const apolloClient = new ApolloClient({
  ssrMode: true,
  uri: process.env.NEXT_PUBLIC_INTIME_API,
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
