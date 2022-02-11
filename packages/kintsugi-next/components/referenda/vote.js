import React, { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import BigNumber from "bignumber.js";
import styled from "styled-components";
import { getNode, toPrecision } from "utils";
import Flex from "next-common/components/styled/flex";
import { shadow_100 } from "styles/componentCss";
import {
  getThresholdOfSimplyMajority,
  getThresholdOfSuperMajorityApprove,
  getThresholdOfSuperMajorityAgainst,
  calcPassing,
} from "utils/referendumUtil";
import {
  useElectorate,
  useIsMounted,
  useApi,
  useWindowSize,
  useLoaded,
} from "utils/hooks";
import AyeIcon from "public/imgs/icons/aye.svg";
import NayIcon from "public/imgs/icons/nay.svg";
import TurnoutIcon from "public/imgs/icons/turnout.svg";
import ElectorateIcon from "public/imgs/icons/electorate.svg";
import Threshold from "./threshold";
import ArrowIcon from "public/imgs/icons/arrow.svg";
import DisplayValue from "./displayValue";
import Loading from "./loading";
import { useBlockHeight } from "utils/hooks";

const Popup = dynamic(() => import("components/referenda/popup"), {
  ssr: false,
});

const Wrapper = styled.div`
  position: absolute;
  right: 0;
  top: 32px;
  width: 280px;
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

const Card = styled.div`
  background: #ffffff;
  border: 1px solid #ebeef4;
  ${shadow_100};
  border-radius: 6px;
  padding: 24px;
  @media screen and (max-width: 768px) {
    border-radius: 0;
  }
  > :not(:first-child) {
    margin-top: 16px;
  }
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 16px;
`;

const Headers = styled(Flex)`
  justify-content: space-between;
  font-size: 12px;
  color: #506176;

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
  color: #1e2134;
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
  color: #4caf50;
  background: #edf7ed;
`;

const RejectStatus = styled(Status)`
  color: #f44336;
  background: #fff1f0;
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
  border-bottom: 1px solid #ebeef4;
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
  color: #1e2134;

  svg {
    margin-right: 8px;
  }
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
  background-color: #4caf50;
  width: ${(p) => p.precent}%;
  height: 100%;
`;

const NaysBar = styled.div`
  background-color: #f44336;
  width: ${(p) => p.precent}%;
  height: 100%;
`;

const VoteButton = styled.button`
  all: unset;
  cursor: pointer;
  margin-top: 16px;
  width: 100%;
  line-height: 38px;
  background-color: #1e2134;
  color: white;
  font-weight: 500;
  font-size: 14px;
  text-align: center;
  border-radius: 4px;
`;

const Guide = styled.p`
  font-size: 12px;
  white-space: nowrap;
  display: flex;
  align-items: center;
  color: #9da9bb;
  a {
    margin-left: 2px;
    svg {
      margin-left: 2px;
    }
    font-size: 12px !important;
    display: flex;
    align-items: center;
    color: #6848ff !important;
  }
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
  const isMounted = useIsMounted();
  const api = useApi(chain);
  const blockHeight = useBlockHeight();

  const updateVoteProgress = useCallback(() => {
    api?.query.democracy
      .referendumInfoOf(referendumIndex)
      .then((referendumInfo) => {
        const referendumInfoData = referendumInfo.toJSON();
        if (isMounted.current) {
          setReferendumStatus(referendumInfoData?.ongoing);
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

  const referendumEndHeight = referendumInfo?.finished?.end;
  const [electorate, isElectorateLoading] = useElectorate(
    referendumEndHeight || blockHeight
  );
  const isElectorateLoaded = useLoaded(isElectorateLoading);

  const { width } = useWindowSize();

  const node = getNode(chain);
  if (!node) {
    return null;
  }
  const decimals = node.decimals;
  const symbol = node.voteSymbol ?? node.symbol;

  const isPassing = calcPassing(
    referendumStatus,
    new BigNumber(electorate).times(Math.pow(10, decimals))
  );

  const nAyes = toPrecision(referendumStatus?.tally?.ayes ?? 0, decimals);
  const nNays = toPrecision(referendumStatus?.tally?.nays ?? 0, decimals);
  const nTurnout = toPrecision(referendumStatus?.tally?.turnout ?? 0, decimals);

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
      <Card>
        <Title>
          <span>Votes</span>
          <div>
            {isLoadingReferendumStatus || !isElectorateLoaded ? (
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
                  toPrecision(referendumStatus?.tally?.turnout ?? 0, decimals),
                  electorate
                )}
              />
            )}

            {(referendumStatus?.threshold || "").toLowerCase() ===
              "supermajorityagainst" && (
              <Threshold
                threshold={getThresholdOfSuperMajorityAgainst(
                  toPrecision(referendumStatus?.tally?.turnout ?? 0, decimals),
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
            </Header>
            <span>
              <DisplayValue
                value={nAyes}
                symbol={symbol}
                noWrap={width <= 1024}
              />
            </span>
          </BorderedRow>
          <BorderedRow>
            <Header>
              <NayIcon />
              Nay
            </Header>
            <span>
              <DisplayValue
                value={nNays}
                symbol={symbol}
                noWrap={width <= 1024}
              />
            </span>
          </BorderedRow>
          <BorderedRow>
            <Header>
              <TurnoutIcon />
              Turnout
            </Header>
            <span>
              <DisplayValue
                value={nTurnout}
                symbol={symbol}
                noWrap={width <= 1024}
              />
            </span>
          </BorderedRow>
          <Row>
            <Header>
              <ElectorateIcon />
              Electorate
            </Header>
            <span>
              <DisplayValue
                value={BigNumber.max(nTurnout, electorate)}
                symbol={symbol}
                noWrap={width <= 1024}
              />
            </span>
          </Row>
        </div>
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
      </Card>

      {!referendumInfo?.finished && (
        <VoteButton
          onClick={() => {
            setShowVote(true);
          }}
        >
          Vote
        </VoteButton>
      )}

      <Guide>
        How Kintsugi Governance Works.
        <a
          href="https://docs.interlay.io/#/kintsugi/governance"
          target="_blank"
          rel="noreferrer"
        >
          View detail <ArrowIcon />
        </a>
      </Guide>

      {showVote && (
        <Popup
          chain={chain}
          onClose={() => setShowVote(false)}
          referendumIndex={referendumIndex}
          onSubmitted={() => setIsLoadingReferendumStatus(true)}
          onInBlock={updateVoteProgress}
        />
      )}
    </Wrapper>
  );
}

export default Vote;
