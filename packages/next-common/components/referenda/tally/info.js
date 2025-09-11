import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { toPrecision } from "../../../utils";
import Flex from "../../../components/styled/flex";
import AyeIcon from "../../../assets/imgs/icons/aye.svg";
import NayIcon from "../../../assets/imgs/icons/nay.svg";
import TurnoutIcon from "../../../assets/imgs/icons/turnout.svg";
import ElectorateIcon from "../../../assets/imgs/icons/electorate.svg";
import ValueDisplay from "../../../components/valueDisplay";
import VotesCount from "../../../components/democracy/referendum/votesCount";
import { useChainSettings } from "../../../context/chain";
import useMaybeFetchElectorate from "../../../utils/hooks/referenda/useMaybeFetchElectorate";
import { useSelector } from "react-redux";
import {
  allAyeSelector,
  allNaySelector,
  showVotesNumberSelector,
} from "next-common/store/reducers/democracy/votes/selectors";
import { usePost } from "next-common/context/post";
import { isNil } from "lodash-es";

const Row = styled(Flex)`
  height: 44px;
  margin-top: 0 !important;
  justify-content: space-between;
  white-space: nowrap;
  font-size: 14px;

  & + & {
    border-top: 1px solid var(--neutral300);
  }
`;

const Header = styled.span`
  width: 146px;
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: var(--textPrimary);

  svg {
    margin-right: 8px;
  }
`;

const Value = styled.span`
  color: var(--textPrimary);
`;

export default function TallyInfo({ tally }) {
  const post = usePost();
  const showVotesNumber = useSelector(showVotesNumberSelector);
  const allAye = useSelector(allAyeSelector);
  const allNay = useSelector(allNaySelector);

  const node = useChainSettings(post.indexer?.blockHeight);
  const electorate = useMaybeFetchElectorate();
  const [turnoutPercentage, setTurnoutPercentage] = useState();
  const decimals = node.decimals;
  const symbol = node.voteSymbol ?? node.symbol;

  const nAyes = toPrecision(tally?.ayes ?? 0, decimals);
  const nNays = toPrecision(tally?.nays ?? 0, decimals);
  const nTurnout = toPrecision(tally?.turnout ?? 0, decimals);
  const nElectorate = toPrecision(electorate ?? 0, decimals);

  useEffect(() => {
    const turnout = tally?.turnout || 0;
    if (electorate <= 0) {
      setTurnoutPercentage(turnout > 0 ? 100 : 0);
    } else {
      setTurnoutPercentage(((turnout / electorate) * 100).toFixed(2));
    }
  }, [tally, electorate]);

  return (
    <div>
      <Row>
        <Header>
          <AyeIcon />
          Aye
          {showVotesNumber ? <VotesCount>{allAye.length}</VotesCount> : null}
        </Header>
        <Value>
          <ValueDisplay value={nAyes} symbol={symbol} />
        </Value>
      </Row>
      <Row>
        <Header>
          <NayIcon />
          Nay
          {showVotesNumber ? <VotesCount>{allNay.length}</VotesCount> : null}
        </Header>
        <Value>
          <ValueDisplay value={nNays} symbol={symbol} />
        </Value>
      </Row>
      <Row>
        <Header>
          <TurnoutIcon />
          Turnout
          {!isNil(turnoutPercentage) && <VotesCount>{turnoutPercentage}%</VotesCount>}
        </Header>
        <Value>
          <ValueDisplay value={nTurnout} symbol={symbol} />
        </Value>
      </Row>
      <Row>
        <Header>
          <ElectorateIcon />
          Electorate
        </Header>
        <Value>
          <ValueDisplay value={nElectorate} symbol={symbol} />
        </Value>
      </Row>
    </div>
  );
}
