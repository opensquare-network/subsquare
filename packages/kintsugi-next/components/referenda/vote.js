import BigNumber from "bignumber.js";
import styled, { css } from "styled-components";
import { getNode, toPrecision } from "utils";
import Flex from "next-common/components/styled/flex";
import { shadow_100 } from "styles/componentCss";
import {
  getThresholdOfSimplyMajority,
  getThresholdOfSuperMajorityApprove,
  getThresholdOfSuperMajorityAgainst,
} from "utils/referendumUtil";
import { useElectorate } from "utils/hooks";

const Wrapper = styled.div`
  background: #ffffff;
  border: 1px solid #ebeef4;
  ${shadow_100};
  border-radius: 6px;
  padding: 48px;
  @media screen and (max-width: 768px) {
    padding: 24px;
    border-radius: 0;
  }
  margin: 16px 0;
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

  span {
    display: inline-block;
    width: 33.33%;
  }

  span:nth-child(2) {
    text-align: center;
  }

  span:nth-child(3) {
    text-align: right;
  }
`;

const Contents = styled(Headers)`
  font-weight: 500;
  color: #1e2134;
  margin-bottom: 16px;
`;

const Button = styled.button`
  width: 100%;
  height: 38px;
  border-width: 0;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: default;
`;

const PassButton = styled(Button)`
  color: #4caf50;
  background: #edf7ed;
`;

const RejectButton = styled(Button)`
  color: #f44336;
  background: #fff1f0;
`;

const Row = styled(Flex)`
  height: 48px;
  margin-bottom: 16px;
`;

const BorderedRow = styled(Flex)`
  height: 48px;
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
  ${(p) => p.threshold
      ? css`left: ${p.threshold};`
      : css`left: 50%;`
  }
  width: 2px;
  height: 1rem;
  background-color: #c2c8d5;
`;

function Vote({ referendumInfo, referendumStatus, isPassing, chain }) {
  const electorate = useElectorate();
  console.log(electorate);
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
      <Title>Votes</Title>

      <BarWrapper>
        <BarContainer gap={gap}>
          <AyesBar precent={nAyesPrecent} />
          <NaysBar precent={nNaysPrecent} />

          {(referendumStatus?.threshold || "").toLowerCase() ===
            "simplemajority" && <Threshold threshold={getThresholdOfSimplyMajority()} />}

          {(referendumStatus?.threshold || "").toLowerCase() === "supermajorityapprove" &&
              <Threshold threshold={
                getThresholdOfSuperMajorityApprove(
                  referendumStatus?.tally?.nays || 0,
                  referendumStatus?.tally?.turnout ?? 0,
                  electorate
                )}
              />
          }

          {(referendumStatus?.threshold || "").toLowerCase() === "supermajorityagainst" &&
              <Threshold threshold={
                getThresholdOfSuperMajorityAgainst(
                  referendumStatus?.tally?.nays || 0,
                  referendumStatus?.tally?.turnout ?? 0,
                  electorate
                )}
              />
          }
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
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.4933 3.1543L5.16868 10.8452L1.50635 6.99991"
              stroke="#4CAF50"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Aye
        </Header>
        <span>
          {nAyes} {symbol}
        </span>
      </BorderedRow>

      <BorderedRow>
        <Header>
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.50439 2.50391L7.00023 6.99975M7.00023 6.99975L11.4961 11.4956M7.00023 6.99975L11.4961 2.50391M7.00023 6.99975L2.50439 11.4956"
              stroke="#F44336"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          Nay
        </Header>
        <span>
          {nNays} {symbol}
        </span>
      </BorderedRow>

      <Row>
        <Header>
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 4.3H9M4 7H10M5 9.7H9M2 1.5H12C12.2761 1.5 12.5 1.74624 12.5 2.05V11.95C12.5 12.2538 12.2761 12.5 12 12.5H2C1.72386 12.5 1.5 12.2538 1.5 11.95V2.05C1.5 1.74624 1.72386 1.5 2 1.5Z"
              stroke="#9DA9BB"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Turnout
        </Header>
        <span>
          {nTurnout} {symbol}
        </span>
      </Row>
      {referendumInfo?.finished?.approved && <PassButton>Passed</PassButton>}
      {referendumInfo?.finished?.approved === false && (
        <RejectButton>Rejected</RejectButton>
      )}
      {referendumInfo && !referendumInfo.finished && (
        isPassing ? (
          <PassButton>Passing</PassButton>
        ) : (
          <RejectButton>Failing</RejectButton>
        )
      )}
    </Wrapper>
  );
}

export default Vote;
