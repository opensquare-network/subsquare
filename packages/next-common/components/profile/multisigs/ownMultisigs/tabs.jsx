import Tabs from "next-common/components/tabs";
import { useState, useMemo } from "react";
import Multisigs from "next-common/components/profile/multisigs/ownMultisigs/multisigs";
import Signatories from "next-common/components/profile/multisigs/ownMultisigs/signatories";

export default function OwnMultisigsTabs() {
  const [activeTabValue, setActiveTabValue] = useState("multisigs");

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
