import React, { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import BigNumber from "bignumber.js";
import styled from "styled-components";
import { capitailize, emptyFunction, toPrecision } from "next-common/utils";
import Flex from "next-common/components/styled/flex";
import {
  calcPassing,
  getThresholdOfSimplyMajority,
  getThresholdOfSuperMajorityAgainst,
  getThresholdOfSuperMajorityApprove,
} from "utils/referendumUtil";
import useApi from "next-common/utils/hooks/useApi";
import useWindowSize from "next-common/utils/hooks/useWindowSize.js";
import AyeIcon from "public/imgs/icons/aye.svg";
import NayIcon from "public/imgs/icons/nay.svg";
import TurnoutIcon from "public/imgs/icons/turnout.svg";
import ElectorateIcon from "public/imgs/icons/electorate.svg";
import Threshold from "./threshold";
import Loading from "next-common/components/loading";
import ExternalLink from "next-common/assets/imgs/icons/external-link.svg";
import ValueDisplay from "next-common/components/displayValue";
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
import VotesCount from "next-common/components/democracy/referendum/votesCount";
import SubLink from "next-common/components/styled/subLink";
import { useChain, useChainSettings } from "next-common/context/chain";

const Popup = dynamic(() => import("./popup"), {
  ssr: false,
});

const AllVotesPopup = dynamic(
  () => import("next-common/components/democracy/allVotesPopup"),
  {
    ssr: false,
  }
);

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
`;

const PassStatus = styled(Status)`
  color: ${(props) => props.theme.secondaryGreen500};
  background: ${(props) => props.theme.secondaryGreen100};
`;

const RejectStatus = styled(Status)`
  color: ${(props) => props.theme.secondaryRed500};
  background: ${(props) => props.theme.secondaryRed100};
`;

const Row = styled(Flex)`
  height: 44px;
  margin-top: 0 !important;
  justify-content: space-between;
  white-space: nowrap;
  font-size: 14px;
  @media screen and (max-width: 1024px) {
    justify-content: flex-start;
  }
`;

const BorderedRow = styled(Flex)`
  height: 44px;
  border-bottom: 1px solid ${(props) => props.theme.grey200Border};
  justify-content: space-between;
  white-space: nowrap;
  font-size: 14px;
  @media screen and (max-width: 1024px) {
    justify-content: flex-start;
  }
`;

const Header = styled.span`
  width: 120px;
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => props.theme.textPrimary};

  svg {
    margin-right: 8px;
  }
`;

const Value = styled.span`
  color: ${(props) => props.theme.textPrimary};
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

const ActionLink = styled(SubLink)`
  margin-top: 8px !important;
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

  const { width } = useWindowSize();
  const node = useChainSettings(chain);
  const decimals = node.decimals;
  const symbol = node.voteSymbol ?? node.symbol;

  const isPassing = calcPassing(referendumStatus, electorate);

  const nAyes = toPrecision(referendumStatus?.tally?.ayes ?? 0, decimals);
  const nNays = toPrecision(referendumStatus?.tally?.nays ?? 0, decimals);
  const nTurnout = toPrecision(referendumStatus?.tally?.turnout ?? 0, decimals);
  const nElectorate = toPrecision(electorate ?? 0, decimals);

  let nAyesPercent = 50;
  let nNaysPercent = 50;
  let gap = 2;
  const nTotal = new BigNumber(nAyes).plus(nNays);
  if (nTotal.gt(0)) {
    nAyesPercent = Math.round(
      new BigNumber(nAyes).div(nTotal).toNumber() * 100
    );
    nNaysPercent = 100 - nAyesPercent;
    if (nAyesPercent === 100 || nNaysPercent === 100) {
      gap = 0;
    }
  }

  return (
    <Wrapper>
      <SecondaryCardDetail>
        <TitleContainer>
          <span>Votes</span>
          <div>
            {isLoadingReferendumStatus || isElectorateLoading ? (
              <Loading size={16} />
            ) : null}
          </div>
        </TitleContainer>

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
                  referendumStatus?.tally?.turnout ?? 0,
                  electorate
                )}
              />
            )}

            {(referendumStatus?.threshold || "").toLowerCase() ===
              "supermajorityagainst" && (
              <Threshold
                threshold={getThresholdOfSuperMajorityAgainst(
                  referendumStatus?.tally?.turnout ?? 0,
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
        <div>
          <BorderedRow>
            <Header>
              <AyeIcon />
              Aye
              {!isLoadingVotes ? (
                <VotesCount>{allAye.length}</VotesCount>
              ) : null}
            </Header>
            <Value>
              <ValueDisplay
                value={nAyes}
                symbol={symbol}
                noWrap={width <= 1024}
              />
            </Value>
          </BorderedRow>
          <BorderedRow>
            <Header>
              <NayIcon />
              Nay
              {!isLoadingVotes ? (
                <VotesCount>{allNay.length}</VotesCount>
              ) : null}
            </Header>
            <Value>
              <ValueDisplay
                value={nNays}
                symbol={symbol}
                noWrap={width <= 1024}
              />
            </Value>
          </BorderedRow>
          <BorderedRow>
            <Header>
              <TurnoutIcon />
              Turnout
            </Header>
            <Value>
              <ValueDisplay
                value={nTurnout}
                symbol={symbol}
                noWrap={width <= 1024}
              />
            </Value>
          </BorderedRow>
          <Row>
            <Header>
              <ElectorateIcon />
              Electorate
            </Header>
            <Value>
              <ValueDisplay
                value={BigNumber.max(nTurnout, nElectorate).toNumber()}
                symbol={symbol}
                noWrap={width <= 1024}
              />
            </Value>
          </Row>
        </div>

        <ActionLink onClick={() => setShowVoteList(true)}>
          Check all votes
        </ActionLink>

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
        How {capitailize(chain)} Governance Works.
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
        <AllVotesPopup
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
