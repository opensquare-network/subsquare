import AccountInfo from "./accountInfo";
import ActiveProposals from "./activeProposals";
import { useChainSettings } from "next-common/context/chain";

export default function Overview() {
  const { showAccountManagementTab } = useChainSettings();

  return (
    <div className="space-y-6">
      <AccountInfo hideManageAccountLink={showAccountManagementTab === false} />

      <div>
        <ActiveProposals />
        {/* news */}
      </div>
    </div>
  );
}
