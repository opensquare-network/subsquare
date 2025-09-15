import { useCallback } from "react";
import { gql, ApolloClient, InMemoryCache } from "@apollo/client";
import { CHAIN } from "next-common/utils/constants";
import getChainSettings from "next-common/utils/consts/settings";
import { hasReferendaVotesGraphQL } from "next-common/utils/env/referendaVotes";
import { transformVotesData } from "next-common/hooks/useReferendaVotesBackend";

const REFERENDA_VOTES_QUERY = gql`
  query ReferendaVotesQuery($referendumIndex: Int!) {
    referendaVotes(referendumIndex: $referendumIndex) {
      abstainBalance
      abstainVotes
      account
      aye
      ayeBalance
      ayeVotes
      balance
      conviction
      delegations {
        capital
        votes
      }
      isDelegating
      isSplit
      isSplitAbstain
      isStandard
      nayBalance
      nayVotes
      referendumIndex
      votes
      target
    }
  }
`;

function getReferendaVotesClient() {
  const { subsquareGraphql } = getChainSettings(CHAIN);
  if (!hasReferendaVotesGraphQL()) {
    return null;
  }

  return new ApolloClient({
    ssrMode: true,
    uri: `https://${subsquareGraphql.domain}.subsquare.io/graphql`,
    cache: new InMemoryCache(),
  });
}

export async function queryReferendaVotes(referendumIndex) {
  const client = getReferendaVotesClient();
  if (!client) {
    throw new Error("Referenda votes GraphQL is not supported");
  }

  try {
    const { data } = await client.query({
      query: REFERENDA_VOTES_QUERY,
      variables: { referendumIndex },
      fetchPolicy: "no-cache",
    });

    return data?.referendaVotes || [];
  } catch (e) {
    console.error("Error fetching referenda votes from GraphQL:", e);
    throw new Error("Error fetching referenda votes from GraphQL");
  }
}

export default function useReferendaVotesGraphQL(referendumIndex) {
  const fetchVotes = useCallback(async () => {
    try {
      const rawVotes = await queryReferendaVotes(referendumIndex);

      return transformVotesData(rawVotes);
    } catch (err) {
      console.error(
        "Error fetching votes for referendum:",
        referendumIndex,
        err,
      );
      throw new Error("Error fetching votes for referendum");
    }
  }, [referendumIndex]);

  return {
    fetchVotes,
  };
}
