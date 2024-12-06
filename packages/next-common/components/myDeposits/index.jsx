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
import ProfileProxyDeposits from "next-common/components/profile/deposits/proxy";
import MyProxyDeposits, { useMyProxyDeposits } from "./proxy";

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
  const isAccountPage = pathname.startsWith("/account");

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

    const hasProfileProxyDeposits = proxy && isProfilePage;

    const hasMyProxyDeposits = proxy && isAccountPage;

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
      hasProfileProxyDeposits && {
        activeCount: proxyDeposits?.total,
        content: <ProfileProxyDeposits key="proxy" deposits={proxyDeposits} />,
      },
      hasMyProxyDeposits && {
        activeCount: proxyDeposits?.total,
        content: <MyProxyDeposits key="myProxy" deposits={proxyDeposits} />,
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
    isAccountPage,
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
  const proxyDeposits = useMyProxyDeposits();

  const [activeSections, nonActiveSections] = useDepositSections(
    referenda,
    fellowship,
    democracy,
    treasury,
    identity,
    preimageDeposits,
    proxyDeposits,
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
