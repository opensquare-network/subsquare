import styled from "styled-components";
import { getNode, toPrecision } from "next-common/utils";
import Flex from "next-common/components/styled/flex";
import AyeIcon from "public/imgs/icons/aye.svg";
import NayIcon from "public/imgs/icons/nay.svg";
import TurnoutIcon from "public/imgs/icons/turnout.svg";
import ElectorateIcon from "public/imgs/icons/electorate.svg";
import DisplayValue from "next-common/components/displayValue";
import VotesCount from "next-common/components/democracy/referendum/votesCount";
import useWindowSize from "next-common/utils/hooks/useWindowSize";

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

export default function TallyInfo({
  tally,
  electorate,
  chain,
  isLoadingVotes,
  allAye,
  allNay,
}) {
  const { width } = useWindowSize();

  const node = getNode(chain);
  if (!node) {
    return null;
  }
  const decimals = node.decimals;
  const symbol = node.voteSymbol ?? node.symbol;

  const nAyes = toPrecision(tally?.ayes ?? 0, decimals);
  const nNays = toPrecision(tally?.nays ?? 0, decimals);
  const nTurnout = toPrecision(tally?.turnout ?? 0, decimals);
  const nElectorate = toPrecision(electorate ?? 0, decimals);

  return (
    <div>
      <BorderedRow>
        <Header>
          <AyeIcon />
          Aye
          {!isLoadingVotes ? <VotesCount>{allAye.length}</VotesCount> : null}
        </Header>
        <Value>
          <DisplayValue value={nAyes} symbol={symbol} noWrap={width <= 1024} />
        </Value>
      </BorderedRow>
      <BorderedRow>
        <Header>
          <NayIcon />
          Nay
          {!isLoadingVotes ? <VotesCount>{allNay.length}</VotesCount> : null}
        </Header>
        <Value>
          <DisplayValue value={nNays} symbol={symbol} noWrap={width <= 1024} />
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
  );
}
