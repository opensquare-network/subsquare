import BigNumber from "bignumber.js";
import styled, { css } from "styled-components";
import { getNode, toPrecision } from "utils";
import Flex from "next-common/components/styled/flex";
import { shadow_100 } from "styles/componentCss";
import {
  getThresholdOfSimplyMajority,
  getThresholdOfSuperMajorityApprove,
  getThresholdOfSuperMajorityAgainst,
  calcPassing,
} from "utils/referendumUtil";
import { useElectorate } from "utils/hooks";
import AyeIcon from "public/imgs/icons/aye.svg";
import NayIcon from "public/imgs/icons/nay.svg";
import TurnoutIcon from "public/imgs/icons/turnout.svg";

const Wrapper = styled.div`
  margin: 16px 0;
  position: absolute;
  right: 0;
  top: 32px;
  width: 280px;
  margin-top: 0 !important;
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
  height: 48px;
  margin-top: 0 !important;
  margin-bottom: 16px;
`;

const BorderedRow = styled(Flex)`
  height: 44px;
  border-bottom: 1px solid #ebeef4;
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

const Threshold = styled.div`
  position: absolute;
  ${(p) =>
    p.threshold
      ? css`
          left: ${p.threshold};
        `
      : css`
          left: 50%;
        `}
  width: 2px;
  height: 1rem;
  background-color: #c2c8d5;
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

function Vote({ referendumInfo, referendumStatus, chain, setShowVote }) {
  const referendumEndHeight = referendumInfo?.finished?.end;
  let electorate = useElectorate(referendumEndHeight);
  const isPassing = calcPassing(referendumStatus, electorate);

  const node = getNode(chain);
  if (!node) {
    return null;
  }
  const decimals = node.decimals;
  const symbol = node.voteSymbol ?? node.symbol;

  const nAyes = toPrecision(referendumStatus?.tally?.ayes ?? 0, decimals);
  const nNays = toPrecision(referendumStatus?.tally?.nays ?? 0, decimals);
  const nTurnout = toPrecision(referendumStatus?.tally?.turnout ?? 0, decimals);

  let nAyesPrecent = 50;
  let nNaysPrecent = 50;
  let gap = 2;
  const nTotal = new BigNumber(nAyes).plus(nNays);
  if (nTotal.gt(0)) {
    nAyesPrecent = Math.round(
      new BigNumber(nAyes).div(nTotal).toNumber() * 100
    );
    nNaysPrecent = 100 - nAyesPrecent;
    if (nAyesPrecent === 100 || nNaysPrecent === 100) {
      gap = 0;
    }
  }
  return (
    <Wrapper>
      <Card>
        <Title>Votes</Title>

        <BarWrapper>
          <BarContainer gap={gap}>
            <AyesBar precent={nAyesPrecent} />
            <NaysBar precent={nNaysPrecent} />

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
          <span>{nAyesPrecent}%</span>
          <span>{referendumStatus?.threshold}</span>
          <span>{nNaysPrecent}%</span>
        </Contents>

        <BorderedRow>
          <Header>
            <AyeIcon />
            Aye
          </Header>
          <span>
            {nAyes} {symbol}
          </span>
        </BorderedRow>

        <BorderedRow>
          <Header>
            <NayIcon />
            Nay
          </Header>
          <span>
            {nNays} {symbol}
          </span>
        </BorderedRow>

        <Row>
          <Header>
            <TurnoutIcon />
            Turnout
          </Header>
          <span>
            {nTurnout} {symbol}
          </span>
        </Row>
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
    </Wrapper>
  );
}

export default Vote;
