import Tabs from "next-common/components/tabs";
import { useState, useMemo } from "react";
import Multisigs from "next-common/components/profile/multisigs/multisigsAsAddress/multisigs";
import Signatories from "next-common/components/profile/multisigs/multisigsAsAddress/signatories";
import { useProfileMultisigsActiveContext } from "next-common/components/profile/multisigs/context/profileMultisigsActiveContext";

export default function MultisigsAsAddressTabs() {
  const [activeTabValue, setActiveTabValue] = useState("multisigs");
  const { activeCountAsMultisig } = useProfileMultisigsActiveContext();

  const tabs = useMemo(
    () => [
      {
        value: "multisigs",
        label: "Multisigs",
        content: <Multisigs />,
        activeCount: activeCountAsMultisig,
      },
      {
        value: "signatories",
        label: "Signatories",
        content: <Signatories />,
      },
    ],
    [activeCountAsMultisig],
  );

  return (
    <Tabs
      tabs={tabs}
      activeTabValue={activeTabValue}
      onTabClick={(tab) => setActiveTabValue(tab.value)}
    />
  );
}
