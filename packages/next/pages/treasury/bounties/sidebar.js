import { memo } from "react";
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
import useAddressBalance from "next-common/utils/hooks/useAddressBalance";
import useApi from "next-common/utils/hooks/useApi";
import { useOnchainData } from "next-common/context/post";
import { usePageProps } from "next-common/context/page";

const Title = styled(TitleContainer)`
  margin-bottom: 16px;
`;

function Sidebar() {
  const api = useApi();
  const { address } = useOnchainData();
  const [balance, loadingBalance] = useAddressBalance(api, address);
  const { childBounties } = usePageProps();

  if (!address) {
    return null;
  }

  return (
    <RightBarWrapper>
      <SecondaryCardDetail>
        <Title className="!px-0">
          <span>Balance</span>
          {loadingBalance && (
            <div>
              <Loading size={16} />
            </div>
          )}
        </Title>
        <BorderedRow>
          <Header>Total Fund</Header>
          {loadingBalance ? <Value>-</Value> : <SymbolValue value={balance} />}
        </BorderedRow>
        <BorderedRow>
          <Header>Child Bounties</Header>
          <Value>{childBounties?.total || 0}</Value>
        </BorderedRow>
      </SecondaryCardDetail>
    </RightBarWrapper>
  );
}

export default memo(Sidebar);
