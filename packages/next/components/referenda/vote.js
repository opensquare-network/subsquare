import BigNumber from "bignumber.js";
import styled from "styled-components";
import { getNode, toPrecision } from "../../utils";

const Wrapper = styled.div`
  background: #ffffff;
  border: 1px solid #ebeef4;
  box-shadow: 0 6px 7px rgba(30, 33, 52, 0.02),
    0 1.34018px 1.56354px rgba(30, 33, 52, 0.0119221),
    0 0.399006px 0.465507px rgba(30, 33, 52, 0.00807786);
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

const Flex = styled.div`
  display: flex;
  align-items: center;
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
    margin-right: 4px;
  }
`;

const BarContainer = styled.div`
  display: flex;
  gap: 2px;
  height: 8px;
  width: 100%;
`;

const AyesBar = styled.div`
  background-color: #4CAF50;
  width: ${p=>p.precent}%;
  height: 100%;
`;

const NaysBar = styled.div`
  background-color: #F44336;
  width: ${p=>p.precent}%;
  height: 100%;
`;

function Vote({ referendum, chain }) {
  const node = getNode(chain);
  if (!node) {
    return null;
  }
  const decimals = node.decimals;
  const symbol = node.symbol;

  const nAyes = toPrecision(referendum?.status?.tally?.ayes ?? 0, decimals);
  const nNays = toPrecision(referendum?.status?.tally?.nays ?? 0, decimals);
  const nTurnout = toPrecision(referendum?.status?.tally?.turnout ?? 0, decimals);

  let nAyesPrecent = 0;
  let nNaysPrecent = 0;
  const nTotal = new BigNumber(nAyes).plus(nNays);
  if (nTotal.gt(0)) {
    nAyesPrecent = Math.round(new BigNumber(nAyes).div(nTotal).toNumber() * 100);
    nNaysPrecent = 100 - nAyesPrecent;
  }

  return (
    <Wrapper>
      <Title>Votes</Title>

      <BarContainer>
        { nAyesPrecent > 0 && <AyesBar precent={nAyesPrecent} /> }
        { nNaysPrecent > 0 && <NaysBar precent={nNaysPrecent} /> }
        { nAyesPrecent === 0 && nNaysPrecent === 0 && (
          <>
            <AyesBar precent={50} />
            <NaysBar precent={50} />
          </>
        )}
      </BarContainer>

      <Headers>
        <span>Aye</span>
        <span>Passing threshold</span>
        <span>Nay</span>
      </Headers>

      <Contents>
        <span>
          {nAyesPrecent}%
        </span>
        <span>{referendum?.status?.threshold}</span>
        <span>
          {nNaysPrecent}%
        </span>
      </Contents>

      <BorderedRow>
        <Header>Turnout</Header>
        <span>
          {nTurnout}{" "}{symbol}
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
      </Row>
      {referendum?.info?.finished?.approved && <PassButton>Passed</PassButton>}
      {referendum?.info?.finished?.approved === false && (
        <RejectButton>Rejected</RejectButton>
      )}
    </Wrapper>
  );
}

export default Vote;
