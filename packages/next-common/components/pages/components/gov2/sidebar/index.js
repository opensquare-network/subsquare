import { gov2VotingState } from "next-common/utils/consts/state";
import { useEffect, useState } from "react";
import Gov2Status from "./status";
import Gov2Tally from "./tally";
import { RightBarWrapper } from "next-common/components/layout/sidebar/rightBarWrapper";
import { usePost } from "next-common/context/post";
import PrimaryButton from "next-common/lib/button/primary";
import { InlineWrapper } from "next-common/components/detail/sidebar/styled";
import { useChainSettings } from "next-common/context/chain";
import MyVote from "./tally/myVote";
import DelegationGuide from "next-common/components/delegationGuide";
import WithAddress from "next-common/components/common/withAddress";
import { VoteSuccessfulProvider } from "next-common/components/vote";
import VoteSuccessfulPopup from "../votePopup/voteSuccessful";
import Request from "./request";
import dynamicPopup from "next-common/lib/dynamic/popup";
import AllSpendsRequest from "./request/allSpendsRequest";
import { useFetchVotesFromServer } from "next-common/utils/gov2/useVotesFromServer";
import useIsScrolling from "next-common/hooks/useIsScrolling";
import { useIsMobile } from "next-common/components/overview/accountInfo/components/accountBalances";

const VotePopup = dynamicPopup(() => import("../votePopup"));

export default function Gov2Sidebar() {
  const isScrolling = useIsScrolling(100, 1000);
  const isMobile = useIsMobile();
  const detail = usePost();
  const [showVote, setShowVote] = useState(false);
  const referendumIndex = detail?.referendumIndex;
  const trackId = detail?.track;
  const isVoting = gov2VotingState.includes(detail?.state?.name);
  const { hideActionButtons } = useChainSettings();
  const { fetch: fetchVotesFromServer } =
    useFetchVotesFromServer(referendumIndex);

  useEffect(() => {
    fetchVotesFromServer();
  }, [fetchVotesFromServer]);

  return (
    <RightBarWrapper>
      <Request />
      <AllSpendsRequest />
      <Gov2Status />
      <Gov2Tally />
      <WithAddress>
        <MyVote />
      </WithAddress>

      {isVoting && !hideActionButtons && (
        <InlineWrapper
          className={`${
            isMobile ? (isScrolling ? "translate-y-full" : "") : ""
          } transition-transform fixed bottom-0 left-0 right-0 p-6 z-[1] border-t border-neutral300 bg-neutral100 shadow-shadow200 rounded-t-xl sm:relative sm:p-0 sm:translate-y-0`}
        >
          <PrimaryButton
            style={{ width: "100%" }}
            onClick={() => {
              setShowVote(true);
            }}
          >
            Vote
          </PrimaryButton>
        </InlineWrapper>
      )}
      <VoteSuccessfulProvider VoteSuccessfulPopup={VoteSuccessfulPopup}>
        {showVote && (
          <VotePopup
            onClose={() => setShowVote(false)}
            referendumIndex={referendumIndex}
            trackId={trackId}
          />
        )}
      </VoteSuccessfulProvider>

      <InlineWrapper>
        <DelegationGuide anchor="referenda" />
      </InlineWrapper>
    </RightBarWrapper>
  );
}
