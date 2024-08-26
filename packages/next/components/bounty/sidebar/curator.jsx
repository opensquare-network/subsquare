import styled from "styled-components";
import Loading from "next-common/components/loading";
import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { BorderedRow } from "next-common/components/referenda/tally/styled";
import { useOnchainData } from "next-common/context/post";
import AddressUser from "next-common/components/user/addressUser";
import IndentPanel from "next-common/components/callTreeView/indentPanel";
import CuratorLinks from "./links";

const Title = styled(TitleContainer)`
  margin-bottom: 16px;
`;

function MultisigAccounts() {
  // TODO:
  // if MultisigAccounts null, return null;
  // return IndentPanel
  return (
    <div className="pl-3">
      <IndentPanel>123</IndentPanel>
    </div>
  );
}

function BountySidebarCurator() {
  // TODO: curator: null?
  const mockCurator = "";

  if (!mockCurator) {
    return null;
  }

  // TODO: loading
  const isLoading = false;

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
        <AddressUser key={mockCurator} add={mockCurator} />
      </BorderedRow>
      <CuratorLinks address={mockCurator} showCouncilorLink={true} />
      <MultisigAccounts />
    </SecondaryCardDetail>
  );
}

export default BountySidebarCurator;
