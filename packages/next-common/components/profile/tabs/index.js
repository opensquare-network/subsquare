import { useChainSettings } from "next-common/context/chain";
import { useSelector } from "react-redux";
import { profileActiveMultisigsCountSelector } from "next-common/store/reducers/profile/multisig";
import useDepositsCount from "next-common/hooks/profile/deposit/useDepositsCount";
import { usePageProps } from "next-common/context/page";
import { tryConvertToEvmAddress } from "next-common/utils/mixedChainUtil";
import { useProfileCollectivesTabs } from "./useProfileCollectivesTabs";

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
  const hasDemocracyModule = democracy && !democracy?.archived;
  const activeMultisigsCount = useSelector(profileActiveMultisigsCountSelector);
  const depositsCount = useDepositsCount();

  const maybeEvmAddress = tryConvertToEvmAddress(id);
  const prefix = `/user/${maybeEvmAddress}/`;

  const collectivesTabs = useProfileCollectivesTabs();

  const tabs = [
    {
      label: "Posted",
      url: `${prefix}posted`,
      exactMatch: false,
    },
  ];

  if (hasReferenda || hasFellowship || hasDemocracyModule) {
    tabs.push({
      label: "Votes",
      url: `${prefix}votes`,
    });
  }

  tabs.push({
    label: "Deposits",
    url: `${prefix}deposits`,
    count: depositsCount,
  });

  if (hasMultisig) {
    tabs.push({
      label: "Multisigs",
      url: `${prefix}multisigs`,
      count: activeMultisigsCount,
    });
  }

  if (hasReferenda || hasDemocracyModule) {
    tabs.push({
      label: "Delegation",
      url: `${prefix}delegation/received`,
      root: `${prefix}delegation`,
      exactMatch: false,
    });
  }

  if (integrations?.statescan) {
    tabs.push({
      label: "Transfers",
      url: `${prefix}transfers`,
      exactMatch: false,
    });

    if (hasIdentityTimeline) {
      tabs.push({
        label: "Identity",
        url: `${prefix}identity`,
        exactMatch: false,
      });
    }
  }

  if (proxy) {
    tabs.push({
      label: "Proxies",
      url: `${prefix}proxies/mine`,
      root: `${prefix}proxies`,
      exactMatch: false,
    });
  }

  tabs.push(...collectivesTabs);

  return tabs;
}
