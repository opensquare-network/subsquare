import { useChainSettings } from "next-common/context/chain";
import { useSelector } from "react-redux";
import { profileActiveMultisigsCountSelector } from "next-common/store/reducers/profile/multisig";
import useDepositsCount from "next-common/hooks/profile/deposit/useDepositsCount";

export default function useProfileTabs(id) {
  const { hasReferenda, hasFellowship, noDemocracy, hasMultisig } =
    useChainSettings();
  const activeMultisigsCount = useSelector(profileActiveMultisigsCountSelector);
  const depositsCount = useDepositsCount();
  const prefix = `/user/${id}/`;

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

  return tabs;
}
