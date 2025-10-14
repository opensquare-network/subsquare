import { useChainSettings } from "next-common/context/chain";
import { useTreasuryProposalListUrl } from "next-common/context/treasury";

export default function useLayoutTabs(pallet = "treasury") {
  const { integrations } = useChainSettings();
  const treasuryProposalListUrl = useTreasuryProposalListUrl(pallet);

  return [
    {
      value: "proposals",
      label: "Proposals",
      url: treasuryProposalListUrl,
    },
    integrations?.doTreasury && {
      value: "statistics",
      label: "Statistics",
      url: "/treasury/statistics",
    },
  ].filter(Boolean);
}
