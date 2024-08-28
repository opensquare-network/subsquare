import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { BorderedRow } from "next-common/components/referenda/tally/styled";
import AddressUser from "next-common/components/user/addressUser";
import IndentPanel from "next-common/components/callTreeView/indentPanel";
import CuratorLinks from "./links";
import { useCurator, useCuratorParams } from "next-common/context/treasury/bounties";

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

function CuratorHeaderProxyTag() {
  return (
    <span className="py-[2px] px-[8px] rounded-[10px] text12Medium bg-neutral200 text-textSecondary">
      Proxy
    </span>
  );
}

function CuratorHeaderBadge({ badge }) {
  return (
    <span className="py-[2px] px-[8px] rounded-[10px] text12Medium bg-theme100 text-theme500">
      {badge}
    </span>
  );
}

export function CuratorHeader({ curator, badge, hasDelegate }) {
  return (
    <div className="flex items-center flex-wrap space-x-2">
      <AddressUser key={curator} add={curator} />
      {badge && <CuratorHeaderBadge badge={badge} />}
      {hasDelegate && <CuratorHeaderProxyTag />}
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
  const { badge, signatories, delegateAddress } = useCuratorParams();

  if (!curator) {
    return null;
  }

  return (
    <SecondaryCardDetail>
      <CuratorTitle />
      <BorderedRow>
        <CuratorHeader
          curator={curator}
          badge={badge}
          hasDelegate={delegateAddress}
        />
      </BorderedRow>
      <CuratorLinks address={curator} showCouncilorLink={true} />
      <MultisigAccounts signatories={signatories} />
    </SecondaryCardDetail>
  );
}

export default BountySidebarCurator;
