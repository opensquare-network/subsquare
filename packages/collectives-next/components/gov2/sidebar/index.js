import { gov2VotingState } from "next-common/utils/consts/state";
import { useState } from "react";
import Gov2Status from "./status";
import Gov2Tally from "./tally";
import { RightBarWrapper } from "next-common/components/layout/sidebar/rightBarWrapper";
import { usePost } from "next-common/context/post";
import PrimaryButton from "next-common/lib/button/primary";
import { InlineWrapper } from "next-common/components/detail/sidebar/styled";
import { useChainSettings } from "next-common/context/chain";
import MyVote from "./tally/myVote";
import HowOpenGovWorks from "next-common/components/howOpenGovWorks";
import WithAddress from "next-common/components/common/withAddress";
import { VoteSuccessfulProvider } from "next-common/components/vote";
import VoteSuccessfulPopup from "../votePopup/voteSuccessful";
import Request from "./request";
import dynamicPopup from "next-common/lib/dynamic/popup";
import AllSpendsRequest from "./request/allSpendsRequest";

const VotePopup = dynamicPopup(() => import("../votePopup"));

export default function Gov2Sidebar() {
  const detail = usePost();
  const [showVote, setShowVote] = useState(false);
  const referendumIndex = detail?.referendumIndex;
  const trackId = detail?.track;
  const isVoting = gov2VotingState.includes(detail?.state?.name);
  const { hideActionButtons } = useChainSettings();

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
        <InlineWrapper>
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
        <HowOpenGovWorks anchor="referenda" />
      </InlineWrapper>
    </RightBarWrapper>
  );
}
