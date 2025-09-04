import Tabs from "next-common/components/tabs";
import { useState, useMemo } from "react";
import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";

const Multisigs = dynamicClientOnly(() =>
  import("next-common/components/profile/multisigs/ownMultisigs/multisigs"),
);

const Signatories = dynamicClientOnly(() =>
  import("next-common/components/profile/multisigs/ownMultisigs/signatories"),
);

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
