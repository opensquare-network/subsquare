import { useChain } from "next-common/context/chain";
import useProfileAddress from "../useProfileAddress";
import { useEffect } from "react";
import IdentityTimeline from "next-common/components/identityTimeline";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { useDispatch } from "react-redux";
import {
  profileIdentityTimelineSelector,
  setProfileIdentityTimeline,
} from "next-common/store/reducers/profile/identityTimeline";
import { useSelector } from "react-redux";
import useIsMounted from "next-common/utils/hooks/useIsMounted";

function useIdentityTimeline() {
  const dispatch = useDispatch();
  const address = useProfileAddress();
  const chain = useChain();
  const timeline = useSelector(profileIdentityTimelineSelector);
  const isMounted = useIsMounted();

  useEffect(() => {
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
        if (isMounted.current) {
          dispatch(setProfileIdentityTimeline(result.data?.identityTimeline));
        }
      })
      .catch((error) => console.error(error));
  }, [address, chain, isMounted]);

  return timeline;
}

export default function ProfileIdentityTimeline() {
  const timeline = useIdentityTimeline();

  return (
    <SecondaryCard>
      <IdentityTimeline timelineData={timeline} />
    </SecondaryCard>
  );
}
