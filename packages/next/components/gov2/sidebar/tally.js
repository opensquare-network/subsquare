// bulk of copies from "components/referenda/tallyInfo"

import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import Flex from "next-common/components/styled/flex";
import { getNode, toPrecision } from "next-common/utils";
import useWindowSize from "next-common/utils/hooks/useWindowSize";
import styled from "styled-components";
import VotesCount from "next-common/components/democracy/referendum/votesCount";
import AyeIcon from "public/imgs/icons/aye.svg";
import NayIcon from "public/imgs/icons/nay.svg";
import ElectorateIcon from "public/imgs/icons/electorate.svg";
import DisplayValue from "next-common/components/displayValue";

const Title = styled(TitleContainer)`
  margin-bottom: 16px;
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

const BorderedRow = styled(Row)`
  border-bottom: 1px solid ${(props) => props.theme.grey200Border};
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

export default function Gov2Tally({
  tally,
  detail,
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

  return (
    <div>
      <SecondaryCardDetail>
        <Title>Tally</Title>
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
              {!isLoadingVotes ? (
                <VotesCount>{allNay.length}</VotesCount>
              ) : null}
            </Header>
            <Value>
              <DisplayValue
                value={nNays}
                symbol={symbol}
                noWrap={width <= 1024}
              />
            </Value>
          </BorderedRow>
          <Row>
            <Header>
              <ElectorateIcon />
              Support
            </Header>
            <Value>12</Value>
          </Row>
        </div>
      </SecondaryCardDetail>
    </div>
  );
}
