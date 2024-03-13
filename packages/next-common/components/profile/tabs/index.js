import { useChainSettings } from "next-common/context/chain";
import { useSelector } from "react-redux";
import { profileActiveMultisigsCountSelector } from "next-common/store/reducers/profile/multisig";
import useDepositsCount from "next-common/hooks/profile/deposit/useDepositsCount";
import { usePageProps } from "next-common/context/page";
import { tryConvertToEvmAddress } from "next-common/utils/hydradxUtil";

export default function useProfileTabs() {
  const { id } = usePageProps();
  const {
    hasReferenda,
    hasFellowship,
    noDemocracy,
    noDemocracyModule,
    hasMultisig,
    hasStatescan,
  } = useChainSettings();
  const activeMultisigsCount = useSelector(profileActiveMultisigsCountSelector);
  const depositsCount = useDepositsCount();

  const maybeEvmAddress = tryConvertToEvmAddress(id);
  const prefix = `/user/${maybeEvmAddress}/`;

  const tabs = [
    {
      label: "Posted",
      url: `${prefix}posted`,
      exactMatch: false,
    },
  ];

  if (hasReferenda || hasFellowship || !noDemocracy) {
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

  if (hasReferenda || !noDemocracyModule) {
    tabs.push({
      label: "Delegation",
      url: `${prefix}delegation/received`,
      exactMatch: false,
    });
  }

  if (hasStatescan) {
    tabs.push({
      label: "Transfers",
      url: `${prefix}transfers`,
      exactMatch: false,
    });

    tabs.push({
      label: "Identity timeline",
      url: `${prefix}identity-timeline`,
      exactMatch: false,
    });
  }

  return tabs;
}
