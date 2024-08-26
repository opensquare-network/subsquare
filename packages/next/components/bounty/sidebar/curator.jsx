import styled from "styled-components";
import Loading from "next-common/components/loading";
import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import {
  BorderedRow,
  Header,
  Value,
} from "next-common/components/referenda/tally/styled";
import SymbolValue from "components/gov2/sidebar/tally/values/symbolValue";
import { useOnchainData } from "next-common/context/post";
import useSubAddressBalance from "next-common/utils/hooks/useSubAddressBalance";

const Title = styled(TitleContainer)`
  margin-bottom: 16px;
`;

function BountySidebarCurator() {
  const { address } = useOnchainData();
  const { balance, isLoading } = useSubAddressBalance(address);

  if (!address) {
    return null;
  }

  return (
    <SecondaryCardDetail>
      <Title className="!px-0">
        <span>Curator</span>
        {isLoading && (
          <div>
            <Loading size={16} />
          </div>
        )}
      </Title>
      <BorderedRow>
        <Header>title</Header>
        {isLoading ? <Value>-</Value> : '123'}
      </BorderedRow>
    </SecondaryCardDetail>
  );
}

export default BountySidebarCurator;
