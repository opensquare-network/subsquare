import { useChainSettings, useChain } from "next-common/context/chain";
import { useSelector } from "react-redux";
import { profileActiveMultisigsCountSelector } from "next-common/store/reducers/profile/multisig";
import useDepositsCount from "next-common/hooks/profile/deposit/useDepositsCount";
import { usePageProps } from "next-common/context/page";
import { tryConvertToEvmAddress } from "next-common/utils/mixedChainUtil";
import { useProfileCollectivesTabs } from "./useProfileCollectivesTabs";
import { isKintsugiChain } from "next-common/utils/chain";
import { cn } from "next-common/utils";

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
  const { id } = usePageProps();
  const {
    modules: {
      referenda: hasReferenda,
      fellowship: hasFellowship,
      democracy,
      proxy,
    },
    integrations,
    hasMultisig,
    hasIdentityTimeline,
  } = useChainSettings();
  const chain = useChain();
  const hasDemocracyModule = democracy && !democracy?.archived;
  const activeMultisigsCount = useSelector(profileActiveMultisigsCountSelector);
  const depositsCount = useDepositsCount();

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

    if (hasIdentityTimeline) {
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

  tabs.push(...collectivesTabs);

  return tabs;
}
