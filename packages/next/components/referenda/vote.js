import { memo, useCallback, useState } from "react";
import dynamic from "next/dynamic";
import styled from "styled-components";
import { calcPassing } from "utils/referendumUtil";
import useApi from "next-common/utils/hooks/useSelectedEnpointApi";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import Loading from "next-common/components/loading";
import Chains from "next-common/utils/consts/chains";
import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { useSelector } from "react-redux";
import { latestHeightSelector } from "next-common/store/reducers/chainSlice";
import {
  electorateSelector,
  isLoadingElectorateSelector,
  isLoadingVotesSelector,
  votesSelector,
} from "next-common/store/reducers/referendumSlice";
import SubLink from "next-common/components/styled/subLink";
import VoteBar from "./voteBar";
import TallyInfo from "./tallyInfo";

const Popup = dynamic(() => import("components/referenda/popup"), {
  ssr: false,
});

const VotesPopup = dynamic(
  () => import("next-common/components/democracy/votesPopup"),
  {
    ssr: false,
  }
);

const Wrapper = styled.div`
  position: absolute;
  right: 0;
  top: 32px;
  width: 300px;
  margin-top: 0 !important;
  > :not(:first-child) {
    margin-top: 16px;
  }
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

const VoteButton = styled.button`
  all: unset;
  cursor: pointer;
  margin-top: 16px;
  width: 100%;
  line-height: 38px;
  background-color: ${(props) => props.theme.primaryDarkBlue};
  color: ${(props) => props.theme.textContrast};
  font-weight: 500;
  font-size: 14px;
  text-align: center;
  border-radius: 4px;
`;

function Vote({
  referendumInfo,
  referendumStatus,
  setReferendumStatus,
  isLoadingReferendumStatus,
  setIsLoadingReferendumStatus,
  referendumIndex,
  chain,
}) {
  const [showVote, setShowVote] = useState(false);
  const [showVoteList, setShowVoteList] = useState(false);
  const isMounted = useIsMounted();
  const api = useApi(chain);
  const blockHeight = useSelector(latestHeightSelector);

  const electorate = useSelector(electorateSelector);
  const isElectorateLoading = useSelector(isLoadingElectorateSelector);
  const isLoadingVotes = useSelector(isLoadingVotesSelector);
  const { allAye = [], allNay = [] } = useSelector(votesSelector);

  const updateVoteProgress = useCallback(() => {
    api?.query.democracy
      .referendumInfoOf(referendumIndex)
      .then((referendumInfo) => {
        const data = referendumInfo.toJSON();
        if (data?.ongoing && isMounted.current) {
          setReferendumStatus(data?.ongoing);
        }
      })
      .finally(() => {
        setIsLoadingReferendumStatus(false);
      });
  }, [
    api,
    referendumIndex,
    setReferendumStatus,
    setIsLoadingReferendumStatus,
    isMounted,
  ]);

  const isPassing = calcPassing(referendumStatus, electorate);

  const isKsm = Chains.kusama === chain;
  const finished =
    referendumInfo?.finished ||
    (isKsm && referendumIndex < 198) ||
    blockHeight > referendumStatus?.end;

  let finishedResult;
  if (referendumInfo?.finished) {
    finishedResult = referendumInfo?.finished?.approved ? (
      <PassStatus>Passed</PassStatus>
    ) : (
      <RejectStatus>Failed</RejectStatus>
    );
  } else if (isKsm && referendumIndex < 5) {
    finishedResult = <PassStatus>Passed</PassStatus>;
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
          tally={referendumStatus?.tally}
          electorate={electorate}
          threshold={referendumStatus?.threshold}
        />

        <TallyInfo
          tally={referendumStatus?.tally}
          electorate={electorate}
          isLoadingVotes={isLoadingVotes}
          allAye={allAye}
          allNay={allNay}
          chain={chain}
        />

        {finishedResult}
        <SubLink onClick={() => setShowVoteList(true)}>Check all votes</SubLink>
        {referendumInfo &&
          !finished &&
          (isPassing ? (
            <PassStatus>Passing</PassStatus>
          ) : (
            <RejectStatus>Failing</RejectStatus>
          ))}
      </SecondaryCardDetail>

      {!finished && (
        <VoteButton
          onClick={() => {
            setShowVote(true);
          }}
        >
          Vote
        </VoteButton>
      )}
      {showVote && (
        <Popup
          chain={chain}
          onClose={() => setShowVote(false)}
          referendumIndex={referendumIndex}
          onSubmitted={() => setIsLoadingReferendumStatus(true)}
          onInBlock={updateVoteProgress}
        />
      )}
      {showVoteList && (
        <VotesPopup setShowVoteList={setShowVoteList} chain={chain} />
      )}
    </Wrapper>
  );
}

export default memo(Vote);
