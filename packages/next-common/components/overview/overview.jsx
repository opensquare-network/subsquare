import AccountInfo from "./accountInfo";
import ActiveProposals from "./activeProposals";
import {
  useChainSettings,
  useMenuHasTreasury,
} from "next-common/context/chain";
import TreasuryState from "./treasuryState";

export default function Overview() {
  const { showAccountManagementTab } = useChainSettings();
  const showTreasury = useMenuHasTreasury();

  return (
    <div className="space-y-6">
      <AccountInfo hideManageAccountLink={showAccountManagementTab === false} />

      {showTreasury && <TreasuryState />}

      <div>
        <ActiveProposals />
        {/* news */}
      </div>
    </div>
  );
}
