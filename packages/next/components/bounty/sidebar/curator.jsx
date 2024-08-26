import styled from "styled-components";
import Loading from "next-common/components/loading";
import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { BorderedRow } from "next-common/components/referenda/tally/styled";
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
  const mockCurator = "";

  return (
    <div className="pl-3">
      <IndentPanel>
        <AddressUser key={mockCurator} add={mockCurator} className="my-1" />
        <AddressUser key={mockCurator} add={mockCurator} className="my-1" />
        <AddressUser key={mockCurator} add={mockCurator} className="my-1" />
        <AddressUser key={mockCurator} add={mockCurator} className="my-1" />
      </IndentPanel>
    </div>
  );
}

function ThresholdSignatoryBadge() {
  // TODO
  const badgeValue = "3/7";
  return (
    <span className="py-[2px] px-[8px] rounded-[10px] text12Medium bg-theme100 text-theme500">
      {badgeValue}
    </span>
  );
}

function CuratorTitle() {
  return (
    <Title className="!px-0">
      <span>Curator</span>
    </Title>
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
      <CuratorTitle />
      <BorderedRow>
        <div className="flex items-center space-x-2">
          <AddressUser key={mockCurator} add={mockCurator} />
          <ThresholdSignatoryBadge />
        </div>
      </BorderedRow>
      <CuratorLinks address={mockCurator} showCouncilorLink={true} />
      <MultisigAccounts />
    </SecondaryCardDetail>
  );
}

export default BountySidebarCurator;
