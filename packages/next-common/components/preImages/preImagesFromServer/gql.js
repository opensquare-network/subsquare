import { gql, ApolloClient, InMemoryCache } from "@apollo/client";
import { CHAIN } from "next-common/utils/constants";
import getChainSettings from "next-common/utils/consts/settings";
import { hasPreimagesGraphQL } from "next-common/utils/env/preimage";

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
          amount
          who
        }
      }
    }
  }
`;

const { subsquareGraphql } = getChainSettings(CHAIN);

let preimageClient = null;

if (hasPreimagesGraphQL()) {
  preimageClient = new ApolloClient({
    ssrMode: true,
    uri: `https://${subsquareGraphql.domain}.subsquare.io/graphql`,
    cache: new InMemoryCache(),
  });
}

export async function queryPreimages() {
  if (!preimageClient) {
    throw new Error("Intime module is not supported");
  }

  try {
    const { data } = await preimageClient.query({
      query: PREIMAGE_QUERY,
      fetchPolicy: "no-cache",
    });

    return data?.preimages;
  } catch {
    return null;
  }
}
