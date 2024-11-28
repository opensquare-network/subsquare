import AccountSubTabs from "next-common/components/overview/account/subTabs";
import { useChainSettings } from "next-common/context/chain";
import { useMyDepositDemocracy } from "./democracy";
import DepositTemplate from "./depositTemplate";
import { useMyDepositFellowship } from "./fellowship";
import MyDepositPreimages from "./preimages";
import { useMyDepositReferenda } from "./referenda";
import { useMyDepositTreasury } from "./treasury";
import { partition } from "lodash-es";
import { myPreimageDepositsSelector } from "next-common/store/reducers/myOnChainData/deposits/myPreimageDeposits";
import { useSelector } from "react-redux";
import useMyIdentityDeposit from "next-common/hooks/useMyIdentityDeposit";
import IdentityDeposit from "./identity";
import { useMemo } from "react";
import WithPallet from "../common/withPallet";
import { usePathname } from "next/navigation";
import ProxyDeposits from "next-common/components/profile/deposits/proxy";

export function useDepositSections(
  referenda,
  fellowship,
  democracy,
  treasury,
  identity,
  preimageDeposits,
  proxyDeposits,
) {
  const chainSettings = useChainSettings();
  const pathname = usePathname();
  const isProfilePage = pathname.startsWith("/user");

  return useMemo(() => {
    const {
      modules: {
        referenda: hasReferenda,
        fellowship: hasFellowship,
        democracy: hasDemocracy,
        treasury: hasTreasury,
        proxy,
      },
    } = chainSettings;

    const hasDemocracyModule = hasDemocracy && !hasDemocracy?.archived;

    const hasTreasuryTips = hasTreasury?.tips && !hasTreasury?.tips?.archived;

    const hasProxyDeposits = proxy && isProfilePage;

    const sections = [
      hasReferenda && {
        activeCount: referenda.activeCount,
        content: <DepositTemplate key="referenda" {...referenda} />,
      },
      hasFellowship && {
        activeCount: fellowship.activeCount,
        content: <DepositTemplate key="fellowship" {...fellowship} />,
      },
      hasDemocracyModule && {
        activeCount: democracy.activeCount,
        content: <DepositTemplate key="democracy" {...democracy} />,
      },
      hasTreasuryTips && {
        activeCount: treasury.activeCount,
        content: <DepositTemplate key="treasury" {...treasury} />,
      },
      {
        activeCount: preimageDeposits?.length || 0,
        content: (
          <MyDepositPreimages key="preimages" deposits={preimageDeposits} />
        ),
      },
      {
        activeCount: identity?.depositsCount || 0,
        content: (
          <WithPallet key="identity" pallet="identity">
            <IdentityDeposit deposits={identity} />
          </WithPallet>
        ),
      },
      hasProxyDeposits && {
        activeCount: proxyDeposits?.total,
        content: <ProxyDeposits key="proxy" deposits={proxyDeposits} />,
      },
    ].filter(Boolean);

    return partition(sections, (section) => section.activeCount > 0);
  }, [
    referenda,
    fellowship,
    democracy,
    treasury,
    identity,
    preimageDeposits,
    proxyDeposits,
    isProfilePage,
    chainSettings,
  ]);
}

export default function MyDeposits() {
  const referenda = useMyDepositReferenda();
  const fellowship = useMyDepositFellowship();
  const democracy = useMyDepositDemocracy();
  const treasury = useMyDepositTreasury();
  const identity = useMyIdentityDeposit();
  const preimageDeposits = useSelector(myPreimageDepositsSelector);

  const [activeSections, nonActiveSections] = useDepositSections(
    referenda,
    fellowship,
    democracy,
    treasury,
    identity,
    preimageDeposits,
  );

  return (
    <div className="space-y-6">
      <AccountSubTabs className="mx-6" />

      <div className="space-y-6">
        {activeSections.map((section) => section.content)}
        {nonActiveSections.map((section) => section.content)}
      </div>
    </div>
  );
}
