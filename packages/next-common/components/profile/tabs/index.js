import { useChainSettings, useChain } from "next-common/context/chain";
import useDepositsCount from "next-common/hooks/profile/deposit/useDepositsCount";
import { usePageProps } from "next-common/context/page";
import { tryConvertToEvmAddress } from "next-common/utils/mixedChainUtil";
import { useProfileCollectivesTabs } from "./useProfileCollectivesTabs";
import { isKintsugiChain } from "next-common/utils/chain";
import { cn } from "next-common/utils";
import { useProfileMultisigsActiveContext } from "next-common/components/profile/multisigs/context/profileMultisigsActiveContext";
import { isAssetHubMigrated } from "next-common/utils/consts/isAssetHubMigrated";

export function TabTitle({ active, children }) {
  return (
    <div
      className={cn(
        "text16Bold",
        active ? "text-textPrimary" : "text-textTertiary",
      )}
      role="button"
    >
      {children}
    </div>
  );
}

export default function useProfileTabs() {
  const { id, beneficiariesSummary } = usePageProps();
  const {
    modules: {
      referenda: hasReferenda,
      fellowship: hasFellowship,
      democracy,
      proxy,
      vesting,
    },
    integrations,
    hasMultisig,
    hasIdentity,
  } = useChainSettings();
  const chain = useChain();
  const hasDemocracyModule = democracy && !democracy?.archived;
  const depositsCount = useDepositsCount();
  const { activeCount: activeMultisigsCount } =
    useProfileMultisigsActiveContext();

  const maybeEvmAddress = tryConvertToEvmAddress(id);
  const prefix = `/user/${maybeEvmAddress}/`;

  const collectivesTabs = useProfileCollectivesTabs();
  const tabs = [
    {
      label({ active }) {
        return <TabTitle active={active}>Posted</TabTitle>;
      },
      value: "posted",
      url: `${prefix}posted`,
      exactMatch: false,
    },
  ];

  if (hasReferenda || hasFellowship || hasDemocracyModule) {
    tabs.push({
      label({ active }) {
        return <TabTitle active={active}>Votes</TabTitle>;
      },
      value: "votes",
      url: `${prefix}votes`,
    });
  }

  tabs.push({
    label({ active }) {
      return <TabTitle active={active}>Deposits</TabTitle>;
    },
    value: "deposits",
    url: `${prefix}deposits`,
    activeCount: depositsCount,
  });

  if (hasMultisig) {
    tabs.push({
      label({ active }) {
        return <TabTitle active={active}>Multisigs</TabTitle>;
      },
      value: "multisigs",
      url: `${prefix}multisigs`,
      activeCount: activeMultisigsCount,
    });
  }

  if ((hasReferenda || hasDemocracyModule) && !isKintsugiChain(chain)) {
    tabs.push({
      label({ active }) {
        return <TabTitle active={active}>Delegation</TabTitle>;
      },
      value: "delegation",
      url: `${prefix}delegation/received`,
      root: `${prefix}delegation`,
      exactMatch: false,
    });
  }

  if (integrations?.statescan) {
    tabs.push({
      label({ active }) {
        return <TabTitle active={active}>Transfers</TabTitle>;
      },
      value: "transfers",
      url: `${prefix}transfers`,
      exactMatch: false,
    });

    if (beneficiariesSummary) {
      tabs.push({
        label({ active }) {
          return <TabTitle active={active}>Treasury</TabTitle>;
        },
        value: "treasury",
        url: `${prefix}treasury`,
      });
    }

    if (hasIdentity) {
      tabs.push({
        label({ active }) {
          return <TabTitle active={active}>Identity</TabTitle>;
        },
        value: "identity",
        url: `${prefix}identity`,
        exactMatch: false,
      });
    }
  }

  if (proxy) {
    tabs.push({
      label({ active }) {
        return <TabTitle active={active}>Proxies</TabTitle>;
      },
      value: "proxies",
      url: `${prefix}proxies/mine`,
      root: `${prefix}proxies`,
      exactMatch: false,
    });
  }

  if (isAssetHubMigrated()) {
    tabs.push({
      label({ active }) {
        return <TabTitle active={active}>Assets</TabTitle>;
      },
      value: "assets",
      url: `${prefix}assets`,
      root: `${prefix}assets`,
    });
  }

  if (vesting) {
    tabs.push({
      label({ active }) {
        return <TabTitle active={active}>Vesting</TabTitle>;
      },
      value: "vesting",
      url: `${prefix}vesting`,
    });
  }

  tabs.push(...collectivesTabs);

  return tabs;
}
