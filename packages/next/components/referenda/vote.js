import { memo, useCallback, useState } from "react";
import dynamic from "next/dynamic";
import BigNumber from "bignumber.js";
import styled from "styled-components";
import { getNode, toPrecision } from "next-common/utils";
import Flex from "next-common/components/styled/flex";
import {
  calcPassing,
  getThresholdOfSimplyMajority,
  getThresholdOfSuperMajorityAgainst,
  getThresholdOfSuperMajorityApprove,
} from "utils/referendumUtil";
import useApi from "next-common/utils/hooks/useSelectedEnpointApi";
import useWindowSize from "next-common/utils/hooks/useWindowSize.js";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import AyeIcon from "public/imgs/icons/aye.svg";
import NayIcon from "public/imgs/icons/nay.svg";
import TurnoutIcon from "public/imgs/icons/turnout.svg";
import ElectorateIcon from "public/imgs/icons/electorate.svg";
import Threshold from "./threshold";
import DisplayValue from "next-common/components/displayValue";
import Loading from "next-common/components/loading";
import Chains from "next-common/utils/consts/chains";
import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { useSelector } from "react-redux";
import { latestHeightSelector } from "next-common/store/reducers/chainSlice";
import {
  electorateSelector,
  isLoadingElectorateSelector, isLoadingVotesSelector, votesSelector,
} from "next-common/store/reducers/referendumSlice";
import SubLink from "next-common/components/styled/subLink";
import VotesCount from "next-common/components/democracy/referendum/votesCount";

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

const ActionLink = styled(SubLink)`
  margin-top: 8px !important;
`

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
  const isLoadingVotes = useSelector(isLoadingVotesSelector)
  const { allAye = [], allNay = [] } = useSelector(votesSelector)

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

  const { width } = useWindowSize();

  const node = getNode(chain);
  if (!node) {
    return null;
  }
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
          <span>{nAyesPercent}%</span>
          <span>{referendumStatus?.threshold}</span>
          <span>{nNaysPercent}%</span>
        </Contents>
        <div>
          <BorderedRow>
            <Header>
              <AyeIcon />
              Aye
              { !isLoadingVotes ? <VotesCount>{ allAye.length }</VotesCount> : null }
            </Header>
            <Value>
              <DisplayValue
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
              { !isLoadingVotes ? <VotesCount>{ allNay.length }</VotesCount> : null }
            </Header>
            <Value>
              <DisplayValue
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
              <DisplayValue
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
              <DisplayValue
                value={nElectorate}
                symbol={symbol}
                noWrap={width <= 1024}
              />
            </Value>
          </Row>
        </div>
        <ActionLink onClick={() => setShowVoteList(true)}>
          Check all votes
        </ActionLink>
        {finishedResult}
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
