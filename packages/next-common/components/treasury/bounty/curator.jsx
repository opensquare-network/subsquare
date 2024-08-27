import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { BorderedRow } from "next-common/components/referenda/tally/styled";
import AddressUser from "next-common/components/user/addressUser";
import IndentPanel from "next-common/components/callTreeView/indentPanel";
import CuratorLinks from "./links";
import { useCuratorMultisigAddress } from "next-common/hooks/treasury/bounty/useCuratorMultisigAddress";
import { useCurator } from "next-common/context/treasury/bounties";

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

export function CuratorHeader({ curator, count, hasBadge = false }) {
  return (
    <div className="flex items-center flex-wrap space-x-2">
      <AddressUser key={curator} add={curator} />
      {hasBadge && (
        <span className="py-[2px] px-[8px] rounded-[10px] text12Medium bg-theme100 text-theme500">
          {count}
        </span>
      )}
    </div>
  );
}

function CuratorTitle() {
  return (
    <TitleContainer className="mb-4 !px-0">
      <span>Curator</span>
    </TitleContainer>
  );
}

function BountySidebarCurator() {
  const curator = useCurator();
  const {
    data: count,
    signatories,
    loading,
    error,
  } = useCuratorMultisigAddress(curator);
  if (!curator) {
    return null;
  }

  return (
    <SecondaryCardDetail>
      <CuratorTitle />
      <BorderedRow>
        <CuratorHeader
          curator={curator}
          count={count}
          hasBadge={!loading && !error}
        />
      </BorderedRow>
      <CuratorLinks address={curator} showCouncilorLink={true} />
      <MultisigAccounts signatories={signatories} />
    </SecondaryCardDetail>
  );
}

export default BountySidebarCurator;
