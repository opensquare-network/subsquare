import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import AddressUser from "next-common/components/user/addressUser";
import IndentPanel from "next-common/components/callTreeView/indentPanel";
import CuratorLinks from "./links";
import {
  useCurator,
  useCuratorParams,
} from "next-common/context/treasury/bounties";

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

export function CuratorProxyTag() {
  return (
    <span className="py-[2px] px-[8px] rounded-[10px] text12Medium bg-neutral200 text-textSecondary">
      Proxy
    </span>
  );
}

export function CuratorBadge({ badge }) {
  return (
    <span className="py-[2px] px-[8px] rounded-[10px] text12Medium bg-theme100 text-theme500">
      {badge}
    </span>
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
      <div className="flex items-center flex-wrap  space-x-2 h-[44px] mt-0 border-b border-neutral300">
        <AddressUser
          key={curator}
          add={curator}
          maxWidth={badge ? 150 : undefined}
        />
        {badge && <CuratorBadge badge={badge} />}
        {delegateAddress && <CuratorProxyTag />}
      </div>
      <CuratorLinks address={curator} showCouncilorLink={true} />
      <MultisigAccounts signatories={signatories} />
    </SecondaryCardDetail>
  );
}

export default BountySidebarCurator;
