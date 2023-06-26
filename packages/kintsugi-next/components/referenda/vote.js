import React, { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import BigNumber from "bignumber.js";
import styled from "styled-components";
import { emptyFunction, toPrecision } from "next-common/utils";
import Flex from "next-common/components/styled/flex";
import {
  calcPassing,
  getThresholdOfSimplyMajority,
  getThresholdOfSuperMajorityAgainst,
  getThresholdOfSuperMajorityApprove,
} from "utils/referendumUtil";
import useApi from "next-common/utils/hooks/useApi";
import Threshold from "./threshold";
import Loading from "next-common/components/loading";
import ExternalLink from "next-common/assets/imgs/icons/external-link.svg";
import SecondaryButton from "next-common/components/buttons/secondaryButton";
import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { useDispatch, useSelector } from "react-redux";
import {
  electorateSelector,
  fetchReferendumStatus,
  isLoadingElectorateSelector,
  isLoadingReferendumStatusSelector,
  isLoadingVotesSelector,
  referendumStatusSelector,
  setIsLoadingReferendumStatus,
  votesSelector,
} from "next-common/store/reducers/referendumSlice";
import SubLink from "next-common/components/styled/subLink";
import { useChain, useChainSettings } from "next-common/context/chain";
import MyVote from "./myVote";
import TallyInfo from "next-common/components/referenda/tally/info";
import CheckAllVotesPopup from "components/democracy/allVotesPopup";
import useSubDemocracyTally from "next-common/hooks/democracy/tally";
import capitalize from "lodash.capitalize";

const Popup = dynamic(() => import("./popup"), {
  ssr: false,
});

const Wrapper = styled.div`
  position: absolute;
  right: 0;
  top: 40px;
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

const Headers = styled(Flex)`
  justify-content: space-between;
  font-size: 12px;
  color: ${(props) => props.theme.textSecondary};

  span:nth-child(2) {
    text-align: center;
    white-space: nowrap;
  }

  span:nth-child(3) {
    text-align: right;
  }
`;

const Contents = styled(Headers)`
  font-weight: 500;
  color: ${(props) => props.theme.textPrimary};
  margin-top: 8px !important;
  margin-bottom: 16px;
`;

const Status = styled.div`
  width: 100%;
  line-height: 38px;
  border-width: 0;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 700;
  cursor: default;
  text-align: center;
  margin-top: 8px;
`;

const PassStatus = styled(Status)`
  color: ${(props) => props.theme.secondaryGreen500};
  background: ${(props) => props.theme.secondaryGreen100};
`;

const RejectStatus = styled(Status)`
  color: ${(props) => props.theme.secondaryRed500};
  background: ${(props) => props.theme.secondaryRed100};
`;

const BarWrapper = styled.div`
  position: relative;
`;

const BarContainer = styled.div`
  margin-bottom: 1rem;
  display: flex;
  gap: ${(p) => p.gap}px;
  height: 8px;
  width: 100%;
  border-radius: 4px;
  overflow: hidden;
`;

const AyesBar = styled.div`
  background-color: ${(props) => props.theme.secondaryGreen500};
  width: ${(p) => p.precent}%;
  height: 100%;
`;

const NaysBar = styled.div`
  background-color: ${(props) => props.theme.secondaryRed500};
  width: ${(p) => p.precent}%;
  height: 100%;
`;

const Guide = styled.p`
  font-size: 12px;
  white-space: nowrap;
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.textTertiary};
  a {
    margin-left: 2px;
    svg {
      margin-left: 2px;
    }
    font-size: 12px !important;
    display: flex;
    align-items: center;
    color: ${(props) => props.theme.primaryPurple500} !important;
  }
`;

function Vote({
  referendumInfo,
  referendumIndex,
  onFinalized = emptyFunction,
}) {
  const chain = useChain();
  const dispatch = useDispatch();
  const [showVote, setShowVote] = useState(false);
  const [showVoteList, setShowVoteList] = useState(false);
  const api = useApi();
  const tally = useSubDemocracyTally();

  const electorate = useSelector(electorateSelector);
  const isElectorateLoading = useSelector(isLoadingElectorateSelector);
  const isLoadingVotes = useSelector(isLoadingVotesSelector);
  const { allAye = [], allNay = [] } = useSelector(votesSelector);
  const referendumStatus = useSelector(referendumStatusSelector);
  const isLoadingReferendumStatus = useSelector(
    isLoadingReferendumStatusSelector
  );

  const updateVoteProgress = useCallback(() => {
    dispatch(fetchReferendumStatus(api, referendumIndex));
  }, [dispatch, api, referendumIndex]);

  const node = useChainSettings(chain);
  const decimals = node.decimals;

  const isPassing = calcPassing(referendumStatus, electorate);

  const nAyes = toPrecision(tally?.ayes ?? 0, decimals);
  const nNays = toPrecision(tally?.nays ?? 0, decimals);

  let nAyesPercent = 50;
  let nNaysPercent = 50;
  let gap = 2;
  const nTotal = new BigNumber(nAyes).plus(nNays);
  if (nTotal.gt(0)) {
    nAyesPercent = Math.round(new BigNumber(nAyes).div(nTotal).toNumber() * 100);
    nNaysPercent = 100 - nAyesPercent;
    if (nAyesPercent === 100 || nNaysPercent === 100) {
      gap = 0;
    }
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

        <BarWrapper>
          <BarContainer gap={gap}>
            <AyesBar precent={nAyesPercent} />
            <NaysBar precent={nNaysPercent} />

            {(referendumStatus?.threshold || "").toLowerCase() ===
              "simplemajority" && (
              <Threshold threshold={getThresholdOfSimplyMajority()} />
            )}

            {(referendumStatus?.threshold || "").toLowerCase() ===
              "supermajorityapprove" && (
              <Threshold
                threshold={getThresholdOfSuperMajorityApprove(
                  tally?.turnout ?? 0,
                  electorate
                )}
              />
            )}

            {(referendumStatus?.threshold || "").toLowerCase() ===
              "supermajorityagainst" && (
              <Threshold
                threshold={getThresholdOfSuperMajorityAgainst(
                  tally?.turnout ?? 0,
                  electorate
                )}
              />
            )}
          </BarContainer>
        </BarWrapper>

        <Headers>
          <span>Aye</span>
          <span>Passing threshold</span>
          <span>Nay</span>
        </Headers>

        <Contents>
          <span style={{ width: 40 }}>{nAyesPercent}%</span>
          <span>{referendumStatus?.threshold}</span>
          <span style={{ width: 40 }}>{nNaysPercent}%</span>
        </Contents>

        <TallyInfo
          tally={tally}
          isLoadingVotes={isLoadingVotes}
          allAye={allAye}
          allNay={allNay}
        />

        {referendumInfo?.finished?.approved && <PassStatus>Passed</PassStatus>}
        {referendumInfo?.finished?.approved === false && (
          <RejectStatus>Failed</RejectStatus>
        )}
        {referendumInfo &&
          !referendumInfo.finished &&
          (isPassing ? (
            <PassStatus>Passing</PassStatus>
          ) : (
            <RejectStatus>Failing</RejectStatus>
          ))}

        <SubLink
          style={{ marginTop: 16 }}
          onClick={() => setShowVoteList(true)}
        >
          Check all votes
        </SubLink>
        <MyVote />
      </SecondaryCardDetail>

      {!referendumInfo?.finished && (
        <SecondaryButton
          isFill
          onClick={() => {
            setShowVote(true);
          }}
        >
          Vote
        </SecondaryButton>
      )}

      <Guide>
        How {capitalize(chain)} Governance Works.
        <a
          href={`https://docs.interlay.io/#/${chain}/governance`}
          target="_blank"
          rel="noreferrer"
        >
          <ExternalLink />
        </a>
      </Guide>

      {showVote && (
        <Popup
          onClose={() => setShowVote(false)}
          referendumIndex={referendumIndex}
          onSubmitted={() => dispatch(setIsLoadingReferendumStatus(true))}
          onInBlock={updateVoteProgress}
          onFinalized={onFinalized}
        />
      )}

      {showVoteList && (
        <CheckAllVotesPopup
          setShowVoteList={setShowVoteList}
          allAye={allAye}
          allNay={allNay}
          isLoadingVotes={isLoadingVotes}
        />
      )}
    </Wrapper>
  );
}

export default Vote;
