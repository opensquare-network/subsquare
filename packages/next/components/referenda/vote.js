import { memo, useCallback, useState } from "react";
import dynamic from "next/dynamic";
import styled from "styled-components";
import useApi from "next-common/utils/hooks/useApi";
import Loading from "next-common/components/loading";
import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { useDispatch, useSelector } from "react-redux";
import {
  electorateSelector,
  fetchReferendumStatus,
  isLoadingElectorateSelector,
  isLoadingReferendumStatusSelector,
} from "next-common/store/reducers/referendumSlice";
import SubLink from "next-common/components/styled/subLink";
import VoteBar from "next-common/components/referenda/voteBar";
import TallyInfo from "next-common/components/referenda/tally/info";
import MyVote from "./myVote";
import PrimaryButton from "next-common/components/buttons/primaryButton";
import {
  flex,
  gap_x,
  items_center,
  justify_between,
} from "next-common/styles/tailwindcss";
import { p_12_medium } from "next-common/styles/componentCss";
import NestedVotesPopup from "next-common/components/democracy/nestedVotesPopup";
import useIsDemocracyPassing from "next-common/context/post/democracy/referendum/passing";
import useIsDemocracyVoteFinished from "next-common/context/post/democracy/referendum/isVoteFinished";
import useDemocracyThreshold from "next-common/context/post/democracy/referendum/threshold";
import useIsDemocracyPassed from "next-common/context/post/democracy/referendum/result";
import useSubDemocracyTally from "next-common/hooks/democracy/tally";
import { useChainSettings } from "next-common/context/chain";
import Calls from "./voteCalls";
import isMoonChain from "next-common/utils/isMoonChain";
import { RightBarWrapper } from "next-common/components/layout/sidebar/rightBarWrapper";
import WithAddress from "next-common/components/common/withAddress";

const VotePopup = dynamic(() => import("components/referenda/popup"), {
  ssr: false,
});

const MoonVotePopup = dynamic(
  () => import("components/referenda/popup/moonPopup"),
  {
    ssr: false,
  },
);

const FlattenedVotesPopup = dynamic(
  () => import("next-common/components/democracy/flattenedVotesPopup"),
  {
    ssr: false,
  },
);

const VotesGroup = styled.div`
  ${flex};
  ${items_center};
  ${justify_between};
  margin-top: 16px;
`;
const VotesGroupLabel = styled.div`
  ${p_12_medium};
  color: var(--textPrimary);
`;
const VotesGroupItems = styled.div`
  ${flex};
  ${items_center};
  ${gap_x(12)};
`;

const Title = styled(TitleContainer)`
  margin-bottom: 16px;
`;

const Status = styled.div`
  margin-top: 8px !important;
  width: 100%;
  line-height: 38px;
  border-width: 0;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 700;
  cursor: default;
  text-align: center;
`;

const PassStatus = styled(Status)`
  color: var(--green500);
  background: var(--green100);
`;

const RejectStatus = styled(Status)`
  color: var(--red500);
  background: var(--red100);
`;

function Vote({ referendumIndex }) {
  const dispatch = useDispatch();
  const [showVote, setShowVote] = useState(false);
  const [showFlattenedVotesList, setShowFlattenedVotesList] = useState(false);
  const [showNestedVotesList, setShowNestedVotesList] = useState(false);
  const api = useApi();
  const tally = useSubDemocracyTally();
  const isPassing = useIsDemocracyPassing(tally);
  const threshold = useDemocracyThreshold();
  const isPassed = useIsDemocracyPassed();
  const { useVoteCall, hideActionButtons } = useChainSettings();

  const isElectorateLoading = useSelector(isLoadingElectorateSelector);
  const electorate = useSelector(electorateSelector);

  const isLoadingReferendumStatus = useSelector(
    isLoadingReferendumStatusSelector,
  );
  const isVoteFinished = useIsDemocracyVoteFinished();

  let Popup = VotePopup;
  if (isMoonChain()) {
    Popup = MoonVotePopup;
  }

  const updateVoteProgress = useCallback(() => {
    dispatch(fetchReferendumStatus(api, referendumIndex));
  }, [dispatch, api, referendumIndex]);

  let finishedResult;
  if (isVoteFinished) {
    finishedResult = isPassed ? (
      <PassStatus>Passed</PassStatus>
    ) : (
      <RejectStatus>Failed</RejectStatus>
    );
  }

  return (
    <RightBarWrapper>
      <SecondaryCardDetail>
        <Title className="!px-0">
          <span>Votes</span>
          <div>
            {isLoadingReferendumStatus || isElectorateLoading ? (
              <Loading size={16} />
            ) : null}
          </div>
        </Title>

        <VoteBar tally={tally} electorate={electorate} threshold={threshold} />
        <TallyInfo tally={tally} />

        {finishedResult}
        {!isVoteFinished &&
          (isPassing ? (
            <PassStatus>Passing</PassStatus>
          ) : (
            <RejectStatus>Failing</RejectStatus>
          ))}

        <VotesGroup>
          <VotesGroupLabel>Votes</VotesGroupLabel>
          <VotesGroupItems>
            <SubLink onClick={() => setShowNestedVotesList(true)}>
              Nested
            </SubLink>
            <SubLink onClick={() => setShowFlattenedVotesList(true)}>
              Flattened
            </SubLink>
            {useVoteCall && <Calls />}
          </VotesGroupItems>
        </VotesGroup>
      </SecondaryCardDetail>

      <WithAddress>
        <MyVote />
      </WithAddress>

      {!isVoteFinished && !hideActionButtons && (
        <PrimaryButton
          onClick={() => {
            setShowVote(true);
          }}
        >
          Vote
        </PrimaryButton>
      )}

      {showVote && (
        <Popup
          onClose={() => setShowVote(false)}
          referendumIndex={referendumIndex}
          onInBlock={updateVoteProgress}
        />
      )}
      {showFlattenedVotesList && (
        <FlattenedVotesPopup setShowVoteList={setShowFlattenedVotesList} />
      )}
      {showNestedVotesList && (
        <NestedVotesPopup setShowVoteList={setShowNestedVotesList} />
      )}
    </RightBarWrapper>
  );
}

export default memo(Vote);
