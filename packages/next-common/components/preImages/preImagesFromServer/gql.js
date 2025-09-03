import { gql, ApolloClient, InMemoryCache } from "@apollo/client";

const PREIMAGE_QUERY = gql`
  query MyQuery {
    intimePreimages {
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
          amount
          who
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

    return data?.intimePreimages;
  } catch (e) {
    return null;
  }
}
