import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import Tabs from "next-common/components/tabs";
import { useState, useMemo } from "react";
import MultisigSummary from "next-common/components/profile/multisigs/ownMultisigs/summary";
// import useProfileAddress from "next-common/components/profile/useProfileAddress";
// import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";
import { useMultisigContext } from "next-common/components/profile/multisigs/context";
import Loading from "next-common/components/loading";

function MultisigsTabContent() {
  return <div>Multisigs</div>;
}

function SignatoriesTabContent() {
  return <div>Signatories</div>;
}

function OwnMultisigsTabs() {
  const [activeTabValue, setActiveTabValue] = useState("multisigs");
  // const address = useProfileAddress();

  const tabs = useMemo(
    () => [
      {
        value: "multisigs",
        label: "Multisigs",
        content: <MultisigsTabContent />,
      },
      {
        value: "signatories",
        label: "Signatories",
        content: <SignatoriesTabContent />,
      },
    ],
    [],
  );

  return (
    <Tabs
      tabs={tabs}
      activeTabValue={activeTabValue}
      onTabClick={(tab) => setActiveTabValue(tab.value)}
    />
  );
}

function OwnMultisigsContent() {
  return (
    <div className="flex flex-col gap-[18px]">
      <MultisigSummary />
      <SecondaryCard>
        <OwnMultisigsTabs />
      </SecondaryCard>
    </div>
  );
}

function Empty() {
  return (
    <div className="flex flex-col gap-[18px]">
      <SecondaryCard className="flex items-center justify-center">
        <span className="text-textTertiary text14Medium">
          {"Can't find multisig records of this address on chain"}
        </span>
      </SecondaryCard>
    </div>
  );
}

function LoadingWrapper() {
  return (
    <div className="flex grow mt-2 justify-center items-center">
      <Loading size={20} />
    </div>
  );
}

export default function OwnMultisigs() {
  const { multisig, loading } = useMultisigContext();
  if (loading) {
    return <LoadingWrapper />;
  }

  if (!multisig) {
    return <Empty />;
  }

  return <OwnMultisigsContent />;
}
