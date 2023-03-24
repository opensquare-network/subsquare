import React from "react";
import styled from "styled-components";
import { toPrecision } from "../../../utils";
import Flex from "../../../components/styled/flex";
import AyeIcon from "../../../assets/imgs/icons/aye.svg";
import NayIcon from "../../../assets/imgs/icons/nay.svg";
import TurnoutIcon from "../../../assets/imgs/icons/turnout.svg";
import ElectorateIcon from "../../../assets/imgs/icons/electorate.svg";
import ValueDisplay from "../../../components/valueDisplay";
import VotesCount from "../../../components/democracy/referendum/votesCount";
import useWindowSize from "../../../utils/hooks/useWindowSize";
import { useChainSettings } from "../../../context/chain";

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
  width: 146px;
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
  isLoadingVotes,
  allAye,
  allNay,
}) {
  const { width } = useWindowSize();

  const node = useChainSettings();
  if (!node) {
    return null;
  }
  const decimals = node.decimals;
  const symbol = node.voteSymbol ?? node.symbol;

  const nAyes = toPrecision(tally?.ayes ?? 0, decimals);
  const nNays = toPrecision(tally?.nays ?? 0, decimals);
  const nTurnout = toPrecision(tally?.turnout ?? 0, decimals);
  const nElectorate = toPrecision(electorate ?? 0, decimals);

  const nTurnoutPercent = (nTurnout / nElectorate) * 100;
  const nTurnoutPercentDisplay = (
    Math.floor(nTurnoutPercent * 100) / 100
  ).toFixed(2);

  return (
    <div>
      <BorderedRow>
        <Header>
          <AyeIcon />
          Aye
          {!isLoadingVotes ? <VotesCount>{allAye.length}</VotesCount> : null}
        </Header>
        <Value>
          <ValueDisplay value={nAyes} symbol={symbol} noWrap={width <= 1024} />
        </Value>
      </BorderedRow>
      <BorderedRow>
        <Header>
          <NayIcon />
          Nay
          {!isLoadingVotes ? <VotesCount>{allNay.length}</VotesCount> : null}
        </Header>
        <Value>
          <ValueDisplay value={nNays} symbol={symbol} noWrap={width <= 1024} />
        </Value>
      </BorderedRow>
      <BorderedRow>
        <Header>
          <TurnoutIcon />
          Turnout
          {!isLoadingVotes && (
            <VotesCount>{nTurnoutPercentDisplay}%</VotesCount>
          )}
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
            value={nElectorate}
            symbol={symbol}
            noWrap={width <= 1024}
          />
        </Value>
      </Row>
    </div>
  );
}
