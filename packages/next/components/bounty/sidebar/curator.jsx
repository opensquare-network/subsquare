import styled from "styled-components";
import Loading from "next-common/components/loading";
import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { BorderedRow } from "next-common/components/referenda/tally/styled";
import AddressUser from "next-common/components/user/addressUser";
import IndentPanel from "next-common/components/callTreeView/indentPanel";
import CuratorLinks from "./links";
import { useCuratorMultisigAddress } from "./useCuratorMultisigAddress";
import { useCurator } from "next-common/context/treasury/bounties";

const Title = styled(TitleContainer)`
  margin-bottom: 16px;
`;

function MultisigAccounts({ signatories }) {
  if (!signatories) {
    return null;
  }

  return (
    <div className="pl-3">
      <IndentPanel>
        {signatories.map((address) => (
          <AddressUser key={address} add={address} className="my-1" />
        ))}
      </IndentPanel>
    </div>
  );
}

export function ThresholdSignatoryBadge({ count }) {
  return (
    <span className="py-[2px] px-[8px] rounded-[10px] text12Medium bg-theme100 text-theme500">
      {count}
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
  const curator = useCurator();
  if (!curator) {
    return null;
  }

  const {
    data: count,
    signatories,
    loading,
    error,
  } = useCuratorMultisigAddress(curator);

  return (
    <SecondaryCardDetail>
      <CuratorTitle />
      <BorderedRow>
        <div className="flex items-center space-x-2">
          <AddressUser key={curator} add={curator} />
          {loading || error ? null : <ThresholdSignatoryBadge count={count} />}
        </div>
      </BorderedRow>
      <CuratorLinks address={curator} showCouncilorLink={true} />
      <MultisigAccounts signatories={signatories} />
    </SecondaryCardDetail>
  );
}

export default BountySidebarCurator;
