import { gql, ApolloClient, InMemoryCache } from "@apollo/client";
import { CHAIN } from "next-common/utils/constants";
import getChainSettings from "next-common/utils/consts/settings";

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

const { subsquareGraphql } = getChainSettings(CHAIN);

let intimeClient = null;

if (subsquareGraphql && subsquareGraphql.intime) {
  intimeClient = new ApolloClient({
    ssrMode: true,
    uri: `https://${subsquareGraphql.domain}.subsquare.io/graphql`,
    cache: new InMemoryCache(),
  });
}

export async function queryPreimages() {
  if (!intimeClient) {
    throw new Error("Intime module is not supported");
  }

  try {
    const { data } = await intimeClient.query({
      query: PREIMAGE_QUERY,
      fetchPolicy: "no-cache",
    });

    return data?.intimePreimages;
  } catch (e) {
    return null;
  }
}
