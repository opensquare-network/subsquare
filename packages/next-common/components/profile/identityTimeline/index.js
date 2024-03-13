import { useChain } from "next-common/context/chain";
import useProfileAddress from "../useProfileAddress";
import { useEffect, useState } from "react";
import IdentityTimeline from "next-common/components/identityTimeline";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";

function useIdentityTimeline() {
  const address = useProfileAddress();
  const chain = useChain();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch(`https://${chain}-identity-api.statescan.io/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        operationName: "GetIdentityTimeline",
        variables: {
          account: address,
        },
        query: `query GetIdentityTimeline($account: String!) {
          identityTimeline(account: $account) {
            name
            args
              indexer {
                blockHeight
                  blockHash
                  blockTime
                  extrinsicIndex
                  eventIndex
                  __typename
              }
            __typename
          }
        }`,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((result) => {
        setData(result.data.identityTimeline);
      })
      .catch((error) => console.error(error))
      .finally(() => setIsLoading(false));
  }, [address, chain]);

  return {
    isLoading,
    data,
  };
}

export default function ProfileIdentityTimeline() {
  const { isLoading, data } = useIdentityTimeline();

  return (
    <SecondaryCard>
      <IdentityTimeline timelineData={data} isLoading={isLoading} />
    </SecondaryCard>
  );
}
