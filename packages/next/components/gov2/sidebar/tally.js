// bulk of copies from "components/referenda/tallyInfo"

import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import Flex from "next-common/components/styled/flex";
import { getNode, toPrecision } from "next-common/utils";
import useWindowSize from "next-common/utils/hooks/useWindowSize";
import styled from "styled-components";
import AyeIcon from "public/imgs/icons/aye.svg";
import NayIcon from "public/imgs/icons/nay.svg";
import ElectorateIcon from "public/imgs/icons/electorate.svg";
import DisplayValue from "next-common/components/displayValue";
import useFetchVotes from "next-common/utils/hooks/referenda/useFetchVotes";
import useApi from "next-common/utils/hooks/useSelectedEnpointApi";

const Title = styled(TitleContainer)`
  margin-bottom: 16px;
`;

const Row = styled(Flex)`
  height: 44px;
  margin-top: 0 !important;
  justify-content: space-between;
  white-space: nowrap;
  font-size: 14px;
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

export default function Gov2Tally({ detail, chain }) {
  const { width } = useWindowSize();

  const api = useApi(chain);
  useFetchVotes(detail?.onchainData, api);

  const node = getNode(chain);

  const decimals = node.decimals;
  const symbol = node.voteSymbol ?? node.symbol;

  // When the referendum is Cancelled or TimedOut,
  // Then info.tally is not saving the latest status
  const tally =
    detail?.onchainData?.state?.args?.tally || detail?.onchainData?.info?.tally;

  const nAyes = toPrecision(tally?.ayes ?? 0, decimals);
  const nNays = toPrecision(tally?.nays ?? 0, decimals);
  const nSupport = toPrecision(tally?.support ?? 0, decimals);

  if (!node) {
    return null;
  }

  return (
    <div>
      <SecondaryCardDetail>
        <Title>Tally</Title>
        <div>
          <BorderedRow>
            <Header>
              <AyeIcon />
              Ayes
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
              Nays
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
            <Value>
              <DisplayValue
                value={nSupport}
                symbol={symbol}
                noWrap={width <= 1024}
              />
            </Value>
          </Row>
        </div>
      </SecondaryCardDetail>
    </div>
  );
}
