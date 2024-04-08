import AccountInfo from "./accountInfo";
import RecentProposals from "./recentProposals";
import { useChainSettings } from "next-common/context/chain";
import CentrifugeStats from "./centrifugeStats";

export default function CentrifugeOverview() {
  const { showAccountManagementTab } = useChainSettings();

  return (
    <div className="space-y-6">
      <AccountInfo hideManageAccountLink={showAccountManagementTab === false} />

      <CentrifugeStats />

      <RecentProposals />
    </div>
  );
}
