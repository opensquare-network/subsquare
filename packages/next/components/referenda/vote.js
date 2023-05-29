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
  isLoadingVotesSelector,
  votesSelector,
} from "next-common/store/reducers/referendumSlice";
import SubLink from "next-common/components/styled/subLink";
import VoteBar from "./voteBar";
import TallyInfo from "next-common/components/referenda/tally/info";
import { emptyFunction } from "next-common/utils";
import MyVote from "./myVote";
import SecondaryButton from "next-common/components/buttons/secondaryButton";
import {
  flex,
  gap_x,
  items_center,
  justify_between,
  text_primary,
} from "next-common/styles/tailwindcss";
import { p_12_medium } from "next-common/styles/componentCss";
import CallsVotesPopup from "next-common/components/democracy/callsVotesPopup";
import NestedVotesPopup from "next-common/components/democracy/nestedVotesPopup";

import useDemocracyTally from "next-common/context/post/democracy/referendum/tally";
import useIsDemocracyPassing from "next-common/context/post/democracy/referendum/passing";
import useIsDemocracyVoteFinished from "next-common/context/post/democracy/referendum/isVoteFinished";
import useDemocracyThreshold from "next-common/context/post/democracy/referendum/threshold";
import useIsDemocracyPassed from "next-common/context/post/democracy/referendum/result";

const VotePopup = dynamic(() => import("components/referenda/popup"), {
  ssr: false,
});

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
  ${text_primary};
`;
const VotesGroupItems = styled.div`
  ${flex};
  ${items_center};
  ${gap_x(12)};
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: absolute;
  right: 0;
  top: 40px;
  width: 300px;
  margin-top: 0 !important;
  @media screen and (max-width: 1024px) {
    position: static;
    width: auto;
    margin-top: 16px !important;
  }
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
  color: ${(props) => props.theme.secondaryGreen500};
  background: ${(props) => props.theme.secondaryGreen100};
`;

const RejectStatus = styled(Status)`
  color: ${(props) => props.theme.secondaryRed500};
  background: ${(props) => props.theme.secondaryRed100};
`;

function Vote({ referendumIndex, onFinalized = emptyFunction }) {
  const dispatch = useDispatch();
  const [showVote, setShowVote] = useState(false);
  const [showFlattenedVotesList, setShowFlattenedVotesList] = useState(false);
  const [showNestedVotesList, setShowNestedVotesList] = useState(false);
  const [showCallsVotesList, setShowCallsVotesList] = useState(false);
  const api = useApi();
  const tally = useDemocracyTally();
  const isPassing = useIsDemocracyPassing();
  const threshold = useDemocracyThreshold();
  const isPassed = useIsDemocracyPassed();

  const isElectorateLoading = useSelector(isLoadingElectorateSelector);
  const electorate = useSelector(electorateSelector);
  const isLoadingVotes = useSelector(isLoadingVotesSelector);
  const { allAye = [], allNay = [] } = useSelector(votesSelector);
  const isLoadingReferendumStatus = useSelector(
    isLoadingReferendumStatusSelector,
  );
  const isVoteFinished = useIsDemocracyVoteFinished();

  const [updateTime, setUpdateTime] = useState(0);

  const updateVoteProgress = useCallback(() => {
    dispatch(fetchReferendumStatus(api, referendumIndex));
    setUpdateTime(Date.now());
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
    <Wrapper>
      <SecondaryCardDetail>
        <Title>
          <span>Votes</span>
          <div>
            {isLoadingReferendumStatus || isElectorateLoading ? (
              <Loading size={16} />
            ) : null}
          </div>
        </Title>

        <VoteBar
          tally={tally}
          electorate={electorate}
          threshold={threshold}
        />

        <TallyInfo
          isLoadingVotes={isLoadingVotes}
          allAye={allAye}
          allNay={allNay}
        />

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
            <SubLink onClick={() => setShowFlattenedVotesList(true)}>
              Flattened
            </SubLink>
            <SubLink onClick={() => setShowNestedVotesList(true)}>
              Nested
            </SubLink>
            {/* TODO: #2866, democracy calls */}
            {/* <SubLink onClick={() => setShowCallsVotesList(true)}>Calls</SubLink> */}
          </VotesGroupItems>
        </VotesGroup>

        <MyVote updateTime={updateTime} />
      </SecondaryCardDetail>

      {!isVoteFinished && (
        <SecondaryButton
          onClick={() => {
            setShowVote(true);
          }}
        >
          Vote
        </SecondaryButton>
      )}
      {showVote && (
        <VotePopup
          onClose={() => setShowVote(false)}
          referendumIndex={referendumIndex}
          onInBlock={updateVoteProgress}
          onFinalized={onFinalized}
        />
      )}
      {showFlattenedVotesList && (
        <FlattenedVotesPopup
          setShowVoteList={setShowFlattenedVotesList}
          allAye={allAye}
          allNay={allNay}
          isLoadingVotes={isLoadingVotes}
        />
      )}
      {showNestedVotesList && (
        <NestedVotesPopup
          setShowVoteList={setShowNestedVotesList}
          allAye={allAye}
          allNay={allNay}
          isLoadingVotes={isLoadingVotes}
        />
      )}

      {/* TODO: #2866, democracy calls */}
      {false && showCallsVotesList && (
        <CallsVotesPopup
          setShowVoteList={setShowCallsVotesList}
          allAye={allAye}
          allNay={allNay}
          isLoadingVotes={isLoadingVotes}
        />
      )}
    </Wrapper>
  );
}

export default memo(Vote);
