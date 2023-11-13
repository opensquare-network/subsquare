import styled from "styled-components";
import Loading from "next-common/components/loading";
import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { RightBarWrapper } from "next-common/components/layout/sidebar/rightBarWrapper";
import {
  BorderedRow,
  Header,
  Value,
} from "next-common/components/referenda/tally/styled";
import SymbolValue from "components/gov2/sidebar/tally/values/symbolValue";
import useApi from "next-common/utils/hooks/useApi";
import { useOnchainData } from "next-common/context/post";
import { usePageProps } from "next-common/context/page";
import useSubAddressBalance from "next-common/utils/hooks/useSubAddressBalance";

const Title = styled(TitleContainer)`
  margin-bottom: 16px;
`;

function BountySidebar() {
  const api = useApi();
  const { address } = useOnchainData();
  const { balance, isLoading } = useSubAddressBalance(api, address);
  const { childBounties } = usePageProps();

  if (!address) {
    return null;
  }

  return (
    <RightBarWrapper>
      <SecondaryCardDetail>
        <Title className="!px-0">
          <span>Balance</span>
          {isLoading && (
            <div>
              <Loading size={16} />
            </div>
          )}
        </Title>
        <BorderedRow>
          <Header>Balance</Header>
          {isLoading ? <Value>-</Value> : <SymbolValue value={balance} />}
        </BorderedRow>
        <BorderedRow>
          <Header>Child Bounties</Header>
          <Value>{childBounties?.total || 0}</Value>
        </BorderedRow>
      </SecondaryCardDetail>
    </RightBarWrapper>
  );
}

export default BountySidebar;
