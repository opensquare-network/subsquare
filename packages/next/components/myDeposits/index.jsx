import { AccountSubTabs } from "components/overview/account/subTabs";
import { useChainSettings } from "next-common/context/chain";
import MyDemocracyDeposits from "./democracy";
import MyFellowshipDeposits from "./fellowship";
import MyReferendaDeposits from "./referenda";
import MyTreasuryDeposits from "./treasury";

export default function MyDeposits() {
  const { hasReferenda, hasFellowship } = useChainSettings();

  return (
    <div className="space-y-6">
      <AccountSubTabs />

      <div className="space-y-6">
        {hasReferenda && <MyReferendaDeposits />}
        {hasFellowship && <MyFellowshipDeposits />}
        <MyDemocracyDeposits />
        <MyTreasuryDeposits />
      </div>
    </div>
  );
}
