import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import AddressUser from "next-common/components/user/addressUser";
import IndentPanel from "next-common/components/callTreeView/indentPanel";
import CuratorLinks from "./links";
import { useCurator } from "next-common/context/treasury/bounties";
import { SystemRelatives } from "@osn/icons/subsquare";
import Tooltip from "next-common/components/tooltip";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { memo, useState } from "react";
import { useCuratorAddress } from "next-common/hooks/treasury/bounty/useCuratorRelationship";
import { CuratorTag } from "./styled";
import { cn } from "next-common/utils";

const RelationshipPopup = dynamicPopup(() =>
  import("next-common/components/relationshipPopup"),
);

function MultisigAccounts({ signatories = [] }) {
  if (signatories.length === 0) {
    return null;
  }

  return (
    <div className="pl-[10px]">
      <IndentPanel>
        {signatories.map((address) => (
          <AddressUser key={address} add={address} className="my-1" />
        ))}
      </IndentPanel>
    </div>
  );
}

function CuratorTitle({ address }) {
  const [showRelationshipPopup, setShowRelationshipPopup] = useState(false);

  return (
    <TitleContainer className="mb-4 !px-0">
      <span>Curator</span>
      <Tooltip content="Check Relatives Detail">
        <SystemRelatives
          onClick={() => setShowRelationshipPopup(true)}
          className="w-5 h-5 cursor-pointer"
        />
      </Tooltip>
      {showRelationshipPopup && (
        <RelationshipPopup
          onClose={() => setShowRelationshipPopup(false)}
          rootAddress={address}
        />
      )}
    </TitleContainer>
  );
}

function ProxyAccounts({ proxies = [] }) {
  if (!proxies || proxies.length === 0) {
    return null;
  }

  return (
    <div className="pl-[10px]">
      <IndentPanel>
        {proxies.map((proxy) => (
          <div key={proxy.delegate}>
            <CuratorMultisigAccounts address={proxy.delegate} isProxy />
          </div>
        ))}
      </IndentPanel>
    </div>
  );
}

function AccountDisplay({
  address,
  isPure = false,
  isProxy = false,
  badge = "",
  className = "",
}) {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <AddressUser
        add={address}
        maxWidth={badge ? 150 : undefined}
        className="my-1"
      />
      {badge && (
        <CuratorTag className="bg-theme100 text-theme500">{badge}</CuratorTag>
      )}
      {isPure && <CuratorTag>Pure</CuratorTag>}
      {isProxy && <CuratorTag>Proxy</CuratorTag>}
    </div>
  );
}

function CuratorMultisigAccounts({ address, isProxy = false }) {
  const { isPure, multisigData, isLoading } = useCuratorAddress(address);

  if (isLoading) {
    return null;
  }

  return (
    <>
      <AccountDisplay
        address={address}
        badge={multisigData?.badge}
        isPure={isPure}
        isProxy={isProxy}
        className="my-1"
      />
      <div className="pl-[10px]">
        <IndentPanel>
          {multisigData?.signatories?.map((address) => (
            <AddressUser key={address} add={address} className="my-1" />
          ))}
        </IndentPanel>
      </div>
    </>
  );
}

const CuratorContent = memo(function CuratorContent({ address }) {
  const { isPure, multisigData, proxies } = useCuratorAddress(address);
  return (
    <SecondaryCardDetail>
      <CuratorTitle address={address} />
      <div className="flex items-center flex-wrap  space-x-2 h-[44px] mt-0 border-b border-neutral300">
        <AccountDisplay
          address={address}
          isPure={isPure}
          badge={multisigData?.badge}
        />
      </div>
      <CuratorLinks address={address} showCouncilorLink={true} />
      <ProxyAccounts proxies={proxies} />
      <MultisigAccounts signatories={multisigData?.signatories} />
    </SecondaryCardDetail>
  );
});

function BountySidebarCurator() {
  const curator = useCurator();

  if (!curator) {
    return null;
  }

  return <CuratorContent address={curator} />;
}

export default BountySidebarCurator;
