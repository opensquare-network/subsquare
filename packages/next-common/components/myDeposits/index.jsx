import AccountSubTabs from "next-common/components/overview/account/subTabs";
import { useChainSettings } from "next-common/context/chain";
import { useMyDepositDemocracy } from "./democracy";
import DepositTemplate from "./depositTemplate";
import { useMyDepositFellowship } from "./fellowship";
import MyDepositPreimages from "./preimages";
import { useMyDepositReferenda } from "./referenda";
import { useMyDepositTreasury } from "./treasury";
import partition from "lodash.partition";
import { myPreimageDepositsSelector } from "next-common/store/reducers/myOnChainData/deposits/myPreimageDeposits";
import { useSelector } from "react-redux";
import IdentityDeposit from "./identity";

export default function MyDeposits() {
  const chainSettings = useChainSettings();
  const { hasReferenda, hasFellowship, hasTreasuryModule } = chainSettings;

  const referenda = useMyDepositReferenda();
  const fellowship = useMyDepositFellowship();
  const democracy = useMyDepositDemocracy();
  const treasury = useMyDepositTreasury();
  const preimageStatuses = useSelector(myPreimageDepositsSelector);

  const sections = [
    hasReferenda && {
      activeCount: referenda.activeCount,
      content: <DepositTemplate key="referenda" {...referenda} />,
    },
    hasFellowship && {
      activeCount: fellowship.activeCount,
      content: <DepositTemplate key="fellowship" {...fellowship} />,
    },
    !chainSettings.noDemocracyModule && {
      activeCount: democracy.activeCount,
      content: <DepositTemplate key="democracy" {...democracy} />,
    },
    hasTreasuryModule !== false && {
      activeCount: treasury.activeCount,
      content: <DepositTemplate key="treasury" {...treasury} />,
    },
    {
      activeCount: preimageStatuses?.length || 0,
      content: <MyDepositPreimages key="preimages" />,
    },
  ].filter(Boolean);

  const [activeSections, nonActiveSections] = partition(
    sections,
    (section) => section.activeCount > 0,
  );

  return (
    <div className="space-y-6">
      <AccountSubTabs />

      <div className="space-y-6">
        {activeSections.map((section) => section.content)}
        {nonActiveSections.map((section) => section.content)}
      </div>
      <IdentityDeposit />
    </div>
  );
}
