import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import Tabs from "next-common/components/tabs";
import { useState, useMemo } from "react";
import MultisigSummary from "next-common/components/profile/multisigs/ownMultisigs/summary";
// import useProfileAddress from "next-common/components/profile/useProfileAddress";
// import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";

function Multisigs() {
  return <div>Multisigs</div>;
}

function Signatories() {
  return <div>Signatories</div>;
}

function OwnMultisigsImpl() {
  const [activeTabValue, setActiveTabValue] = useState("multisigs");
  // const address = useProfileAddress();

  const tabs = useMemo(
    () => [
      {
        value: "multisigs",
        label: "Multisigs",
        content: <Multisigs />,
      },
      {
        value: "signatories",
        label: "Signatories",
        content: <Signatories />,
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

// TODO: if not a multisig address -> always show this tab(show the null card)
export default function OwnMultisigs() {
  return (
    <div className="flex flex-col gap-[18px]">
      <MultisigSummary />
      <SecondaryCard>
        <OwnMultisigsImpl />
      </SecondaryCard>
    </div>
  );
}
