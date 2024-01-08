import { useChainSettings } from "next-common/context/chain";

export default function useProfileTabs(id) {
  const { hasReferenda, hasFellowship, noDemocracy, hasMultisig } =
    useChainSettings();

  const tabs = [
    {
      label: "Posted",
      url: `/user/${id}/posted`,
      exactMatch: false,
    },
  ];

  if (hasReferenda || hasFellowship || !noDemocracy) {
    tabs.push({
      label: "Votes",
      url: `/user/${id}/votes`,
    });
  }

  if (hasMultisig) {
    tabs.push({
      label: "Multisigs",
      url: `/user/${id}/multisigs`,
    });
  }

  return tabs;
}
